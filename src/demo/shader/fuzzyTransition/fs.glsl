precision mediump float;
#define M_PI 3.1415926535897932384626433832795
#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform sampler2D u_bg;
uniform sampler2D u_bg2;
uniform float u_Time;
vec2 phyllotaxis(float i, float c) {
    float phi = M_PI * (3. - sqrt(5.)) * c;
    /// @note 计算出的 xy 呈 “螺旋线” 的形状
    float angle = (i / c) * phi;
    float r = sqrt(i / c);
    float x = r * cos(angle);
    float y = r * sin(angle);

    return vec2(x, y);
}

float radius = 0.05;
float samples = 128.;
void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;

    vec4 col;
    float pre = fract(u_Time * 0.2);
    for(float i = 0.; i < samples; i++) {
        /// @note Fobonacci 螺旋线采样
        vec2 offset;
        float angle = pre * M_PI;
        if(angle <= M_PI / 2.0) {
            offset = phyllotaxis(i, samples) * 0.1 * sin(angle);
            col += texture(u_bg, uv + offset);
        } else {
            offset = phyllotaxis(i, samples) * 0.1 * sin(angle);
            col += texture(u_bg2, uv + offset);
        }
    }
    col /= samples;

    fragColor = vec4(0., 0., 0., 1.);
    fragColor = vec4(col.rgb, 1.0);

    fragColor = vec4(fragColor.rgb, 1.0);
}
