precision mediump float;

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor
#define PI 3.1415926
varying vec2 v_uv;

uniform float u_Time;
uniform vec2 u_Mouse;
uniform vec2 u_Size;
// Distance functions by www.iquilezles.org
/// @note 并集
void fUnion(inout float d1, float d2) {
    d1 = min(d1, d2);
}

/// @note 球体
/// @param p 光线的三维坐标
/// @param s 球体的半径
float pSphere(vec3 p, float s) {
    /// 半径为 s，注意图形内部距离为负
    return length(p) - s;
}

/// @note 圆角立方体
/// @param p 光线的三维坐标
/// @param b 立方体的长宽高
/// @param r 控制圆角的程度
float pRoundBox(vec3 p, vec3 b, float r) {
    return length(max(abs(p) - b, 0.0)) - r;
}

/// @note （纵向）圆环体
/// @param p 光线的三维坐标
/// @param t 圆环的半径
float pTorus(vec3 p, vec2 t) {
    // t.x 控制圆环半径， t.y 控制粗细
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

/// @note （横向）圆环体
/// @param p 光线的三维坐标
/// @param t 圆环的半径
float pTorus2(vec3 p, vec2 t) {
    // t.x 控制圆环半径， t.y 控制粗细
    // p.z = 0 为圆柱体
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q) - t.y;
}

/// @note　胶囊体（圆角直线）
/// @param p 光线的三维坐标
/// @param a 起点
/// @param b 终点
/// @param r 粗细
float pCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    // |pa|*cos(theta) / |ba|
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    // ba*h 表示 pa 投影到 ba 上的向量, pa - ba*h 表示 p 点到 ba 线段的距离向量
    // r 控制了直线的宽度
    return length(pa - ba * h) - r;
}

/// @note 各种形状 SDF 大杂烩
float distf(vec3 p) {
    float d = 100000.0;
    /// @note 对所有距离求并集（最小距离，即离哪个物体最近）
    fUnion(d, pRoundBox(vec3(0, 0, 10) + p, vec3(21, 21, 1), 1.0));     ///< 底座——圆角立方体

    fUnion(d, pSphere(vec3(10, 10, 0) + p, 8.0));                       ///< 球体
    fUnion(d, pSphere(vec3(16, 0, 4) + p, 4.0));

    fUnion(d, pCapsule(p, vec3(10, 10, 12), vec3(15, 15, -6.5), 1.5));  ///< 胶囊体
    fUnion(d, pCapsule(p, vec3(10, 10, 12), vec3(5, 15, -6.5), 1.5));
    fUnion(d, pCapsule(p, vec3(10, 10, 12), vec3(10, 5, -6.5), 1.5));

    fUnion(d, pTorus(vec3(15, -15, 0) + p, vec2(6, 2)));                ///< 圆环体
    fUnion(d, pTorus2(vec3(10, -15, 0) + p, vec2(6, 2)));

    /// @note 圆角立方体，；两两拼凑为十字
    fUnion(d, pRoundBox(vec3(-10, 10, -2) + p, vec3(1, 1, 9), 1.));     ///< 高的
    fUnion(d, pRoundBox(vec3(-10, 10, -4) + p, vec3(0.5, 6, 0.5), 1.)); ///< 宽的
    fUnion(d, pRoundBox(vec3(-10, 10, 2) + p, vec3(6, 0.5, 0.5), 1.));  ///< 长的

    return d;
}

/// @note 计算世界坐标系下的法线方向
vec3 normal(vec3 p) {
    const float eps = 0.01;
    float m;
    vec3 n = vec3((distf(vec3(p.x - eps, p.y, p.z))   // △x
    - distf(vec3(p.x + eps, p.y, p.z))), (distf(vec3(p.x, p.y - eps, p.z))   // △y
    - distf(vec3(p.x, p.y + eps, p.z))), (distf(vec3(p.x, p.y, p.z - eps))   // △z
    - distf(vec3(p.x, p.y, p.z + eps))));

    return normalize(n);
}

