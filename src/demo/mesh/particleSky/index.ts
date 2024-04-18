import { Render } from '@/engine/Render';
import * as THREE from 'three';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import vs2 from './vs2.glsl?raw';
import fs2 from './fs2.glsl?raw';

export class ParticleSky {
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
		this.mapRender.enableCameraShake(-0.5);
		this.createFog();
		this.createParticle();
		this.createWaveMesh();
		this.loadPass();
		this.startRender();
	}
	loadPass() {
		const renderPass = new RenderPass(this.mapRender.scene, this.mapRender.activeCamera);
		const fxaaPass = new ShaderPass(FXAAShader);
		const effectFilmBW = new FilmPass(0.75, false);
		const afterimagePass = new AfterimagePass();
		afterimagePass.uniforms['damp'].value = 0.8;
		this.mapRender.composer = new EffectComposer(this.mapRender.renderer!);
		this.mapRender.composer.addPass(renderPass);
		this.mapRender.composer.addPass(effectFilmBW);
		this.mapRender.composer.addPass(afterimagePass);

		const pixelRatio = this.mapRender.renderer!.getPixelRatio();
		fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.mapRender.canvasSize.x * pixelRatio);
		fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.mapRender.canvasSize.x * pixelRatio);
		this.mapRender.composer.addPass(fxaaPass);
		this.mapRender.renderer!.autoClear = false;
	}
	createFog() {
		this.mapRender.scene.fog = new THREE.Fog("#000000", 40, 100);
	}
	createParticle() {
		const material = new THREE.ShaderMaterial({
			vertexColors: true,
			vertexShader: Render.math.parseGLSLChunk(vs2),
			fragmentShader: Render.math.parseGLSLChunk(fs2),
			uniforms: {
				u_Texture: { value: Render.math.createTexture() },
				u_Time: Render.GlobalTime,
				u_AutoRun: {
					value: true
				},
			},
			transparent: true,
			blending: THREE.AdditiveBlending
		});
		const geometry = Render.math.createParticleBuffer({
			curRange: [[-400, 400], [-100, 400], [-400, -400]],
			nextRange: [[-400, 400], [-100, 400], [200, 200]],
			count: 3000,
		});
		const point = new THREE.Points(geometry, material);
		this.group.add(point);
	}

	createWaveMesh() {
		const material = new THREE.ShaderMaterial({
			vertexShader: Render.math.parseGLSLChunk(vs),
			fragmentShader: Render.math.parseGLSLChunk(fs),
			uniforms: {
				...THREE.ShaderLib.lambert.uniforms,
				u_Time: Render.GlobalTime,
				opacity: {
					value: 0.0
				}
			},
			wireframe: true,
			transparent: true
		});
		material.lights = true;
		material.fog = true;
		const geometry = new THREE.PlaneGeometry(400, 100, 50, 50);
		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x -= Math.PI * 0.5;
		mesh.position.set(0, 0, 90);
		this.group.add(mesh);
		this.mapRender.$gsap.to(material.uniforms.opacity, {
			duration: 5,
			value: 1,
			onUpdate: () => {
				material.uniformsNeedUpdate = true;
			}
		});
	}
	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
