float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
    return bias + scale * pow(1. + dot(I, N), power);
}
vec3 fresnel_v3(float cosTheta, vec3 R0) {
    return R0 + (1.0 - R0) * pow(1.0 - cosTheta, 5.0);
}