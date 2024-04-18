varying vec2 v_uv;
uniform float u_Size;
uniform float u_Progress;
uniform float u_Time;
# include<noise_v3_f>;
# include<noise_v3_v3>;
void main() {
    vec3 noise = curlNoise(vec3(position.x * .02, position.y * .008, u_Time * 0.01));
    vec3 distortion = vec3(position.x * 6., position.y * 5., 1.0) * noise * u_Progress;
    vec3 lg = abs(vec3(log(abs(normalize(noise))).yx, 0.0));
    vec3 newPos = position + lg * u_Progress + distortion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    gl_PointSize = u_Size;
    v_uv = uv;

}