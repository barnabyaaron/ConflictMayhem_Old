define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Hideable', {
            init: function () {
                this.requires('ColorEffects');
                return this.hidden = false;
            },
            sendToBackground: function (scale, z) {
                var c, i, len, ref, zOff;
                this._originalZ = this.z;
                this.attr({
                    scale: scale,
                    z: z
                });
                ref = this._children;
                for (i = 0, len = ref.length; i < len; i++) {
                    c = ref[i];
                    if (c.attr != null) {
                        zOff = c.z - this._originalZ;
                        c.attr({
                            z: z + zOff
                        });
                    }
                }
                if (!this.hidden) {
                    this.trigger('Hiding', this);
                }
                return this.hidden = true;
            },
            hide: function (hideMarker, options) {
                var c, i, j, len, len1, ref, ref1;
                this.hideMarker = hideMarker;
                this.hidden = true;
                if (options.below && this.has('Sprite')) {
                    this.hideAt = options.below;
                    ref = this._children;
                    for (i = 0, len = ref.length; i < len; i++) {
                        c = ref[i];
                        if (typeof c.attr === "function") {
                            c.attr({
                                hideAt: options.below
                            });
                        }
                    }
                } else {
                    this.attr({
                        alpha: .0
                    });
                    ref1 = this._children;
                    for (j = 0, len1 = ref1.length; j < len1; j++) {
                        c = ref1[j];
                        if (typeof c.attr === "function") {
                            c.attr({
                                alpha: .0
                            });
                        }
                    }
                }
                return this.trigger('Hiding', this);
            },
            reveal: function () {
                var c, currentScale, i, j, len, len1, ref, ref1, ref2, ref3, scale, zOff;
                if ((ref = this.hideMarker) != null) {
                    ref.destroy();
                }
                this.hidden = false;
                currentScale = (ref1 = this.scale) != null ? ref1 : 1.0;
                scale = 1.0;
                ref2 = this._children;
                for (i = 0, len = ref2.length; i < len; i++) {
                    c = ref2[i];
                    if (c.attr != null) {
                        zOff = c.z - this.z;
                        c.attr({
                            z: this._originalZ + zOff
                        });
                    }
                }
                this.attr({
                    scale: scale,
                    alpha: 1.0,
                    z: this._originalZ,
                    hideAt: null
                });
                ref3 = this._children;
                for (j = 0, len1 = ref3.length; j < len1; j++) {
                    c = ref3[j];
                    if (typeof c.attr === "function") {
                        c.attr({
                            alpha: 1.0,
                            hideAt: null
                        });
                    }
                }
                return this.trigger('Revealing', this);
            },
            remove: function () {
                var ref;
                return (ref = this.hideMarker) != null ? ref.destroy() : void 0;
            }
        });
    });