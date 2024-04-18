import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';

export class SimpleSDFShadow {
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

		const material = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,
			uniforms: {
				u_Time: Render.GlobalTime,
				u_Size: {
					value: this.mapRender.canvasSize
				},
				u_Mouse: {
					value: this.mapRender.mousePos.current
				}
			},
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.scene.add(mesh);
		mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		this.mapRender.onSizeChange = () => {
			material.uniforms.u_Size.value = this.mapRender.canvasSize;
			material.uniformsNeedUpdate = true;
			mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		};
		this.mapRender.onRender = () => {
			material.uniforms.u_Mouse.value = this.mapRender.mousePos.current;
			material.uniformsNeedUpdate = true;
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
