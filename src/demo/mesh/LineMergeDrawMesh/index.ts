import { Render } from '@/engine/Render';
import * as THREE from 'three';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
export class LineMergeDrawMesh {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	material!: THREE.ShaderMaterial;

	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, false, { stats: false, gui: false });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		const { scene: model } = await Render.modelLoadByDraco.loadAsync("/model/地铁.glb");
		const data: THREE.TypedArray[] = [];
		(model.children[0].children as THREE.Mesh[]).forEach((e: THREE.Mesh) => {
			data.push(e.geometry.clone().attributes.position.array);
		});

		const material = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,

			uniforms: {
				u_Time: Render.GlobalTime,
				u_Speed: {
					value: 0.1
				},
			}
		});


		const nonWidthGeometry = this.mergeLineGeometry(data, { isLineSegmentsGeometry: false });

		const nonWidthLine = new THREE.LineSegments(nonWidthGeometry, material);

		this.mapRender.scene.add(nonWidthLine);
		this.startRender();
	}
	mergeLineGeometry(points: number[][] | THREE.TypedArray[], { spacedTime = 2, isCreateSpacedPoints = false, isLineSegmentsGeometry = false }: {
		isLineSegmentsGeometry?: boolean;
		spacedTime?: number;
		isCreateSpacedPoints?: boolean;
	}) {
		let _points = [];
		if (isCreateSpacedPoints) {

			for (const point of points) {

				const _v3s = [];
				for (let i = 0, len = point.length; i < len; i += 3) {
					_v3s.push(new THREE.Vector3(point[i], point[i + 1], point[i + 2]));
				}
				_points.push(new THREE.CatmullRomCurve3(_v3s).getPoints(point.length * spacedTime).map(item => {
					return [item.x, item.y, item.z];
				}).flat(1));
			}

		} else {
			_points = points;
		}

		const indexArray = [];
		const uvArray = [];
		const colorArray = [];
		let index = 0;
		const vertices = [];
		for (const point of _points) {
			for (let i = 0, len = point.length; i < len; i += 3) {
				vertices.push(point[i], point[i + 1], point[i + 2]);
				uvArray.push(i / len, 1);
				colorArray.push(i / len, (len - i) / len, 1);
				i && indexArray.push(index - 1, index);
				index = index + 1;
			}
		}
		//isLineSegmentsGeometry have a bug . Don't use it
		const bufferGeometry = isLineSegmentsGeometry ? new LineSegmentsGeometry : new THREE.BufferGeometry;
		if (isLineSegmentsGeometry) {
			(bufferGeometry as LineSegmentsGeometry).setPositions(vertices);
		} else {
			bufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		}
		bufferGeometry.setAttribute("self_uv", new THREE.Float32BufferAttribute(uvArray, 2));
		bufferGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colorArray, 3));
		bufferGeometry.setIndex(indexArray);//bug isLineSegmentsGeometry

		return bufferGeometry;
	}


	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
