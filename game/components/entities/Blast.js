define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Blast',
        {
            init: function() {
                return this.requires('2D, WebGL, explosionStart, SpriteAnimation, Horizon, Collision');
            },
            remove: function() {
                return this.unbind('GameLoop');
            },
            explode: function(attr, frameOptions) {
                var duration, radius, ref, ref1;
                radius = (ref = attr.radius) != null ? ref : 20;
                duration = ((ref1 = attr.duration) != null ? ref1 : 160) / 1000;
                this.attr(attr);
                this.attr({
                    w: attr.radius * 4,
                    h: attr.radius * 4
                });
                this.attr({
                    x: this.x - (this.w / 2),
                    y: this.y - (this.h / 2)
                });
                this.collision([this.w * .2, this.h * .2, this.w * .8, this.h * .2, this.w * .8, this.h * .8, this.w * .2, this.h * .8]);
                this.reel('explode', duration * 3000, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [0, 3], [1, 3]]);
                if (frameOptions) {
                    this.bind('GameLoop', (function (_this) {
                        return function () {
                            var a;
                            a = frameOptions.call(_this);
                            return _this.attr(a);
                        };
                    })(this));
                }
                this.bind('AnimationEnd', (function (_this) {
                    return function () {
                        return _this.destroy();
                    };
                })(this));
                this.animate('explode');
                return this;
            }
        });
    });