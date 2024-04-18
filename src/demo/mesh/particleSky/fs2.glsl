uniform sampler2D u_Texture;

varying vec4 vColor;

void main() {
    float dis = distance(gl_PointCoord.xy, vec2(0.5));
    if(dis > 0.5) {
        discard;
    }
    gl_FragColor = vec4(vColor);

    gl_FragColor = gl_FragColor * texture2D(u_Texture, gl_PointCoord);
}