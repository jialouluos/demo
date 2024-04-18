precision mediump float;
varying vec2 v_uv;

uniform sampler2D u_Texture;
void main() {
    vec4 color = texture2D(u_Texture, v_uv);
    gl_FragColor = color;
}