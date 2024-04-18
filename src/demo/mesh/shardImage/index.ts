import { Render } from '@/engine/Render';
import * as THREE from 'three';
import lenshen from '@/assets/img/leishen.png';
import dongman from '@/assets/img/dongman.png';
import bg_h from '@/assets/img/bg_h.jpg';
import keqing from '@/assets/img/keqing.jpg';
import { Geometry } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/deprecated/Geometry.js";
import * as BAS from 'three-bas';


export class ShardImage {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	points: THREE.Vector3[][] = [];
	Curves: THREE.Vector3[][] = [];

	spaceCount: number = 1000;
	material!: THREE.ShaderMaterial;
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, true, { stats: false });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		this.mapRender.activeCamera.position.copy(new THREE.Vector3(0, 0, 50));
		const bg_w_1 = await Render.textureLoader.loadAsync(lenshen);
		const bg_w_2 = await Render.textureLoader.loadAsync(dongman);
		const bg_h_1 = await Render.textureLoader.loadAsync(bg_h);
		const bg_h_2 = await Render.textureLoader.loadAsync(keqing);
		this.initModel("in", this.mapRender.aspect > 1.25 ? bg_w_1 : bg_h_1);
		this.initModel("out", this.mapRender.aspect > 1.25 ? bg_w_2 : bg_h_2);
		this.startRender();
	}
	initModel(PathImgMethod: "in" | "out", img: THREE.Texture) {

		const height = this.mapRender.canvasSize.y / 6;
		const width = this.mapRender.canvasSize.x / 6;
		const PlaneGeometry = new Geometry().fromBufferGeometry(new THREE.PlaneGeometry(width, height, width * 2, height * 2));
		BAS.Utils.separateFaces(PlaneGeometry);
		const BasGeometry = new BAS.ModelBufferGeometry(PlaneGeometry, {
			//将此设置为true将存储顶点相对于其所在面的位置
			//这样，可以更容易地围绕其自身中心旋转和缩放面
			localizeFaces: true,
			//将此设置为true将为阵列中的每个面存储一个质心
			computeCentroids: true
		});//预制几何面
		// 缓冲UV，以便正确映射纹理
		BasGeometry.bufferUvs();
		const LocalDelay = BasGeometry.createAttribute("aDelay", 2);//延迟
		const minDuration = 0.8;
		const maxDuration = 1.2;
		const maxDelayX = 0.9;
		const maxDelayY = 0.125;
		const stretch = 0.11;

		for (let i = 0, offset = 0; i < BasGeometry.faceCount; i++) {
			const centroid = BasGeometry.centroids[i];
			const currentFaceDuration = THREE.MathUtils.randFloat(minDuration, maxDuration);
			const delayX = THREE.MathUtils.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
			let delayY;
			if (PathImgMethod === "in") {
				delayY = THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY);
			}
			else {
				delayY = THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0);
			}
			for (let j = 0; j < 3; j++) {
				LocalDelay.array[offset] = delayX + delayY + (Math.random() * stretch * currentFaceDuration);
				LocalDelay.array[offset + 1] = currentFaceDuration;
				offset += 2;
			}
		}
		BasGeometry.createAttribute("aStartPosition", 3, function (data: any[], i: number) {
			BasGeometry.centroids[i].toArray(data);
		});
		BasGeometry.createAttribute("aEndPosition", 3, function (data: any[], i: number) {
			BasGeometry.centroids[i].toArray(data);
		});
		const LocalControls0 = BasGeometry.createAttribute("aControls0", 3);
		const LocalControls1 = BasGeometry.createAttribute("aControls1", 3);
		const Controls0 = new THREE.Vector3();
		const Controls1 = new THREE.Vector3();
		const data: any[] = [];
		for (let i = 0; i < BasGeometry.faceCount; i++) {

			const centroid = BasGeometry.centroids[i];
			const signY = Math.sign(centroid.y);//返回参数的正负号
			Controls0.x = THREE.MathUtils.randFloat(0.6, 0.9) * 50;
			Controls0.y = signY * Math.sin(centroid.y) * THREE.MathUtils.randFloat(0.3, 0.6) * 0.7;
			Controls0.z = THREE.MathUtils.randFloatSpread(50);

			Controls1.x = THREE.MathUtils.randFloat(0.6, 0.9) * 50;
			Controls1.y = -signY * Math.cos(centroid.y) * THREE.MathUtils.randFloat(0.1, 0.9) * 0.7;
			Controls1.z = THREE.MathUtils.randFloatSpread(50);
			if (PathImgMethod === "in") {
				Controls0.subVectors(centroid, Controls0);
				Controls1.subVectors(centroid, Controls1);
			}
			else {
				Controls0.addVectors(centroid, Controls0);
				Controls1.addVectors(centroid, Controls1);
			}

			BasGeometry.setFaceData(LocalControls0, i, Controls0.toArray(data));
			BasGeometry.setFaceData(LocalControls1, i, Controls1.toArray(data));
		}

		const BasMaterial = new BAS.BasicAnimationMaterial({
			flatShading: true,//阴影
			uniforms: {
				u_Time: Render.GlobalTime
			},
			//uniformValues:{}用来放平常我们创建材质时放置的那些属性，目前已被弃用，更新为和Three js 一样的用法，直接放在参数里
			metalness: 1.0,
			roughness: 1.0,
			map: img,
			//上面三排原本是放入uniformValues中的，现在可以直接放在参数里
			//下面我们来了解一下vertexFunctions
			vertexFunctions: [
				BAS.ShaderChunk['cubic_bezier'],
				BAS.ShaderChunk['ease_cubic_in'],//将一些缓冲值动画函数写入到着色器中
				BAS.ShaderChunk['ease_cubic_out'],
				BAS.ShaderChunk['ease_cubic_in_out'],
				BAS.ShaderChunk['ease_back_out'],
				BAS.ShaderChunk['quaternion_rotation'],
			],
			//vertexParameters 对应的是顶点着色器的变量声明部分，与shaderMaterial不同，目前我的理解应该是他将VertexShader分为声明部分以及main部分，并做增添而不是直接替换
			vertexParameters: [
				'uniform float u_Time;',
				'attribute vec3 aStartPosition;',
				'attribute vec3 aEndPosition;',
				'attribute vec3 aControls0;',
				'attribute vec3 aControls1;',
				'attribute vec2 aDelay;',
			],
			vertexPosition: [
				'float tProgress = clamp(u_Time - aDelay.x, 0.0, aDelay.y) / aDelay.y;',//u_Time 影响一个动画的时间
				(PathImgMethod === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
				'transformed += cubicBezier(aStartPosition, aControls0, aControls1, aEndPosition, tProgress);',//transformed Three内置变量
			],//vertexPosition 这是与上面对应的main部分
		});
		BasMaterial.frustumCulled = false;
		const BASMesh = new THREE.Mesh(BasGeometry, BasMaterial);
		this.group.add(BASMesh);
		this.mapRender.addListener("pointerMove", ({ relativeCoord }) => {
			BasMaterial.uniforms.u_Time.value = relativeCoord.x * 3.0;
			BasMaterial.uniformsNeedUpdate = true;
		});
		return BASMesh;
	}

	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
