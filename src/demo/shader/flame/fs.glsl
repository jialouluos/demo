precision mediump float;

#define M_PI 3.1415926535897932384626433832795

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform float u_Time;

vec2 Translate = vec2(0.5, 0.5);
float R = 0.6;
float K = 0.1;//放大参数

void main() {
    vec2 uv = 2. * v_uv;
    uv -= 1.0;
    uv *= 3.;

    for(float i = 1.0; i < 8.0; i++) {
        uv.y += 0.1 * sin(4.20 * u_Time / (1. + i)) / (1. + i);               // 纵向上的抖动函数
        uv.x += 0.1 * cos(uv.y / 4.20 + 2.40 * u_Time / (1. + i)) / (1. + i);// 横向上的抖动函数
    }
    uv.y += 0.04 * fract(sin(u_Time * 60.));//正弦扰动
    vec3 color = vec3(0.0);
    float y = -pow(abs(uv.x), 4.2) / 0.004;// 外焰的形状
    float dir = abs(uv.y - y) * sin(.3);//计算外焰的大小（扩大渐变区域）的公式 
    if(dir < 0.7) {
        color.rg += smoothstep(0.0, 1.00, .75 - dir);
        color.g /= 1.8;
    }
    color *= (0.6 + abs(uv.y / 4.2 + 4.2) / 4.2);// 增加对比度
    color += pow(color.r, 1.1);//增白
    color *= cos(-0.5 + uv.y * 0.4);//隐藏底部的颜色
    //火苗内焰
    uv.y += 1.5;
    vec3 dolor = vec3(0.0);
    float y1 = -pow(abs(uv.x), 4.2) / (4.2 * 0.004) * 4.2;
    float dir1 = abs(uv.y - y1) * sin(0.8);
    if(dir1 < 0.7) {
        dolor.bg += smoothstep(0.0, 1.00, .75 - dir1);
        dolor.g /= 2.4;
    }
    dolor *= (0.6 + abs(uv.y / 4.2 + 4.2) / 4.2);
    dolor += pow(dolor.r, 1.01);
    dolor *= cos(-0.5 + uv.y * 0.4);
    color = (color + dolor) / 2.;
    fragColor = vec4(color, 1.0);
}