uniform float u_Time;
attribute vec2 a_Process;
attribute vec4 a_Angle;
attribute vec4 a_Color;
attribute float a_PivotScale;
attribute vec3 a_Position2;
varying vec4 v_Color;
attribute vec4 a_Color2;
uniform vec4 u_Path[PATH_LENGTH];
# include<noise_v3_f>;
# include<catmull_rom_spline>;
# include<quat_from_axis_angle>;
# include<rotate_vector>;
vec3 to_next_pos_transition(in vec3 transform, in float progress) {
    progress = max(progress - 1.0, 0.0); //delay 0->1
    vec4 quaternion = quat_from_axis_angle(a_Angle.xyz, a_Angle.w * progress);
    float index = progress * PATH_MAX;//将该状态转换到路径状态，得到该状态对应的顶点数据索引
    ivec4 path = getCatmullRomSplineIndices(PATH_MAX, index);
    //Catmull-Rom Spline计算
    vec4 p0 = u_Path[path[0]];
    vec4 p1 = u_Path[path[1]];
    vec4 p2 = u_Path[path[2]];
    vec4 p3 = u_Path[path[3]];
    //通过fract可以去表现顶点在一段曲线的位置
    float path_progress = fract(index);
    //加上枢轴距离
    transform += catmullRomSpline(p0.w, p1.w, p2.w, p3.w, path_progress) * a_PivotScale;
    if(progress != 0.0)
        transform *= snoise(transform) * 6.0;
    //加上旋转
    transform = rotate_vector(quaternion, transform);
    //加上Catmull-Rom Spline
    transform += catmullRomSpline(p0.xyz, p1.xyz, p2.xyz, p3.xyz, path_progress);
    return transform;
}
vec3 to_next_pos_transition_1(in vec3 transform, in float progress) {

    ivec4 path_pos = getCatmullRomSplineIndices(PATH_MAX, PATH_MAX);
    //取出曲线上的4个点
    vec4 p0 = u_Path[path_pos[0]];
    vec4 p1 = u_Path[path_pos[1]];
    vec4 p2 = u_Path[path_pos[2]];
    vec4 p3 = u_Path[path_pos[3]];
    transform += catmullRomSpline(p0.xyz, p1.xyz, p2.xyz, p3.xyz, fract(PATH_MAX));
    transform = mix(transform, a_Position2, progress);
    return transform;
}
void main() {
    vec3 transform = position;
    float frequency = mod((u_Time + a_Process.x) / a_Process.y, 3.0);//step
    float round = floor((u_Time + a_Process.x) / a_Process.y / 3.0);
    if(frequency < 2.0) {
        if(round >= 1.0 && frequency < 1.0) {
            transform = a_Position2;
        } else {
            transform = to_next_pos_transition(transform, frequency);
        }
    } else if(frequency >= 2.0 && frequency < 3.0) {
        transform = to_next_pos_transition_1(transform, frequency - 2.0);
    } else {
        transform = a_Position2;
    }
    vec4 modelPosition = modelMatrix * vec4(transform, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vec4 col = (mix(a_Color, a_Color2, max(frequency - 2.0, 0.0)));
    v_Color = col;
    gl_PointSize = 4.;

}