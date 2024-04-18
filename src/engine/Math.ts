import * as THREE from 'three';
import * as glslChunk from '@/glslChunk';
export class _Math {
    constructor() { }
    deg2Rad(rad: number): number;
    deg2Rad(rad: THREE.Vector3): THREE.Vector3;
    deg2Rad(deg: number | THREE.Vector3) {
        if (deg instanceof THREE.Vector3) {
            return deg.clone().multiplyScalar(Math.PI / 180);
        }
        return deg * Math.PI / 180;
    };

    rad2Deg(rad: number): number;
    rad2Deg(rad: THREE.Vector3): THREE.Vector3;
    rad2Deg(rad: number | THREE.Vector3) {
        if (rad instanceof THREE.Vector3) {
            return rad.clone().multiplyScalar(180 / Math.PI);
        }
        return rad * 180 / Math.PI;
    };

    lon2xy = (longitude: number, latitude: number): [number, number] => {

        const E = longitude,
            N = latitude;
        const x = E * (20037508.34 / 180);

        const y = (Math.log(Math.tan((90 + N) * Math.PI / 360)) / (Math.PI / 180)) * 20037508.34 / 180;

        return [x, y];
    };
    center(params: THREE.Group | THREE.Mesh): [THREE.Vector3, THREE.Box3];
    center(params: [number, number][]): [THREE.Vector3, THREE.Vector3];
    center(params: THREE.Vector2[]): [THREE.Vector3, THREE.Vector3];
    center(params: THREE.Group | THREE.Mesh | [number, number][] | THREE.Vector2[]): [THREE.Vector3, THREE.Box3] | [THREE.Vector3, THREE.Vector3] {
        if (params instanceof THREE.Object3D) {
            const box = new THREE.Box3();
            box.expandByObject(params);
            return [box.max.clone().add(box.min).multiplyScalar(-.5), box];
        } else {
            if (!Array.isArray(params)) return params;
            let geometry, isV2 = params[0] instanceof THREE.Vector2;
            geometry = new THREE.BufferGeometry().setFromPoints(params.map((item: any) => {
                return isV2 ? new THREE.Vector3(item.x, item.y, 0) : new THREE.Vector3(item[0], item[1], 0);
            }));
            geometry.rotateX(-Math.PI / 2);
            geometry.computeBoundingBox();
            const box = geometry.boundingBox!.clone();
            const center = new THREE.Vector3();
            const size = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);
            geometry.dispose();
            return [center, size];
        }
    }
    parseGLSLChunk(raw: string) {
        const partten = /^# include<(?<glslKey>.*?)>;/gm;
        return raw.replaceAll(partten, (_, glslKey) => {
            return (glslChunk as Record<string, string>)[glslKey];
        });
    };
    createTexture() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 256;
        canvas.height = 256;
        const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(128, 128, 128, 0, Math.PI / 180, true);
        ctx.fill();
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    createParticleBuffer({
        count,
        curRange = [[-0.5, 0.5], [-0.5, 0.5], [-0.5, 0.5]],
        nextRange = [[-0.5, 0.5], [-0.5, 0.5], [-0.5, 0.5]],
        duration = 4,
        pivotScale = 1,
        color,
        nextColor,
        isRandomProcess
    }: {
        count: number;
        curRange?: [[number, number] | (() => number), [number, number] | (() => number), [number, number] | (() => number)],
        nextRange?: [[number, number] | (() => number), [number, number] | (() => number), [number, number] | (() => number)],
        color?: [number, number, number, number] | ((index: number, len: number) => [number, number, number, number]);
        nextColor?: [number, number, number, number] | ((index: number, len: number) => [number, number, number, number]);
        duration?: number;
        pivotScale?: number;
        isRandomProcess?: boolean;

    }) {
        const curPosition: [number, number, number][] = [];
        const nextPosition: [number, number, number][] = [];

        for (let i = 0; i < count; i++) {
            const cur_x = typeof curRange[0] === 'function' ? curRange[0]() : THREE.MathUtils.randFloat(...curRange[0]);
            const cur_y = typeof curRange[1] === 'function' ? curRange[1]() : THREE.MathUtils.randFloat(...curRange[1]);
            const cur_z = typeof curRange[2] === 'function' ? curRange[2]() : THREE.MathUtils.randFloat(...curRange[2]);
            curPosition.push([cur_x, cur_y, cur_z]);

            const next_x = typeof nextRange[0] === 'function' ? nextRange[0]() : THREE.MathUtils.randFloat(...nextRange[0]);
            const next_y = typeof nextRange[1] === 'function' ? nextRange[1]() : THREE.MathUtils.randFloat(...nextRange[1]);
            const next_z = typeof nextRange[2] === 'function' ? nextRange[2]() : THREE.MathUtils.randFloat(...nextRange[2]);
            nextPosition.push([next_x, next_y, next_z]);

        }
        const curBufferAttribute = new THREE.BufferAttribute(new Float32Array(curPosition.flat()), 3);
        const nextBufferAttribute = new THREE.BufferAttribute(new Float32Array(nextPosition.flat()), 3);

        const processArray = [];
        const pivotScaleArray = [];
        const angleArray = [];
        const colorArray = [];
        const nextColorArray = [];
        const axis = new THREE.Vector3();
        for (let i = 0, len = nextBufferAttribute.count; i < len; i++) {
            processArray.push([i / len * duration, duration]);
            pivotScaleArray.push(Math.random() * pivotScale);
            axis.x = THREE.MathUtils.randFloatSpread(2);
            axis.y = THREE.MathUtils.randFloatSpread(2);
            axis.z = THREE.MathUtils.randFloatSpread(2);
            axis.normalize();
            const angle = Math.PI * THREE.MathUtils.randFloat(4, 8);
            angleArray.push([axis.x, axis.y, axis.z, angle]);
            colorArray.push(color ? typeof color === 'function' ? color(i, len) : color : [1 - i / len, THREE.MathUtils.randFloat(0.4, 0.6), i / len, 1]);
            nextColorArray.push(nextColor ? typeof nextColor === 'function' ? nextColor(i, len) : nextColor : [1 - i / len, THREE.MathUtils.randFloat(0.4, 0.6), i / len, 1]);

        }

        const buffGeometry = new THREE.BufferGeometry();
        buffGeometry.setAttribute("a_Position2", nextBufferAttribute);
        buffGeometry.setAttribute("position", curBufferAttribute);
        buffGeometry.setAttribute("a_Color", new THREE.BufferAttribute(new Float32Array(colorArray.flat()), 4));
        buffGeometry.setAttribute("a_Color2", new THREE.BufferAttribute(new Float32Array(nextColorArray.flat()), 4));
        //给每个顶点设置一个process，便于动画
        isRandomProcess && processArray.sort(() => Math.random() - .5);
        buffGeometry.setAttribute("a_Process", new THREE.BufferAttribute(new Float32Array(processArray.flat()), 2));
        //传入一个控制路径中每个点的枢轴距离影响强度
        buffGeometry.setAttribute("a_PivotScale", new THREE.BufferAttribute(new Float32Array(pivotScaleArray), 1));
        //传入一个旋转数据，让他变得更加噪化
        buffGeometry.setAttribute("a_Angle", new THREE.BufferAttribute(new Float32Array(angleArray.flat()), 4));
        return buffGeometry;
    }
}