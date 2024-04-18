import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import { isMesh } from '@/utils/tools';


export class ParticleTrack {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	points: THREE.Vector3[][] = [];
	Curves: THREE.Vector3[][] = [];

	spaceCount: number = 1000;
	material!: THREE.ShaderMaterial;
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, false, { stats: false });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		this.mapRender.activeCamera.position.copy(new THREE.Vector3(0, 40, 130));
		this.mapRender.activeControls.enabled = false;
		await this.handleModel();
		this.createPoint();
		this.startRender();

	}
	createPoint() {
		const material = new THREE.ShaderMaterial({
			vertexColors: true,
			vertexShader: Render.math.parseGLSLChunk(vs),
			fragmentShader: Render.math.parseGLSLChunk(fs),
			defines: {
				USE_COLOR_MAP: true,
				PATH_LENGTH: this.spaceCount + 1,
				PATH_MAX: this.spaceCount.toFixed(1)

			},
			uniforms: {
				u_Time: Render.GlobalTime,
				u_Path: {
					value: [],
				},

			},
			transparent: true
		});
		for (const point of this.points) {

			const paths = point.map(item => {
				return new THREE.Vector4(item.x, item.y, item.z, THREE.MathUtils.randFloat(0, 1));
			});
			const pointMaterial = material.clone();
			pointMaterial.uniforms.u_Path.value = paths;
			pointMaterial.uniforms.u_Time = Render.GlobalTime;
			pointMaterial.depthWrite = false;
			pointMaterial.depthTest = false;

			const buffGeometry = Render.math.createParticleBuffer({
				count: 2000,
				nextRange: [[-250, 250], [-250, 250], [-250, 250]],
			});
			const pointMesh = new THREE.Points(buffGeometry, pointMaterial);

			pointMesh.frustumCulled = false;
			this.group.add(pointMesh);
		}

	}
	async handleModel() {
		const { scene: model } = await Render.modelLoadByGLTF.loadAsync('/model/螺旋线.glb');
		model.children.forEach((mesh, index) => {
			this.points[index] = [];
			if (isMesh(mesh)) {
				const position = mesh.geometry.getAttribute("position");
				const { itemSize, count, array } = position;
				for (let i = 0, len = count * 3; i < len; i += itemSize) {
					this.points[index].push(new THREE.Vector3(array[i], array[i + 1], array[i + 2]));
				}
				this.points[index] = new THREE.CatmullRomCurve3(this.points[index]).getSpacedPoints(this.spaceCount);
			}
		});
		Render.GCPool.disposeGroup(model);
	}

	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
