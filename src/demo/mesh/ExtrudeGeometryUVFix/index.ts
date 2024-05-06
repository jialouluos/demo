import { Render } from '@/engine/Render';
import * as THREE from 'three';
import colorMap from '@/assets/img/color.png';
import aoMap from '@/assets/img/aomap.png';
import envMap from '@/assets/img/envmap.png';
import { ExtrudeGeometry as _ExtrudeGeometry } from './_extrudeGeometry.js';
import { ExtrudeGeometry as _ExtrudeGeometry2 } from './_extrudeGeometry2.js';
import { ExtrudeGeometry as _ExtrudeGeometry3 } from './_extrudeGeometry3.js';
export class ExtrudeGeometryUVFix {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	material!: THREE.ShaderMaterial;

	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, false, { stats: false, gui: true });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {

		const shapes = new THREE.Shape([
			{
				"x": 6,
				"y": 6
			},
			{
				"x": 0,
				"y": 6
			},
			{
				"x": 0,
				"y": 0
			},
			{
				"x": 6,
				"y": 0
			},
			{
				"x": 6,
				"y": 6
			}
		].map(item => new THREE.Vector2(item.x, item.y)));
		const map = (await Render.textureLoader.loadAsync(colorMap));
		map.colorSpace = THREE.SRGBColorSpace;
		const sunLight = new THREE.DirectionalLight('#fff', 2.0);
		sunLight.position.set(100, 100, 100);
		this.mapRender.scene.add(sunLight);
		const material = new THREE.MeshStandardMaterial({
			map: map,
			aoMap: await Render.textureLoader.loadAsync(aoMap),
			envMap: await Render.textureLoader.loadAsync(envMap)
		});

		const guiObject = {
			type: "各面独立uv"
		};
		const geometry = new _ExtrudeGeometry2(shapes, {
			depth: 18,
			bevelEnabled: false,
			steps: 1
		});
		geometry.rotateX(-Math.PI / 2);
		geometry.center();
		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.$gui.add(guiObject, 'type', ['盖面固定uv', '各面独立uv', '盖面固定uv无底面']).onChange(e => {
			if (e === '盖面固定uv') {
				mesh.geometry = new _ExtrudeGeometry(shapes, {
					depth: 18,
					bevelEnabled: false,
					steps: 1
				});
				mesh.geometry.rotateX(-Math.PI / 2);
				mesh.geometry.center();

			} else if (e === '各面独立uv') {
				mesh.geometry = new _ExtrudeGeometry2(shapes, {
					depth: 18,
					bevelEnabled: false,
					steps: 1
				});
				mesh.geometry.rotateX(-Math.PI / 2);
				mesh.geometry.center();
			}
			else if (e === '盖面固定uv无底面') {
				mesh.geometry = new _ExtrudeGeometry3(shapes, {
					depth: 18,
					bevelEnabled: false,
					steps: 1
				});
				mesh.geometry.rotateX(-Math.PI / 2);
				mesh.geometry.center();
			}
		});



		this.mapRender.scene.add(mesh);

		this.startRender();
		// const cameraHelper = new THREE.CameraHelper(this.mapRender.orthographicCamera);
		// this.mapRender.scene.add(cameraHelper);
		this.mapRender.onRender = () => {
			sunLight.position.set(100, Render.GlobalTime.value * 10 % 200, 200);


		};

	}

	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};

}
