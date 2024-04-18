precision mediump float;

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor

varying vec2 v_uv;

uniform sampler2D u_bg;
uniform float u_Time;
uniform int u_vfx_type;

void main() {

    vec2 vTex = v_uv;

    float step = 1.;
    float tcOffset[25]; // 存储纹理坐标偏移量
    float xInc = step / 512.;
    float yInc = step / 512.;

   /// 提前赋值
    for(int i = 0; i < 5; i++) {
        for(int j = 0; j < 5; j++) {
            tcOffset[(((i * 5) + j) * 2) + 0] = (-2.0 * xInc) + (float(i) * xInc);
            tcOffset[(((i * 5) + j) * 2) + 1] = (-2.0 * yInc) + (float(j) * yInc);
        }
    }
   // ===========================================
   // 标准
    if(u_vfx_type == 0) {
        fragColor = texture(u_bg, vTex);
    }
   // 灰度图
    if(u_vfx_type == 1) {
      // 使用 NTSC 权重转换为灰度
        float grey = dot(texture(u_bg, vTex).rgb, vec3(0.299, 0.587, 0.114));

        fragColor = vec4(grey, grey, grey, 1.0);
    }

   // ❤ Sepia 色调
    if(u_vfx_type == 2) {
      // 使用 NTSC 权重转换为灰度
        float grey = dot(texture(u_bg, vTex).rgb, vec3(0.299, 0.587, 0.114));

      // 使用以下 rgb 权重来获得不同的色调。
      // (只要所有 rgb 权重加起来等于 1.0 ，就不会使图像变亮或变暗)
        fragColor = vec4(grey * vec3(1.2, 1.0, 0.8), 1.0);
    }

   // 反色
    if(u_vfx_type == 3) {
        vec4 texMapColour = texture(u_bg, vTex);

        fragColor = vec4(1.0 - texMapColour.rgb, 1.0);
    }

   // 高斯滤波
    if(u_vfx_type == 4) {
        vec4 samples[25];

        for(int i = 0; i < 25; i++) {
         // 采样邻域的网格
            samples[i] = texture(u_bg, vTex + tcOffset[i]);
        }

      // 高斯权重:
      // 1  4  7  4 1
      // 4 16 26 16 4
      // 7 26 41 26 7 / 273 (i.e. divide by total of weightings)
      // 4 16 26 16 4
      // 1  4  7  4 1

        fragColor = ((1.0 * (samples[0] + samples[4] + samples[20] + samples[24])) +
            (4.0 * (samples[1] + samples[3] + samples[5] + samples[9] + samples[15] + samples[19] + samples[21] + samples[23])) +
            (7.0 * (samples[2] + samples[10] + samples[14] + samples[22])) +
            (16.0 * (samples[6] + samples[8] + samples[16] + samples[18])) +
            (26.0 * (samples[7] + samples[11] + samples[13] + samples[17])) +
            (41.0 * samples[12])) / 273.0;

    }

   // 均值滤波
    if(u_vfx_type == 5) {
        vec4 sampless[25];
        for(int i = 0; i < 25; i++) {
         // 采样邻域的网格
            sampless[i] = texture(u_bg, vTex + tcOffset[i]);
        }

        vec4 color;
        for(int i = 0; i < 25; i++) color += sampless[i];

        fragColor = color / 25.;
    }

   // 锐化
    if(u_vfx_type == 6) {
        vec4 samples[25];

        for(int i = 0; i < 25; i++) {
         // 采样邻域的网格
            samples[i] = texture(u_bg, vTex + tcOffset[i]);
        }

      // 锐化权重:
      // -1 -1 -1 -1 -1
      // -1 -1 -1 -1 -1
      // -1 -1 25 -1 -1
      // -1 -1 -1 -1 -1
      // -1 -1 -1 -1 -1

        fragColor = 25.0 * samples[12];

        for(int i = 0; i < 25; i++) {
            if(i != 12)
                fragColor -= samples[i];
        }
    }

   // 膨胀
    if(u_vfx_type == 7) {
        vec4 samples[25];
        vec4 maxValue = vec4(0.0);

        for(int i = 0; i < 25; i++) {
         // 采样邻域的网格
            samples[i] = texture(u_bg, vTex + tcOffset[i]);

         // 保留最大值      
            maxValue = max(samples[i], maxValue);
        }

        fragColor = maxValue;
    }

   // 腐蚀
    if(u_vfx_type == 8) {
        vec4 samples[25];
        vec4 minValue = vec4(1.0);

        for(int i = 0; i < 25; i++) {
          // 采样邻域的网格
            samples[i] = texture(u_bg, vTex + tcOffset[i]);

         // 保留最小值     
            minValue = min(samples[i], minValue);
        }

        fragColor = minValue;
    }

   // 拉普拉斯 边界检测 (和锐化效果十分相似!)
    if(u_vfx_type == 9) {
        vec4 samples[25];

        for(int i = 0; i < 25; i++) {
         // samples a grid around and including our texel
            samples[i] = texture(u_bg, vTex + tcOffset[i]);
        }

      // Laplacian weighting:
      // -1 -1 -1 -1 -1
      // -1 -1 -1 -1 -1
      // -1 -1 24 -1 -1
      // -1 -1 -1 -1 -1
      // -1 -1 -1 -1 -1

        fragColor = 24.0 * samples[12];

        for(int i = 0; i < 25; i++) {
            if(i != 12)
                fragColor -= samples[i];
        }
    }
}