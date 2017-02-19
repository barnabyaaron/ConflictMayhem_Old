define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('ColorEffects', {
            colorDesaturation: function (color) {
                var c;
                if (color == null) {
                    return this;
                }
                c = {};
                Crafty.assignColor(color, c);
                this.attr({
                    desaturationColor: c
                });
                this.trigger("Invalidate");
                return this;
            },
            colorOverride: function (color, mode) {
                var c;
                if (mode == null) {
                    mode = 'all';
                }
                if (color == null) {
                    return this;
                }
                c = {};
                if (_.isObject(color)) {
                    c = color;
                } else {
                    Crafty.assignColor(color, c);
                }
                this.attr({
                    overrideColor: c,
                    overrideColorMode: mode
                });
                this.trigger("Invalidate");
                return this;
            },
            clearColorOverride: function () {
                this.attr({
                    overrideColor: null,
                    overrideColorMode: 'all'
                });
                this.trigger("Invalidate");
                return this;
            },
            saturationGradient: function (start, end) {
                this.attr({
                    topDesaturation: start,
                    bottomDesaturation: end
                });
                return this;
            }
        });
    });