#define LAMBERT

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
uniform float u_Time;
varying vec2 v_uv;
varying vec3 vPosition;
varying float v_Time;
void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
    float x = transformed.x;
    float y = transformed.y;
    float sx = 0.0;
    float sy = 0.0;
    float sz = 0.0;

    float ti = 0.0;
    float index = 1.0;
    vec2 dir;//水波方向
    for(int i = 0; i < 3; i++) {
        ti = ti + 0.0005;
        index += 1.0;
        if(mod(index, 2.0) == 0.0) {
            dir = vec2(ti, 1.0);
        } else {
            dir = vec2(ti, -1.0);
        }
        float l1 = 5.0 * PI / (0.5 + ti);//波长
        float s1 = 5.0 * 2.0 / l1;//速度
        float x1 = 1.0 * dir.x * sin(dot(normalize(dir), vec2(x, y)) * l1 + u_Time * s1);
        float y1 = 1.0 * dir.y * sin(dot(normalize(dir), vec2(x, y)) * l1 + u_Time * s1);
        float z1 = 1.0 * sin(dot(normalize(dir), vec2(x, y)) * l1 + u_Time * s1);
        sx += y1;
        sy += x1;
        sz += z1;
    }
    sx = x + sx;
    sy = y + sy;
	#include <morphtarget_vertex>
	#include <skinning_vertex>
    #include <displacementmap_vertex>
    transformed = vec3(sx, sy, sin(sz) * 4.0 * sin(sz) * sin(sz));

    //  transformed = vec3(position.x, position.y, position.z + sin1  + sin2  + sin3);

    vec4 mvPosition = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
    #endif
    mvPosition = modelViewMatrix * mvPosition;
    vPosition = position;
    gl_Position = projectionMatrix * mvPosition;

    #include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
    v_Time = u_Time;
    v_uv = uv;
}