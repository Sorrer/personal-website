export const HEXAGON_VERTEX = 
`
#define S(r,v) smoothstep(9./iResolution.y,0.,abs(v-(r)))

const vec2 s = vec2(1, 1.7320508); // 1.7320508 = sqrt(3)
const vec3 baseCol = vec3(228. / 255., 221. / 255., 247. / 255.);
const float borderThickness = .01;
const float isolineOffset = .4;
const float isolineOffset2 = .325;

float calcHexDistance(vec2 p)
{
    p = abs(p);
    return max(dot(p, s * .5), p.x);
}

float random(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 calcHexInfo(vec2 uv)
{
    vec4 hexCenter = round(vec4(uv, uv - vec2(.5, 1.)) / s.xyxy);
    vec4 offset = vec4(uv - hexCenter.xy * s, uv - (hexCenter.zw + .5) * s);
    return dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) ? vec4(offset.xy, hexCenter.xy) : vec4(offset.zw, hexCenter.zw);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 20. * (2. * fragCoord - iResolution.xy) / iResolution.y;
    
    
    vec4 hexInfo = calcHexInfo(uv);
    float totalDist = calcHexDistance(hexInfo.xy) + borderThickness;
    float rand = random(hexInfo.zw) * 0.2;
    
    float angle = atan(hexInfo.y, hexInfo.x) + rand * 3.  + iTime;
    vec3 isoline = S(isolineOffset, totalDist) * baseCol * step(3. + rand * .5, mod(angle, 6.28));
       
    float sinOffset = sin( rand * 8.);
    float aa = 0.5;
    
    fragColor.rgb = (smoothstep(.0, .0 - aa, totalDist) + pow(1. - max(0., .5 - totalDist), 100.) * 1.5)
        * (baseCol ) + isoline + baseCol * smoothstep(.8 + sinOffset, .8- aa, totalDist);    
}
`;

export const HEXAGON_VERTEX_DARK = 
`
#define S(r,v) smoothstep(30./iResolution.y,0.,abs(v-(r)))

const vec2 s = vec2(1, 1.7320508); // 1.7320508 = sqrt(3)
const vec3 baseCol = vec3(0.03137254901, 0.01960784313, 0.05098039215);
const float borderThickness = .01;
const float isolineOffset = .4;
const float isolineOffset2 = .15;

float calcHexDistance(vec2 p)
{
    p = abs(p);
    return max(dot(p, s * .5), p.x);
}

float random(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 calcHexInfo(vec2 uv)
{
    vec4 hexCenter = round(vec4(uv, uv - vec2(.5, 1.)) / s.xyxy);
    vec4 offset = vec4(uv - hexCenter.xy * s, uv - (hexCenter.zw + .5) * s);
    return dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) ? vec4(offset.xy, hexCenter.xy) : vec4(offset.zw, hexCenter.zw);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 12. * (2. * fragCoord - iResolution.xy) / iResolution.y;
    
    
    vec4 hexInfo = calcHexInfo(uv);
    float totalDist = calcHexDistance(hexInfo.xy) + borderThickness;
    float rand = random(hexInfo.zw);
    
    float angle = atan(hexInfo.y, hexInfo.x) + rand * 3.  + iTime;
    vec3 isoline = S(isolineOffset, totalDist) * baseCol * step(3. + rand * .7, mod(angle, 6.));
       
    float sinOffset = sin( rand * 8.);
    float aa = 1.0;
    
    fragColor.rgb = (smoothstep(.51, .51 - aa, totalDist) + pow(1. - max(0., .5 - totalDist), 20.) * 1.5)
        * (baseCol ) + isoline * 15. + baseCol * smoothstep(.2 + sinOffset, .2 + sinOffset - aa, totalDist);    
}
`;