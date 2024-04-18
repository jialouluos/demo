attribute vec4 a_Color;
attribute vec3 a_Position2;
attribute vec4 a_Color2;
attribute vec2 a_Process;
varying vec4 vColor;
uniform float u_Time;
# include<noise_v3_f>;
void main() {
    float progress = mod(u_Time + a_Process.x, a_Process.y) / a_Process.y;
    // vec3 transformed = mix(position, a_Position2, progress);
    vec3 transformed = mix(position, vec3(position.xy, a_Position2.z), progress);
    vColor = mix(a_Color, a_Color2, progress);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_PointSize = mix(1., 10., progress);
    gl_Position = projectionMatrix * mvPosition;
}