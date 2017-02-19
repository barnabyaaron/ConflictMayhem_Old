define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Scalable', {
            _scale: 1.0,
            _Scalable_property_definitions: {
                scale: {
                    set: function (v) {
                        return this._updateScale(v);
                    },
                    get: function () {
                        return this._scale;
                    },
                    configurable: true,
                    enumerable: true
                },
                _scale: {
                    enumerable: false
                }
            },
            init: function () {
                this._defineScalableProperties();
                return this._scale = 1.0;
            },
            remove: function () { },
            _defineScalableProperties: function () {
                var def, prop, ref, results;
                ref = this._Scalable_property_definitions;
                results = [];
                for (prop in ref) {
                    def = ref[prop];
                    results.push(Object.defineProperty(this, prop, def));
                }
                return results;
            },
            _updateScale: function (newScale) {
                var c, i, j, k, len, len1, oldH, oldScale, oldW, origin, p, ref, ref1, ref2, relX, relY, results;
                oldScale = this._scale;
                this._scale = newScale;
                oldW = this.w;
                oldH = this.h;
                this.w = this.w / oldScale * newScale;
                this.h = this.h / oldScale * newScale;
                ref = this._children;
                for (j = 0, len = ref.length; j < len; j++) {
                    c = ref[j];
                    relX = c.x - this.x;
                    relY = c.y - this.y;
                    if (typeof c.attr === "function") {
                        c.attr({
                            x: this.x + (relX / oldScale * newScale),
                            y: this.y + (relY / oldScale * newScale),
                            w: (c.w + oldW - this.w) / oldScale * newScale,
                            h: (c.h + oldH - this.h) / oldScale * newScale
                        });
                    }
                }
                if (((ref1 = this.map) != null ? ref1.points : void 0) != null) {
                    ref2 = this.map.points;
                    results = [];
                    for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
                        p = ref2[i];
                        origin = i % 2 === 0 ? this.x : this.y;
                        results.push(this.map.points[i] = origin + (((p - origin) / oldScale) * newScale));
                    }
                    return results;
                }
            }
        });
    });