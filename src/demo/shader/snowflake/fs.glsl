precision mediump float;
#define _SnowflakeAmount 60   // 雪花数
#define _BlizardFactor 0.3    // 风的大小

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform sampler2D u_bg;
uniform float u_Time;
float rnd(float x) {
    return fract(sin(dot(vec2(x + 47.49, 38.2467 / (x + 2.3)), vec2(12.9898, 78.233))) * (43758.5453));
}

float drawCircle(vec2 uv, vec2 center, float radius) {
    return 1.0 - smoothstep(0.0, radius, length(uv - center));
}

void main() {
    vec2 uv = v_uv;
    vec4 color = texture2D(u_bg, uv);

    fragColor = color;

    float j;
    // 生成若干个圆，当前uv依次与这些圆心计算距离，未落在圆域内则为黑色，落在圆域内则为白色
    for(int i = 0; i < _SnowflakeAmount; i++) {
        j = float(i);
        // 控制了不同雪花的下落速度 和 雪花的大小
        float speed = 0.3 + rnd(cos(j)) *
            (0.7 + 0.5 * cos(j / (float(_SnowflakeAmount) * 0.25)));

        vec2 center = vec2(// x坐标 左右环绕分布的范围
        rnd(j) +// 根据雪花的索引随机起始位置
            (-0.25 + uv.y) * _BlizardFactor + // 越高的位置越往右偏
            0.1 * cos(u_Time + sin(j)),// y坐标  随着时间下降（不超过 0.95）
        mod(rnd(j) -// 根据雪花的索引随机起始位置
            speed * (u_Time * 1.5 * (0.1 + _BlizardFactor)), 0.95));

        fragColor += vec4(0.9 * drawCircle(uv, center, 0.001 + speed * 0.012)); // 输出是这些圆的颜色叠加
    }
}