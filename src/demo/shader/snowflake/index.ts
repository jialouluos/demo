import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import bg_h from '@/assets/img/bg_h.jpg';
import bg_w from '@/assets/img/bg_w.jpg';
export class SnowFlake {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, true, { stats: true });
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
		const texture_h = await Render.textureLoader.loadAsync(bg_h);
		const texture_w = await Render.textureLoader.loadAsync(bg_w);
		const material = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,
			uniforms: {
				u_Time: Render.GlobalTime,
				u_bg: {
					value: this.mapRender.aspect > 1.25 ? texture_w : texture_h
				},
			},
		});

		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.scene.add(mesh);
		mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		this.mapRender.onSizeChange = () => {
			console.log(Render.GlobalTime);
			material.uniforms.u_bg.value = this.mapRender.aspect > 1.25 ? texture_w : texture_h;
			material.uniformsNeedUpdate = true;
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
