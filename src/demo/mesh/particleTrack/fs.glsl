precision mediump float;
varying vec4 v_Color;
void main() {
    float dis = distance(gl_PointCoord.xy, vec2(0.5));
    if(dis > 0.5) {
        discard;
    }
    gl_FragColor = vec4(v_Color);
}