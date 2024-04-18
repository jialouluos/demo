import App from '../App';
import { Routes, Route } from 'react-router-dom';
import { DEMO } from '@/types';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { WindingShader } from '@/pages/WindingShader';
import { SnowFlakeShader } from '@/pages/SnowFlakeShader';
import { WebWorkerDemoPage } from '@/components/codeShow/WebWorkerDemoPage';
import { WindowMessagePage } from '@/components/codeShow/WindowMessagePage';
import { FlameShader } from '@/pages/FlameShader';
import { VFXImageShader } from '@/pages/VFXImageShader';
import { FuzzyTransitionShader } from '@/pages/FuzzyTransitionShader';
import { WaveImageShader } from '@/pages/WaveImage';
import { SimpleFbmShader } from '@/pages/SimpleFbmShader';
import { LoopShader } from '@/pages/LoopShader';
import { SimpleSDFShader } from '@/pages/SimpleSDFShader';
import { SimpleSDFShadowShader } from '@/pages/SimpleSDFShadowShader';
import { CodeWaterfallShader } from '@/pages/CodeWaterfallShader';

import { ParticleExplosionMesh } from '@/pages/ParticleExplosionMesh';
import { ParticleTrackMesh } from '@/pages/ParticleTrackMesh';
import { ParticleSkyMesh } from '@/pages/ParticleSkyMesh';
import { DewdropShader } from '@/pages/DewdropShader';
import { ShardImageMesh } from '@/pages/ShardImageMesh';
import { FlyLineMesh } from '@/pages/FlyLineMesh';
export const RouteConfigs: DEMO[] = [
	{
		zh: 'useBCState',
		name: '(hook)useBCState',
		path: '/hooks/window-message',
		element: <WindowMessagePage />,
		dec: '通过BroadcastChannel实现跨窗口通信',
		pre_img: '',
	},
	{
		zh: 'useWebWorker',
		name: '(hook)useWebWorker',
		path: '/hooks/webworker',
		element: <WebWorkerDemoPage />,
		dec: '结合Comlink实现动态创建webWorker',
		pre_img: '',
	},
	{
		zh: '粒子卷绕',
		name: '(shader)Winding',
		path: '/shader/winding',
		element: <WindingShader />,
		dec: '',
		pre_img: 'pre/winding.png',
	},
	{
		zh: '漫天雪花',
		name: '(shader)snowFlake',
		path: '/shader/snowflake',
		element: <SnowFlakeShader />,
		dec: '',
		pre_img: 'pre/snowflake.png',
	},
	{
		zh: '模糊转场',
		name: '(shader)fuzzyTransition',
		path: '/shader/fuzzy-transition',
		element: <FuzzyTransitionShader />,
		dec: '',
		pre_img: 'pre/fuzzy-transition.png',
	},
	{
		zh: '图片视效',
		name: '(shader)VFXImage',
		path: '/shader/vfx',
		element: <VFXImageShader />,
		dec: '',
		pre_img: 'pre/vfx.png',
	},
	{
		zh: '纹理波浪',
		name: '(shader)WaveImage',
		path: '/shader/wave',
		element: <WaveImageShader />,
		dec: '',
		pre_img: 'pre/wave.png',
	},
	{
		zh: '纹理波浪',
		name: '(shader)Flame',
		path: '/shader/flame',
		element: <FlameShader />,
		dec: '',
		pre_img: 'pre/flame.png',
	},
	{
		zh: '简易fbm',
		name: '(shader)simpleFbm',
		path: '/shader/simple-fbm',
		element: <SimpleFbmShader />,
		dec: '',
		pre_img: 'pre/simple-fbm.png',
	},
	{
		zh: 'loop',
		name: '(shader)Loop',
		path: '/shader/loop',
		element: <LoopShader />,
		dec: '',
		pre_img: 'pre/loop.png',
	},
	{
		zh: '简易SDF',
		name: '(shader)simpleSDF',
		path: '/shader/simple-sdf',
		element: <SimpleSDFShader />,
		dec: '',
		pre_img: 'pre/simple-sdf.png',
	},
	{
		zh: '简易SDF阴影',
		name: '(shader)simpleSDFShadow',
		path: '/shader/simple-sdf-shadow',
		element: <SimpleSDFShadowShader />,
		dec: '',
		pre_img: 'pre/simple-sdf-shadow.png',
	},
	{
		zh: '编码瀑布',
		name: '(shader)codeWaterfall',
		path: '/shader/code-waterfall',
		element: <CodeWaterfallShader />,
		dec: '',
		pre_img: 'pre/code-waterfall.png',
	},
	{
		zh: '滴落露珠',
		name: '(shader)Dewdrop',
		path: '/shader/dewdrop',
		element: <DewdropShader />,
		dec: '',
		pre_img: 'pre/dewdrop.png',
	},
	{
		zh: '粒子爆炸',
		name: '(mesh)particleExplosion',
		path: '/mesh/particle-explosion',
		element: <ParticleExplosionMesh />,
		dec: '',
		pre_img: 'pre/particle-explosion.png',
	},
	{
		zh: '粒子轨迹',
		name: '(mesh)particleTrack',
		path: '/mesh/particle-track',
		element: <ParticleTrackMesh />,
		dec: '',
		pre_img: 'pre/particle-track.png',
	},
	{
		zh: '粒子星空',
		name: '(mesh)particleSky',
		path: '/mesh/particle-sky',
		element: <ParticleSkyMesh />,
		dec: '',
		pre_img: 'pre/particle-sky.png',
	},
	{
		zh: '碎片切换',
		name: '(mesh)shardImage',
		path: '/mesh/shard-image',
		element: <ShardImageMesh />,
		dec: '',
		pre_img: 'pre/shard-image.png',
	},
	{
		zh: '飞线',
		name: '(mesh)flyLine',
		path: '/mesh/fly-line',
		element: <FlyLineMesh />,
		dec: '',
		pre_img: 'pre/fly-line.png',
	},
];
// const iframeJson = RouteConfigs.map(item => {
// 	return {
// 		title: item.zh,
// 		id: item.path,
// 		iframe_url: 'https://www.demo.harver.cn' + item.path,
// 		catalog_id: item.name.includes('(mesh)')
// 			? 2
// 			: item.name.includes('(shader)')
// 			? 3
// 			: item.name.includes('(hook)')
// 			? 1
// 			: -1,
// 		description: item.dec,
// 		order: 2,
// 		pre_img: item.pre_img ? 'https://www.demo.harver.cn/' + item.pre_img : '',
// 	};
// });
// console.log(iframeJson);
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
