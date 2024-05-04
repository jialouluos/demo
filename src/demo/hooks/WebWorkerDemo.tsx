import { useState } from 'react';
import { useWebWorker } from '@/hooks/useWebWorker';

export default () => {
	const [proxy] = useState(() =>
		useWebWorker(() => {
			return {
				name: 'hello worker',
				handleSomeData: (data: any) => {
					console.log(data);
					return { tag: '我是新数据被返回了' };
				},
			};
		})
	);
	const run = async () => {
		console.log(await proxy.name);
		console.log(await proxy.handleSomeData({ tag: '我是老数据' }));
	};

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<button
				style={{
					width: '100px',
					height: '50px',
					cursor: 'pointer',
				}}
				onClick={() => run()}>
				点击我开始工作
			</button>
		</div>
	);
};
