import App from '../App';
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DEMO } from '@/types';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';

const VFXImageShader = lazy(() => import('@/pages/VFXImageShader'));
const FuzzyTransitionShader = lazy(() => import('@/pages/FuzzyTransitionShader'));
const WaveImageShader = lazy(() => import('@/pages/WaveImage'));
const SimpleFbmShader = lazy(() => import('@/pages/SimpleFbmShader'));

const SimpleSDFShader = lazy(() => import('@/pages/SimpleSDFShader'));
const LoopShader = lazy(() => import('@/pages/LoopShader'));

const SimpleSDFShadowShader = lazy(() => import('@/pages/SimpleSDFShadowShader'));
const CodeWaterfallShader = lazy(() => import('@/pages/CodeWaterfallShader'));
const ParticleExplosionMesh = lazy(() => import('@/pages/ParticleExplosionMesh'));
const ParticleTrackMesh = lazy(() => import('@/pages/ParticleTrackMesh'));

const DewdropShader = lazy(() => import('@/pages/DewdropShader'));
const ParticleSkyMesh = lazy(() => import('@/pages/ParticleSkyMesh'));
const FlyLineMesh = lazy(() => import('@/pages/FlyLineMesh'));
const ShardImageMesh = lazy(() => import('@/pages/ShardImageMesh'));
const SnowFlakeShader = lazy(() => import('@/pages/SnowFlakeShader'));

const FlameShader = lazy(() => import('@/pages/FlameShader'));
const ExtrudeGeometryUVFixPage = lazy(() => import('@/pages/ExtrudeGeometryUVFixMesh'));
const LineMergeDrawMesh = lazy(() => import('@/pages/LineMergeDrawMesh'));
const DigitalScrollDemo = lazy(() => import('@/pages/DigitalScrollDemoPage'));

const WindowMessagePage = lazy(() => import('@/pages/WindowMessagePage'));
const WebWorkerDemoPage = lazy(() => import('@/pages/WebWorkerDemoPage'));
const WindingShader = lazy(() => import('@/pages/WindingShader'));

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
	{
		zh: '挤压几何体UV修正',
		name: '(mesh)extrudeGeoUVFix',
		path: '/mesh/extrude-geometry-uv-fix',
		element: <ExtrudeGeometryUVFixPage />,
		dec: '',
		pre_img: 'pre/extrude-geometry-uv-fix.png',
	},
	{
		zh: '线顶点合并',
		name: '(mesh)lineMergeDraw',
		path: '/mesh/line-merge-draw',
		element: <LineMergeDrawMesh />,
		dec: '',
		pre_img: 'pre/line-merge-draw.png',
	},
	{
		zh: '数字滚动',
		name: '(css)digital-scroll',
		path: '/css/digital-scroll',
		element: <DigitalScrollDemo />,
		dec: '',
		pre_img: 'pre/digital-scroll.png',
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
// 			: item.name.includes('(css)')
// 			? 4
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
