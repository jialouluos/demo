precision mediump float;
#define _SnowflakeAmount 60   // 雪花数
#define _BlizardFactor 0.3    // 风的大小

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform sampler2D u_bg;
uniform float u_Time;

float EllipseY = 0.2;
float EllipseX = 0.5;
float EllipseSpeed = 0.06;
float EllipseCount = 100.;
float EllipseXAngle = 20.;
vec2 getEllipse(float index) {//椭圆旋转,通过极坐标来实现 x = a cos(index); y = bsin(index);
    return vec2(EllipseX * cos(index * u_Time * EllipseSpeed), EllipseY * sin(index * u_Time * EllipseSpeed));
}
vec2 rotate(vec2 st, float angle) {//旋转矩阵
    return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * st;
}
float circle(vec2 st, float radius) {
    return 1.0 - smoothstep(0.0, radius, length(st));
}
void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;
    uv -= 0.5;
    vec3 color = vec3(0.);
    //旋转运动的粒子
    for(float i = 0.0; i < EllipseCount; i++) {
        uv = rotate(uv, EllipseXAngle);// 让椭圆每次旋转
        vec2 st = getEllipse(i);
        float col = circle(uv - st, 0.01 * i * 0.03);//乘i可以实现每个粒子大小不同
        color += col;
    }

    // Output to screen
    fragColor = vec4(color, 1.0);
}