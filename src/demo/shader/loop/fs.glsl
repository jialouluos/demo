precision mediump float;

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor
#define PI 3.1415926
varying vec2 v_uv;

uniform float u_Time;
vec2 random2(in vec2 _st) {
    _st = vec2(dot(_st, vec2(127.326, 321.324)), dot(_st, vec2(15.31, 45.332)));
    return 2.0 * fract(sin(_st) * 432.23) + 1.0; //1.0 ~ 3.0
}
float snoise(vec2 st) { //Gradient Noise
    vec2 i = fract(st);//取小数
    vec2 k = floor(st);//向负无穷取整
    vec2 u = i * i * (3.0 - 2.0 * i);//插值函数
    return mix(mix(dot(random2(k + vec2(0.0, 0.0)), i - vec2(0.0, 0.0)), dot(random2(k + vec2(0.0, 1.0)), i - vec2(0.0, 1.0)), u.y), mix(dot(random2(k + vec2(1.0, 0.0)), i - vec2(1.0, 0.0)), dot(random2(k + vec2(1.0, 1.0)), i - vec2(1.0, 1.0)), u.y), u.x);//二维noise
}
float getRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b;
    vec2 m = vec2(min(q.x, q.y), max(q.x, q.y));
    float d = (m.x > 0.0) ? length(q) : m.y;
    return d - r;
}
//如果想实现直角矩形效果
float getRoundBox_T(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b;
    return length(max(q, 0.)) +           ///< 直角矩形, 但内部距离还是 0
        min(max(q.x, q.y), 0.) - r; ///< 内部为负的距离

}

vec3 getColor(vec3 color) {
    float sn1 = snoise(vec2(color.r, color.g));
    float sn2 = snoise(vec2(color.g, color.b));
    float sn3 = snoise(vec2(color.r, color.b));
    return vec3(sn1 + sn2 + sn3);
}
void main() {
    vec2 uv = (v_uv - .5) * 2.;
    vec2 ra = 0.1 + 0.1 * sin(vec2(20., 10.));//控制矩形的横纵比例
    float d = getRoundBox_T(uv, ra, 0.01);
    vec3 col2 = vec3(1.0) - sign(d) * vec3(.8, .8, 0.1);
    col2 *= 1. - exp(-2.0 * abs(d)); // 增强颜色对比度、黑的更黑，白的更白
    col2 *= 0.8 + 0.9 * cos(120.0 * (d + u_Time * 0.1));  //生成动态条纹
    col2 *= vec3(0.5, 0.5 * abs(cos(u_Time)), 0.5 * abs(sin(u_Time))) + getColor(col2);
    fragColor = vec4(col2, 1.0);
}