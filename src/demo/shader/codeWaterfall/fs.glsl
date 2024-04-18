precision mediump float;

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform float u_Time;
uniform vec2 u_Size;
const float multiple = 4.0;
float space = 64.;
// vec3 color = vec3(0.2, 0.42, 0.68); // blue 1
// vec3 color = vec3(0.1, 0.3, 0.6); // blue 2
// vec3 color = vec3(0.6, 0.1, 0.3); // red
vec3 color = vec3(0.1, 0.6, 0.3); // green
float rand(float x) {
    return fract(sin(x) * 4358.5453);
}
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 3758.5357);
}

float invader(vec2 p, float n) {
    p.x = abs(p.x);
    p.y = -floor(p.y - 5.0);

//    return step(p.x, 2.0) ;
//    return floor(p.x + p.y*3.0);
//    return n/exp2(floor(p.x + p.y*3.0));
//    return mod(n/exp2(floor(p.x + p.y*3.0)), 2.);
//    return floor(mod(n/exp2(floor(p.x + p.y*3.0)), 2.));
//    return step(1.0, floor(mod(n/(exp2(floor(p.x + p.y*3.0))),2.0)));
    return step(p.x, 2.0) * step(1.0, floor(mod(n / (exp2(floor(p.x + p.y * 3.0))), 2.0)));
}

float ring(vec2 uv, float rnd) {
    float t = 0.6 * (u_Time);
    float i = floor(t / 2.0); // 确保圆心在某时间范围内不变

   // 随机圆心位置
    vec2 pos = 2.0 * vec2(rand(i * 0.123), rand(i * 2.371)) - 1.0;

   // 动态放大半径：
   // length(uv - pos)表示圆，t在增大，需要更大的uv才使得 diff 为 0，
   // t有一定的随机性，可以实现圆环的闪烁效果
    float diff = length(uv - pos) - mod(t, 2.0);
    return 1. - smoothstep(0.0, 0.1, abs(diff));
}

void main() {
    float width = multiple * space;
    vec2 uv = v_uv - 0.5;//-0.5==>0.5
    vec2 st = fragCoord.xy;
    float id1 = rand(floor(st.x / width));   // 影响当前像素（矩形内）的颜色
    float id2 = rand(floor((st.x - 1.0) / width));   // 影响其邻近左侧像素的颜色
    float a = 0.3 * id1; // 当前矩形的颜色
    a += 0.1 * step(id2, id1 - 0.08); // 矩形左边界（如果当前像素比左侧淡，则亮边界）
    a -= 0.1 * step(id1 + 0.08, id2);  // 矩形右边界（如果当前像素比左侧深，则亮边暗）
    a -= 0.3 * smoothstep(0.0, 0.7, length(uv));  // 渐变效果
    st.y += 20.0 * u_Time;
    float r = rand(floor(st / (multiple * 2.)));//对于坐标的随机，可以模拟出不同位置火星文的生成即一些地方显示，一些地方隐藏
    float inv = invader(mod(st, (multiple * 2.)) - multiple, 809999.0 * r);//生成火星文
    // a += (0.06 + max(0.0, 0.2 * sin(10.0 * r * u_Time))) * inv * (1.+ 2.0*ring(uv ,r)) ;
    float c = inv * max(0.0, 0.2 * sin(10.0 * r * u_Time));//随机生成火星文
    float b = 0.7 * inv * ring(uv, r);//生成光圈
    fragColor = vec4(vec3(a + c + b) + color, 1.0);
}