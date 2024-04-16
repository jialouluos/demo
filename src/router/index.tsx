import App from '../App';
import { Routes, Route } from 'react-router-dom';
import { DEMO } from '@/types';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { WindingShader } from '@/pages/WindingShader';
import { SnowFlakeShader } from '@/pages/SnowFlakeShader';
import { WebWorkerDemoPage } from '@/components/codeShow/WebWorkerDemoPage';
import { WindowMessagePage } from '@/components/codeShow/WindowMessagePage';
export const RouteConfigs: DEMO[] = [
	{
		name: '(hook)useBCState',
		path: '/hooks/window-message',
		element: <WindowMessagePage />,
		dec: '通过BroadcastChannel实现跨窗口通信',
		pre_img: '',
	},
	{
		name: '(hook)useWebWorker',
		path: '/hooks/webworker',
		element: <WebWorkerDemoPage />,
		dec: '结合Comlink实现动态创建webWorker',
		pre_img: '',
	},
	{
		name: '(shader)Winding',
		path: '/shader/winding',
		element: <WindingShader />,
		dec: '',
		pre_img: 'pre/winding.png',
	},
	{
		name: '(shader)SnowFlake',
		path: '/shader/snowflake',
		element: <SnowFlakeShader />,
		dec: '',
		pre_img: 'pre/snowflake.png',
	},
];
const MyRouter = () => (
	<Router>
		<Routes>
			<Route
				path={'/'}
				element={<App />}></Route>
			{RouteConfigs.map(item => {
				return (
					<Route
						key={item.path}
						path={item.path}
						element={item.element}></Route>
				);
			})}
			<Route
				path='*'
				element={
					<Navigate
						replace
						to='/'
					/>
				}
			/>
		</Routes>
	</Router>
);

export default MyRouter;
