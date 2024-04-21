import { transfer, wrap } from 'comlink';
export const useWebWorker = <T>(handleObject: () => T, buffers: ArrayBuffer[] = []): T => {
    const workerBuildString = `
    importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
    (()=>{
        const handleObject = (${handleObject})();
        Comlink.expose(handleObject);
    })()`;
    const blob = new Blob([workerBuildString], { type: 'text/javascript' });
    for (const buffer of buffers) {
        transfer(buffer, [buffer]);
    }
    return wrap<any>(new Worker(URL.createObjectURL(blob)));
};