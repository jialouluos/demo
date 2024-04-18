attribute float a_Percent;
varying float v_PercentageSize;
uniform float u_Time;
uniform float u_Flag;
uniform float u_Number;
uniform float u_Length;
uniform float u_Size;
uniform float u_Speed;
void main() {
    vec4 Mvposition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * Mvposition;
    gl_PointSize = u_Size - abs(clamp(fract((a_Percent + u_Time * u_Speed) * u_Number), 0.0, 1.0) * (1. / u_Length) * u_Size);

    v_PercentageSize = gl_PointSize / u_Size;

}