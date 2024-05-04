precision mediump float;
uniform float u_Time;
uniform float u_Number;

uniform float u_Speed;
uniform float u_Length;

varying vec2 v_uv;
varying vec3 v_color;
void main() {
    float opacity = fract(v_uv.x + u_Time * u_Speed);
    // float opacity = abs(clamp(fract((v_uv.x + u_Time * u_Speed) * u_Number), 0.0, 1.0) * (1. / u_Length));

    if(opacity < 0.2) {
        discard;
    }
    gl_FragColor = vec4(v_color * opacity, 1.0);
}