import { Render } from '@/engine/Render';
import * as THREE from 'three';
import vs2 from './vs2.glsl?raw';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';

export class FlyLine {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	material!: THREE.ShaderMaterial;
	options = {
		type: "flyLine",
		LineSpeed: 0.5,
		LineCount: 2.0,
		LineSize: 4,
		LineLength: 0.4,
		color: new THREE.Color(0xffff00),
	};
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, false, { stats: false, gui: true });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		this.mapRender.activeCamera.position.set(0, 0, 1000);
		this.mapRender.activeControls.enabled = false;
		this.material = new THREE.ShaderMaterial({
			vertexShader: Render.math.parseGLSLChunk(vs2),
			fragmentShader: Render.math.parseGLSLChunk(fs),
			uniforms: {
				u_Time: Render.GlobalTime,
				u_Number: {
					value: this.options.LineCount
				},
				u_Size: {
					value: this.options.LineSize
				},
				u_Speed: {
					value: this.options.LineSpeed
				},
				u_Length: {
					value: this.options.LineLength
				},
				u_Color: {
					value: this.options.color
				}
			}
		});
		await this.loadModel();
		this.initGUI();
		this.startRender();
	}
	async loadModel() {
		const { scene: model } = await Render.modelLoadByDraco.loadAsync("/model/地铁.glb");

		model.children[0].children.forEach((e: any) => {
			this.group.add(this.createFlyLine(e.geometry.clone().attributes.position.array));
		});
		Render.GCPool.disposeGroup(model);
	}
	private createFlyLine(pointArray: ArrayLike<number>): any {
		const vector3Array: THREE.Vector3[] = [];
		for (let i = 0, len = pointArray.length; i < len; i += 3) {
			vector3Array.push(new THREE.Vector3(pointArray[i], pointArray[i + 1], pointArray[i + 2]));
		}
		const pointArray2 = new THREE.CatmullRomCurve3(vector3Array).getSpacedPoints(1000);
		const geometry = new THREE.BufferGeometry();
		const percent = new Float32Array(pointArray2.length);
		for (let i = 0, len = pointArray2.length; i < len; i++) {
			percent.set([i / len], i);
		}
		geometry.setFromPoints(pointArray2);
		geometry.setAttribute("a_Percent", new THREE.BufferAttribute(percent, 1));
		geometry.computeVertexNormals();
		geometry.rotateX(-Math.PI / 2);
		const flyLine = new THREE.Points(geometry, this.material);
		return flyLine;
	}
	initGUI() {

		this.mapRender.$gui.add(this.options, 'type', ['flyLine', 'stream']).onChange(e => {
			if (e === 'flyLine') {
				this.material.vertexShader = Render.math.parseGLSLChunk(vs2);
			} else if (e === 'stream') {
				this.material.vertexShader = Render.math.parseGLSLChunk(vs);
			}
			this.material.needsUpdate = true;
		});
		this.mapRender.$gui.add(this.options, 'LineSpeed', 0, 1, 0.01).onChange(e => {
			this.material.uniforms.u_Speed.value = e;
		}).name("飞线/流光速度");
		this.mapRender.$gui.add(this.options, 'LineLength', 0, 1, 0.01).onChange(e => {
			this.material.uniforms.u_Length.value = e;
		}).name("飞线/流光长度");
		this.mapRender.$gui.add(this.options, 'LineCount', 0, 4, 1).onChange(e => {
			this.material.uniforms.u_Number.value = e;
		}).name("每条线上的飞线/流光数量");
		this.mapRender.$gui.add(this.options, 'LineSize', 1, 10, 1).onChange(e => {
			this.material.uniforms.u_Size.value = e;
		}).name("飞线/流光大小");
	}
	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
