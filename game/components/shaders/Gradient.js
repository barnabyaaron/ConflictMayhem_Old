define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        var GRADIENT_ATTRIBUTE_LIST, GRADIENT_FRAGMENT_SHADER, GRADIENT_VERTEX_SHADER,
        slice = [].slice;

        GRADIENT_VERTEX_SHADER = "attribute vec2 aPosition;\nattribute vec3 aOrientation;\nattribute vec2 aLayer;\nattribute vec4 aColor;\n\nvarying lowp vec4 vColor;\nvarying lowp vec2 vLayer;\nuniform  vec4 uViewport;\n\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\n\nvoid main() {\n  vec2 pos = aPosition;\n  vec2 entityOrigin = aOrientation.xy;\n  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));\n\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );\n\n  vColor = aColor;\n  vLayer = aLayer;\n}";

        GRADIENT_FRAGMENT_SHADER = "precision mediump float;\nvarying lowp vec4 vColor;\nvarying lowp vec2 vLayer;\nvoid main(void) {\n  gl_FragColor = vec4(vColor.rgb*vColor.a*vLayer.y, vColor.a*vLayer.y);\n}";

        GRADIENT_ATTRIBUTE_LIST = [
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
          }
        ];

        Crafty.extend({
            defaultGradientShader: function (shader) {
                if (arguments.length === 0) {
                    if (this._defaultGradientShader === void 0) {
                        this._defaultGradientShader = new Crafty.WebGLShader(GRADIENT_VERTEX_SHADER, GRADIENT_FRAGMENT_SHADER, GRADIENT_ATTRIBUTE_LIST, function (e) { });
                    }
                    return this._defaultGradientShader;
                }
                return this._defaultGradientShader = shader;
            }
        });

        Crafty.c('Gradient', {
            init: function () {
                this._topColor = {
                    _red: 0,
                    _green: 0,
                    _blue: 0,
                    _strength: 1.0
                };
                this._bottomColor = {
                    _red: 0,
                    _green: 0,
                    _blue: 0,
                    _strength: 1.0
                };
                this.ready = true;
                this.bind('Draw', this._drawGradient);
                if (this.has('WebGL')) {
                    this._establishShader("Gradient", Crafty.defaultGradientShader());
                }
                return this.trigger('Invalidate');
            },
            remove: function () {
                this.unbind('Draw', this._drawGradient);
                if (this.has('DOM')) {
                    this._element.style.backgroundColor = 'transparent';
                }
                return this.trigger('Invalidate');
            },
            _drawGradient: function (e) {
                if (e.type === 'webgl') {
                    return e.program.writeVector('aColor', this._topColor._red / 255, this._topColor._green / 255, this._topColor._blue / 255, this._topColor._strength, this._bottomColor._red / 255, this._bottomColor._green / 255, this._bottomColor._blue / 255, this._bottomColor._strength);
                }
            },
            topColor: function (color) {
                if (arguments.length === 0) {
                    return this._topColor;
                }
                return this._setColor.apply(this, [this._topColor].concat(slice.call(arguments)));
            },
            bottomColor: function (color) {
                if (arguments.length === 0) {
                    return this._bottomColor;
                }
                return this._setColor.apply(this, [this._bottomColor].concat(slice.call(arguments)));
            },
            _setColor: function (varColor, color) {
                if (arguments.length >= 4) {
                    varColor._red = arguments[1];
                    varColor._green = arguments[2];
                    varColor._blue = arguments[3];
                    if (typeof arguments[4] === 'number') {
                        varColor._strength = arguments[4];
                    }
                } else {
                    Crafty.assignColor(color, varColor);
                    if (typeof arguments[2] === 'number') {
                        varColor._strength = arguments[2];
                    }
                }
                this.trigger('Invalidate');
                return this;
            }
        });
    });