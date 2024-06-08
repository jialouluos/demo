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

		const shape1 = new THREE.Shape([
			[
				121.48164735399996,
				31.250485472499975
			],
			[
				131.48162582500004,
				51.250439568300067
			],
			[
				141.48163659900013,
				61.250347916899955
			],
			[
				151.48166890100003,
				71.250320506299943
			],
			[
				161.4819488280001,
				81.250339660000122
			],
			[
				171.48195959200007,
				91.250376364600015
			],
			[
				181.48193804699997,
				101.250513825800112
			],
			[
				121.48164735399996,
				31.250485472499975
			]
		].map(item => new THREE.Vector2(item[0], item[1])));
		const shape2 = new THREE.Shape([
			[
				221.48164735399996,
				31.250485472499975
			],
			[
				231.48162582500004,
				51.250439568300067
			],
			[
				241.48163659900013,
				61.250347916899955
			],
			[
				251.48166890100003,
				71.250320506299943
			],
			[
				261.4819488280001,
				81.250339660000122
			],
			[
				271.48195959200007,
				91.250376364600015
			],
			[
				281.48193804699997,
				101.250513825800112
			],
			[
				221.48164735399996,
				31.250485472499975
			]
		].map(item => new THREE.Vector2(item[0], item[1])));
		const shapes = [shape1,];
		const map = (await Render.textureLoader.loadAsync(colorMap));
		map.colorSpace = THREE.SRGBColorSpace;
		map.wrapT = map.wrapS = THREE.RepeatWrapping;
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
					steps: 2
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
