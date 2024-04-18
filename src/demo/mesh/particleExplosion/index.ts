import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import dongman from '@/assets/img/dongman.png';
import bg_h from '@/assets/img/bg_h.jpg';
export class ParticleExplosion {
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
		let geometry = new THREE.PlaneGeometry(
			this.mapRender.canvasSize.x, this.mapRender.canvasSize.y,
			700, 700
		);

		const bg_w_1 = await Render.textureLoader.loadAsync(dongman);
		const bg_h_1 = await Render.textureLoader.loadAsync(bg_h);
		const material = new THREE.ShaderMaterial({
			vertexShader: Render.math.parseGLSLChunk(vs),
			fragmentShader: Render.math.parseGLSLChunk(fs),
			uniforms: {
				u_Time: Render.GlobalTime,
				u_Texture: {
					value: this.mapRender.aspect > 1.25 ? bg_w_1 : bg_h_1
				},
				u_Size: {
					value: 2.0
				},
				u_Progress: {
					value: 0.0
				},
			},
		});
		const point = new THREE.Points(geometry, material);
		this.mapRender.scene.add(point);

		this.mapRender.onSizeChange = () => {
			material.uniforms.u_Texture.value = this.mapRender.aspect > 1.25 ? bg_w_1 : bg_h_1;
			material.uniformsNeedUpdate = true;
			const _geometry = geometry;
			geometry = new THREE.PlaneGeometry(
				this.mapRender.canvasSize.x, this.mapRender.canvasSize.y,
				700, 700
			);
			point.geometry = geometry;
			_geometry && _geometry.dispose();
		};
		this.mapRender.addListener("pointerMove", ({ relativeCoord }) => {
			material.uniforms.u_Progress.value = relativeCoord.x;
			material.uniformsNeedUpdate = true;
		});
		this.startRender();

	}
	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
