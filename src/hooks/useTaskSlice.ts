

export const _runTask = <T extends any = any>(task: () => T, resolve: (value: T) => void, reject: (reason?: any) => void, lastTime: number) => {

    if ('requestIdleCallback' in window) {
        requestIdleCallback(idle => {

            const remainingTime = idle.timeRemaining();
            if (remainingTime > 2 || new Date().getTime() - lastTime > 2000) {
                //至少剩余2ms或者延迟到2000ms
                Promise.resolve(task()).then(resolve).catch(reject);
            } else {
                console.log('loop');
                _runTask(task, resolve, reject, lastTime);
            }
        });
    } else
        if ('requestAnimationFrame' in window) {
            const selfLastTime = new Date().getTime();
            requestAnimationFrame(() => {
                const nowTime = new Date().getTime();
                if (nowTime - selfLastTime > 16.6) {
                    return Promise.resolve(task()).then(resolve).catch(reject);
                } else {
                    return _runTask(task, resolve, reject, lastTime);
                }
            });
        } else {
            //no run
        }
};



export const runTask = <T extends any>(task: () => T): Promise<T> => {
    return new Promise<T>((_res, _rej) => {
        _runTask(task, _res, _rej, new Date().getTime());
    });
};
const _runTaskStream = <T extends any[]>(taskList: ((...args: any[]) => T)[], resolveList: (T)[] = [], resolve: (value: any) => void, reject: (reason?: any) => void, lastResolve: T) => {


    if (!taskList.length) {
        resolve(resolveList);
    } else {
        const task = taskList.shift()!;
        runTask<typeof task extends () => infer R ? R : any>(() => task(lastResolve)).then(returnValue => {
            resolveList.push(returnValue);
            _runTaskStream(taskList, resolveList, resolve, reject, returnValue);
        });
    }



};
export const runTaskStream = <T>(taskList: ((...args: any[]) => any | Promise<any>)[],) => {
    return new Promise<T>((_res, _rej) => {
        _runTaskStream(taskList, [], _res, _rej, undefined,);
    });
};

