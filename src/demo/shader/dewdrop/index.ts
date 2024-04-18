import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import matcap from '@/assets/img/matcap_2.png';

export class Dewdrop {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, true, { stats: false });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		const geometry = new THREE.PlaneGeometry(
			1,
			1,
			1,
			1
		);
		const bg = await Render.textureLoader.loadAsync(matcap);

		const material = new THREE.ShaderMaterial({
			vertexShader: Render.math.parseGLSLChunk(vs),
			fragmentShader: Render.math.parseGLSLChunk(fs),
			uniforms: {
				u_Time: Render.GlobalTime,
				u_Mouse: {
					value: new THREE.Vector2(0, 0)
				},
				u_Resolution: {
					value: new THREE.Vector2(window.innerWidth, window.innerHeight)
				},
				u_Texture: {
					value: bg
				},
				u_Progress: {
					value: 1
				},
				u_VelocityBox: {
					value: 0.25
				},
				u_VelocitySphere: {//速度
					value: 0.2
				},
				u_Angle: {
					value: 1.5
				},
				u_Distance: {//球下落的距离
					value: 2.9
				},
				u_IsTexture: {
					value: 1.0
				},
				u_Bias: {
					value: 0.0
				},
				u_BiaScale: {
					value: 0.4
				}
			},
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.scene.add(mesh);
		mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		this.mapRender.onSizeChange = () => {
			mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		};
		this.startRender();

	}
	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
