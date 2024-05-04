import { Render } from '@/engine/Render';
import * as THREE from 'three';



export class LineDraw {
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
        const data = [
            10, 0, 0,//0
            10, 10, 0,//1
            10, 20, 0,//2
            20, 20, 0,//3
            20, 0, 0//4
        ];
        const material = new THREE.LineBasicMaterial({
            color: "#ff0000"
        });
        const bufferGeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        bufferGeometry.setIndex([0, 1, 2, 3]);
        const line = new THREE.LineSegments(bufferGeometry, material);
        this.mapRender.scene.add(line);
        this.startRender();
    }
    mergeLine(points: number[][]) {
        const indexArray = [];
        const uvArray = [];
        const colorArray = [];
        let index = 0;
        const vertices = [];
        for (const point of points) {
            for (let i = 0, len = point.length; i < len; i += 3) {
                vertices.push(point[i], point[i + 1], point[i + 2]);
                uvArray.push(i / len, 1);
                colorArray.push(i / len, (len - i) / len, 1);
                indexArray.push(index, index + 1);
                index = index + 2;
            }
        }
        const bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        bufferGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvArray, 2));
        bufferGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colorArray, 3));
        bufferGeometry.setIndex(indexArray);

        return bufferGeometry;
    }
    startRender = () => {
        this.mapRender.render();
    };
    pauseRender = () => {
        this.mapRender.stopRender();
    };

}
