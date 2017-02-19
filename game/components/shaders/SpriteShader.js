define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        var SPRITE_EFFECT_ATTRIBUTE_LIST, SPRITE_EFFECT_FRAGMENT_SHADER, SPRITE_EFFECT_VERTEX_SHADER;

        SPRITE_EFFECT_VERTEX_SHADER = "attribute vec2 aPosition;\nattribute vec4 aSpriteDimensions;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute vec4 aOverrideColor;\nattribute vec4 aGradient;\n\nvarying mediump vec3 vTextureCoord;\nvarying lowp vec4 vColor;\nvarying lowp vec4 vOverrideColor;\nvarying lowp vec4 vGradient;\nvarying lowp vec4 vSpriteDimensions;\n\nuniform vec4 uViewport;\nuniform mediump vec2 uTextureDimensions;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n  vTextureCoord = vec3(aTextureCoord, aLayer.y);\n  vColor = aColor;\n  vOverrideColor = aOverrideColor;\n  vGradient = aGradient;\n  vSpriteDimensions = aSpriteDimensions;\n}";

        SPRITE_EFFECT_FRAGMENT_SHADER = "precision mediump float;\nvarying mediump vec3 vTextureCoord;\nvarying mediump vec4 vColor;\nvarying mediump vec4 vOverrideColor;\nvarying mediump vec4 vGradient;\nvarying mediump vec4 vSpriteDimensions;\n\nuniform sampler2D uSampler;\nuniform mediump vec2 uTextureDimensions;\n\nfloat random(vec3 scale, float seed) {\n  // use the fragment position for a different seed per-pixel\n  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);\n  vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);\n  //vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  //vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  float e = 1.0e-10;\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nvec3 hsv2rgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main() {\n  highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;\n  float blur = vGradient.z;\n\n  if ((vGradient.a >= 0.0) && (vTextureCoord.y >= vGradient.a)) {\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    return;\n  }\n\n  mediump vec4 texelColor = texture2D(uSampler, coord);\n\n  if (blur > 0.0) {\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    for (float t = -30.0; t <= 30.0; t++) {\n      float percent = (t + offset - 0.5) / 30.0;\n      float weight = 1.0 - abs(percent);\n      vec4 sample = texture2D(uSampler, coord + (blur * percent) / uTextureDimensions);\n      // switch to pre-multiplied alpha to correctly blur transparent images\n      sample.rgb *= sample.a;\n\n      color += sample * weight;\n      total += weight;\n    }\n\n    texelColor = color / total;\n    texelColor.rgb /= texelColor.a + 0.00001;\n  }\n\n  mediump float yCoord = (vTextureCoord.y - vSpriteDimensions.y) / vSpriteDimensions.a;\n  mediump float mixFactor = (vGradient.x * (1.0 - yCoord)) + (vGradient.y * yCoord);\n\n  mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);\n  if (vOverrideColor.a == 1.0) {\n    texelColor = vec4(vOverrideColor.rgb * (lightness * 1.3), texelColor.a);\n  }\n  if (vOverrideColor.a == 2.0) {\n    vec3 texelHSV = rgb2hsv(texelColor.rgb);\n    if ((texelHSV.x < .84) && (texelHSV.x > .82)) {\n      vec3 overrideHSV = rgb2hsv(vOverrideColor.rgb);\n      texelHSV.x = overrideHSV.x;\n      texelHSV.y *= overrideHSV.y;\n      texelHSV.z *= overrideHSV.z;\n      vec3 texelRGB = hsv2rgb(texelHSV);\n      texelColor = vec4(texelRGB.rgb, texelColor.a);\n    }\n  }\n\n  mediump float lightnessBase = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);\n  mediump vec4 baseColor = vec4(vColor.rgb, texelColor.a) * (1.0 + (lightness - lightnessBase));\n  mediump vec4 mixColor = vec4(\n    (baseColor.rgba * mixFactor) + (texelColor.rgba * (1.0 - mixFactor))\n  );\n\n  if (vColor.a > 1.0) {\n    mixColor.rgb = vColor.rgb;\n  }\n\n  gl_FragColor = vec4(\n    mixColor.rgb * vColor.a * texelColor.a * vTextureCoord.z,\n    texelColor.a * vTextureCoord.z\n  );\n}";

        SPRITE_EFFECT_ATTRIBUTE_LIST = [
          {
              name: "aPosition",
              width: 2
          }, {
              name: "aOrientation",
              width: 3
          }, {
              name: "aLayer",
              width: 2
          }, {
              name: "aTextureCoord",
              width: 2
          }, {
              name: "aColor",
              width: 4
          }, {
              name: "aOverrideColor",
              width: 4
          }, {
              name: "aGradient",
              width: 4
          }, {
              name: "aSpriteDimensions",
              width: 4
          }
        ];

        Crafty.defaultShader('Sprite', new Crafty.WebGLShader(SPRITE_EFFECT_VERTEX_SHADER, SPRITE_EFFECT_FRAGMENT_SHADER, SPRITE_EFFECT_ATTRIBUTE_LIST, function (e, ent) {
            var bds, blur, bottomSaturation, co, color, hideAt, lightness, ocolor, overrideMode, ref, ref1, ref2, ref3, ref4, ref5, ref6, s, tds, topSaturation;
            co = e.co;
            e.program.writeVector("aTextureCoord", co.x, co.y, co.x, co.y + co.h, co.x + co.w, co.y, co.x + co.w, co.y + co.h);
            e.program.writeVector("aSpriteDimensions", co.x, co.y, co.w, co.h);
            color = (ref = ent.desaturationColor) != null ? ref : {
                _red: 0,
                _green: 0,
                _blue: 0
            };
            ocolor = (ref1 = ent.overrideColor) != null ? ref1 : {
                _red: 0,
                _green: 0,
                _blue: 0
            };
            lightness = (ref2 = ent.lightness) != null ? ref2 : 1.0;
            if (ent.hidden) {
                s = (ref3 = ent.scale) != null ? ref3 : 1;
            } else {
                s = 1;
            }
            blur = (ref4 = ent.blur) != null ? ref4 : 0;
            tds = (ref5 = ent.topDesaturation) != null ? ref5 : 0;
            bds = (ref6 = ent.bottomDesaturation) != null ? ref6 : 0;
            topSaturation = tds + ((1 - s) * 1.15);
            bottomSaturation = bds + ((1 - s) * 1.15);
            if (ent.hitFlash) {
                color = ent.hitFlash;
                topSaturation = 3.0;
                bottomSaturation = 3.0;
            }
            if (window.Game.webGLMode === false) {
                topSaturation = 0.0;
                bottomSaturation = 0.0;
                if (ent.has('cloud')) {
                    lightness = 1.0;
                }
            }
            e.program.writeVector("aColor", color._red / 255, color._green / 255, color._blue / 255, lightness);
            overrideMode = 0.0;
            if (ent.overrideColor != null) {
                overrideMode = 1.0;
            }
            if (ent.overrideColorMode === 'partial') {
                overrideMode = 2.0;
            }
            e.program.writeVector("aOverrideColor", ocolor._red / 255, ocolor._green / 255, ocolor._blue / 255, overrideMode);
            if (ent.hideAt) {
                hideAt = Math.max(0, co.y + ((ent.hideAt - ent.y) / ent.h) * co.h);
            } else {
                hideAt = -1.0;
            }
            return e.program.writeVector("aGradient", topSaturation, bottomSaturation, blur, hideAt);
        }));
    });