/// @note 光线步进
const float maxDist = 200.;
const int maxIter = 100;
const float edgeWidth = 0.15;
vec4 raymarch(vec3 from, vec3 increment) {
    const float minDist = 0.001;

    float dist = 0.0;

    float lastDistEval = 1e10;
    float edge = 0.0;

    // 迭代估计最优距离（何时光线命中物体）
    for(int i = 0; i < maxIter; i++) {
        // increment * dist：估计光线在世界坐标系下的前进的距离
        vec3 pos = (from + increment * dist);

        /// 根据当前光线所在位置计算距离场
        /// 即当前光线到物体的最短距离
        float distEval = distf(pos);

        // 模型轮廓线
        // if (lastDistEval < edgeWidth && distEval > lastDistEval + 0.001)
        // {
        //     edge = 1.0;
        // }

        // 当某次距离估计小于指定的 minDist，即 dist 不再有太大变化，则迭代提前结束
        if(distEval < minDist) {
            break;
        }

        // 将每次的距离估计累加
        dist += distEval;

        // 如果比上一次的距离估计小，则记录（距离估计的最小值）
        if(distEval < lastDistEval)
            lastDistEval = distEval;
    }

    float mat = 1.0; ///< 控制背景的效果
    if(dist >= maxDist)
        mat = 0.0;

    return vec4(dist, mat, edge, 0);
}

vec4 getPixel(vec2 p, vec3 from, vec3 increment, vec3 light) {
    vec4 c = raymarch(from, increment);

    // increment * c.x 光线命中物体的（世界坐标系下）位置坐标
    vec3 hitPos = from + increment * c.x;
    vec3 normalDir = normal(hitPos);

    /// @note 计算散射光
    /// 注意前面提到的 “光线” 都是从相机射出的 “光线步进”
    /// 而这里的光是真正会产生阴影的光照
    /// 这里省略了地面的阴影投射
    float diffuse = 1.0 + min(0.0, dot(normalDir, -light));
    float inshadow = 0.0;
    diffuse = max(diffuse, inshadow);

    // 圆形渐变背景
    if(c.y == 0.0)
        diffuse = min(pow(length(p), 10.0) * 0.125, 1.0);
    // ❤
    float s = 1.0 - diffuse;

    /// 着色
    //vec4 tt = vec4(1, 0.9, 0.8, 1);
    vec4 tt = vec4(.5, .5, .5, 1.);
    vec4 mCol = mix(tt, tt * 0.5, s);

    return mix(mCol, tt * 0.5, c.z);
}

void main() {
    float time = 0.;

    // pixel position
    vec2 q = v_uv;
    // [0., 1.] -> [-1., 1.]
    vec2 p = -1.0 + 2.0 * q;
    // 纵横比
    p.x *= -u_Size.x / u_Size.y;

    // mouse
    vec2 m = u_Mouse.xy / u_Size.xy;
    if(u_Mouse.x == 0.0 && u_Mouse.y == 0.0) {
        m = vec2(time * 0.06 + 1.67, 0.78);
    }
    // [0., 1.] -> [-1., 1.]
    m = -1.0 + 2.0 * m;
    m *= vec2(4.0, -0.75);
    m.y += 0.75;

    // camera position
    float dist = 50.0;
    // 世界坐标系中心
    vec3 ta = vec3(0, 0, 0);

    /// @note 相机原点
    // 把鼠标的坐标变化看做弧度
    // 随着鼠标拖动，使得相机旋转（想象一个水平和垂直的圆相交）到世界坐标系的新位置
    vec3 ro = vec3(cos(m.x) * cos(m.y) * dist, sin(m.x) * cos(m.y) * dist, sin(m.y) * dist);

    // 随着鼠标的拖动，使得光线水平旋转（想象一个水平的圆）到世界坐标系新的位置
    vec3 light = vec3(cos(m.x - 2.27) * 50.0, sin(m.x - 2.27) * 50.0, -20.0);

    // camera direction
    vec3 cw = normalize(ta - ro);       // Look Direction（Forward）
    vec3 cp = vec3(0.0, 0.0, 1.0);      // z Direction
    vec3 cu = normalize(cross(cw, cp)); // Right Direction
    vec3 cv = normalize(cross(cu, cw)); // Up Direction
    // 将屏幕坐标从相机视图坐标系转换到世界坐标系
    // (p.x, p.y, 2.5) * (Right, Up, Look)
    vec3 rd = normalize(p.x * cu + p.y * cv + 2.5 * cw);

    // calculate color
    vec4 col = getPixel(p, ro, rd, normalize(light));

    gl_FragColor = col;

}