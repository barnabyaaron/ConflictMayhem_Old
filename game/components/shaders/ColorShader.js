define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        var COLOR_EFFECTS_ATTRIBUTE_LIST, COLOR_EFFECTS_FRAGMENT_SHADER, COLOR_EFFECTS_VERTEX_SHADER;

        COLOR_EFFECTS_VERTEX_SHADER = "attribute vec2 aPosition;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec4 aColor;\nattribute vec4 aDesaturation;\nattribute vec2 aGradient;\n\nvarying lowp vec4 vColor;\nvarying lowp vec4 vDesaturation;\nvarying lowp vec2 vGradient;\nvarying lowp vec2 vLayer;\nuniform  vec4 uViewport;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n\n  vColor = aColor;\n  vDesaturation = aDesaturation;\n  vGradient = aGradient;\n  vLayer = aLayer;\n}";

        COLOR_EFFECTS_FRAGMENT_SHADER = "precision mediump float;\nvarying lowp vec4 vColor;\nvarying lowp vec2 vGradient;\nvarying lowp vec4 vDesaturation;\nvarying lowp vec2 vLayer;\nvoid main(void) {\n\n  //gl_FragColor = vec4(vColor.rgb*vColor.a*vLayer.y, vColor.a*vLayer.y);\n\n  mediump float mixFactor = vGradient.x;\n\n  mediump float lightness = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);\n  mediump float lightnessBase = (0.2126*vDesaturation.r + 0.7152*vDesaturation.g + 0.0722*vDesaturation.b);\n  mediump vec4 baseColor = vec4(vDesaturation.rgb, vColor.a) * (1.0 + (lightness - lightnessBase));\n  mediump vec4 mixColor = vec4(\n    (baseColor.rgba * mixFactor) + (vColor.rgba * (1.0 - mixFactor))\n  );\n\n  gl_FragColor = vec4(\n    mixColor.rgb * vColor.a * vLayer.y,\n    vColor.a * vLayer.y\n  );\n}";

        COLOR_EFFECTS_ATTRIBUTE_LIST = [
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
              name: "aColor",
              width: 4
          }, {
              name: "aDesaturation",
              width: 4
          }, {
              name: "aGradient",
              width: 2
          }
        ];

        Crafty.defaultShader('Color', new Crafty.WebGLShader(COLOR_EFFECTS_VERTEX_SHADER, COLOR_EFFECTS_FRAGMENT_SHADER, COLOR_EFFECTS_ATTRIBUTE_LIST, function (e, ent) {
            var bds, color, ref, ref1, ref2, ref3, s, tds;
            color = (ref = ent.desaturationColor) != null ? ref : {
                _red: 0,
                _green: 0,
                _blue: 0
            };
            e.program.writeVector("aColor", ent._red / 255, ent._green / 255, ent._blue / 255, ent._strength);
            e.program.writeVector("aDesaturation", color._red / 255, color._green / 255, color._blue / 255, 1.0);
            s = (ref1 = ent.scale) != null ? ref1 : 1;
            tds = (ref2 = ent.topDesaturation) != null ? ref2 : 0;
            bds = (ref3 = ent.bottomDesaturation) != null ? ref3 : 0;
            return e.program.writeVector("aGradient", tds + ((1 - s) * 1.15), bds + ((1 - s) * 1.15));
        }));
    });