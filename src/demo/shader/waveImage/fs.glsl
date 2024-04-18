precision mediump float;

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform sampler2D u_bg;
uniform float u_Time;

const vec2 textureSize = vec2(5120., 5120.);
const vec2 pixSize = vec2(1, 1);

vec2 random(in vec2 _st) {
    _st = vec2(dot(_st, vec2(127.326, 321.324)), dot(_st, vec2(15.31, 45.332)));
    return 2.0 * fract(sin(_st) * 432.23) + 1.0; //1.0 ~ 3.0
}
float snoise(vec2 st) { //Gradient Noise
    vec2 i = fract(st);//取小数
    vec2 k = floor(st);//向负无穷取整
    vec2 u = i * i * (3.0 - 2.0 * i);//插值函数
    return mix(mix(dot(random(k + vec2(0.0, 0.0)), i - vec2(0.0, 0.0)), dot(random(k + vec2(0.0, 1.0)), i - vec2(0.0, 1.0)), u.y), mix(dot(random(k + vec2(1.0, 0.0)), i - vec2(1.0, 0.0)), dot(random(k + vec2(1.0, 1.0)), i - vec2(1.0, 1.0)), u.y), u.x);//二维noise
}
vec4 getNoise(vec2 uv) {
    vec2 Txy = vec2(floor(uv.x / pixSize.x) * pixSize.x, floor(uv.y / pixSize.y) * pixSize.y) + 0.5 * pixSize;

    vec2 nuv = Txy / textureSize;
    vec4 finalColor;

    vec2 st = nuv - 0.5;
    vec2 result = vec2(step(abs(st) - 0.49, vec2(0.0)));
    if(result.x < 1.0 || result.y < 1.0) {
    } else {
        nuv += 0.01 * snoise(nuv + u_Time * 0.3);
    }
    finalColor = texture(u_bg, nuv);

    return finalColor;
}
void main() {
    vec2 uv = v_uv;
    uv *= textureSize;

    fragColor = getNoise(uv);

}