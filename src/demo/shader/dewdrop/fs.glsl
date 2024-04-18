
precision mediump float;
uniform float u_Time;//时间
uniform vec2 u_Mouse;//鼠标
uniform vec2 u_Resolution;//屏幕
uniform float u_VelocityBox;//立方体
uniform float u_Progress;//进步
uniform float u_Angle;//角度
uniform float u_Distance;//距离
uniform float u_VelocitySphere;//球下落的速度
uniform sampler2D u_Texture;//纹理
uniform float u_IsTexture;
uniform float u_Bias;
uniform float u_BiaScale;
varying vec2 v_uv;//uv

struct Material {
    float diffusse;//光强
    vec3 normal;//法向量
    float specular;//反射光
};
Material material;
const float PI = 3.1415926;//Π
const float SURF_DIST = 0.01;

# include<to_center>;
# include<smooth_min>;
# include<sdf>;

float movingSphere(vec3 p,float shape){
    float rad=u_Angle*PI;
    vec3 pos=vec3(cos(rad),sin(rad),0.)*u_Distance;
    vec3 displacement=pos*fract(u_Time*u_VelocitySphere);
    float gotoCenter=sdf_sphere(p-displacement,.1);
    return smooth_min(shape,gotoCenter,.3);
}
# include<rotate>;
float GetSDF(vec3 p){
    vec3 p1=rotate(p,vec3(0.0,1.0,0.0),u_Time*u_VelocityBox);
    float s_capsule_1 = sdf_capsule(p1-vec3(0.0,0.5,0.0),vec3(0.0,0.3,0.0),vec3(0.0,0.6,0.0),0.2);//胶囊
    float s_torus_1 = sdf_torus2(p1-vec3(0.0,0.1,0.0),vec2(0.1,0.1));//圆环
    float s_box_1 = sdf_box(p1-vec3(0.0,-0.5,0.0),vec3(0.2));//立方体
    float sm_ = smooth_min(s_capsule_1,s_torus_1,.3);
    sm_ = smooth_min(sm_,s_box_1,.3);
    float mix_box_1=movingSphere(p-vec3(0.0,0.9,0.0),sm_);
    vec2 sm = u_Mouse;//鼠标坐标
    if(sm.x<-10.){
        return mix_box_1;
    }
    sm.x *=(u_Resolution.x/u_Resolution.y);//修正长宽比
    float mouseSphere=sdf_sphere(p-vec3(sm,0.),.15);
    return smooth_min(mix_box_1,mouseSphere,.1);
}
# include<ray_march>;
vec2 matcap(vec3 eye, vec3 normal) {
    vec3 reflected = reflect(eye, normal);
    float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
    return reflected.xy / m + 0.5;
  }
vec3 GetNormal(vec3 p) {//得到一个点的法向量，这个点是一个平面上的任一点基于这个平面所表现出来的法向量
    float offset = 1e-4;
    vec3 n = vec3(GetSDF(p) - GetSDF(p - vec3(offset, 0.0, 0.0)), GetSDF(p) - GetSDF(p - vec3(0.0, offset, 0.0)), GetSDF(p) - GetSDF(p - vec3(0.0, 0.0, offset)));
    return normalize(n);
}
float GetLight(vec3 p, vec3 dir) {
    //设定光源
    vec3 light_pos = vec3(8.0,4.0,8.0);
    //求出场景中的物体到光源的方向向量
    vec3 light_dir = normalize(light_pos - p);
    //计算物体的法线
    material.normal = GetNormal(p);
    material.diffusse = 2.0 * max(0.0, dot(light_dir, material.normal));//计算光照强度,这里*2.0代表光强乘2.0
    //计算镜面反射
    vec3 halfVec = normalize(normalize(dir) + normalize(light_dir));
    float spec = dot(halfVec, material.normal);
    material.specular = 1.0;
    material.specular = max(0.0, pow(spec * material.specular, 150.0));
    float d = ray_march(p + material.normal * 2.0 * SURF_DIST, light_dir);
    if(d < length(light_pos - p))//如果小于，则认为中间存在阻挡
    {
        material.diffusse *= 0.1;
        material.specular = 0.0;//
    }
    return material.diffusse + material.specular;
}
vec3 background(vec2 uv){
    float dist=length(uv-vec2(.5));
    vec3 bg=mix(vec3(.3),vec3(.0),dist);
    return bg;
}
# include<fresnel>;

void main(){
    //第一步,获取uv
    vec2 st = to_center(v_uv);//将uv改为以中心为原点
    vec3 bg = background(v_uv);//背景
    st.x *=(u_Resolution.x/u_Resolution.y);//修正长宽比

    //第二步,相机三大件
    vec3 camera_pos =vec3(0.,0.,1.0);//相机坐标
    vec3 camera_target = vec3(0.0);//焦点
    vec3 camera_up = vec3(0.,-1.,0.);//相机朝向
    //第三步世界中心坐标,其作用可以是：求相机的焦点(vec3 camera_target = world_pos - camera_pos;)
    vec3 world_pos = vec3(0.0);//世界中心坐标
    //第四步,进行nuv坐标系构建
    vec3 camera_n = normalize(camera_target - camera_pos);//n轴表示焦点减去相机位置的一个向量,即相机坐标指向焦点的方向向量(隐含归一化)
    vec3 camera_u = normalize(cross(camera_n,camera_up));//u是朝向与n轴的叉乘,如果把朝向看成y轴,n轴看成x轴的话,那么u轴就是z轴(隐含归一化)
    vec3 camera_v = normalize(cross(camera_n,camera_u));//用此来重新得到朝向,这里是为了避免原来的朝向和相机焦点不为直角,用叉乘计算换为直角(隐含归一化)
    //第五步,将屏幕坐标系视图坐标系转换为世界坐标系,这样子转换好像是透视相机的转换(不知道这样理解对不对,后面理解了再来更正)
    // vec3 Ray = st.x * camera_u + st.y * camera_v + 0.7 * camera_n + camera_pos;//Ray可以理解为一个方向(射线),这个Ray就是步进的关键
    // Ray = normalize(Ray - camera_pos);//转变为从相机发射的一条射线(归一化)
    //第五步 ，正交相机的转换(不知道这样理解对不对,后面理解了再来更正)
    vec3 Ray = normalize(vec3(st.x,st.y, -camera_pos.z));//转变为从相机发射的一条射线(归一化)
    float dis_ray = ray_march(camera_pos,Ray);//计算距离场
    vec3 col = bg;
    if(dis_ray<MAX_DIST){
        vec3 p = camera_pos + Ray * dis_ray;
        float dif = GetLight(p, -Ray);
        vec2 matcapUv = matcap(Ray,material.normal);//MatCap(材质捕获,也称为LitSphere)是完整的材质,包括光照和反射,因此可以将其添加到对象中而无需任何光照和反射。
        if(u_IsTexture>0.5){
            col = texture2D(u_Texture,matcapUv).rgb;//纹理
        }else{
            col = vec3(dif);
        }
        float F=fresnel(u_Bias,u_BiaScale,5.0,Ray,material.normal);
        col += mix(col,bg,F);
        // col *=dif;//这里表示是否受光照影响,由于是matcap所以注释掉反而更好
    }
    gl_FragColor = vec4(col,1.0);

}