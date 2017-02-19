define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Sphere', {
            init: function () {
                this.requires('2D, WebGL, sphere1, SpriteAnimation');
                this.crop(5, 4, 7, 7);
                this.attr({
                    w: 7,
                    h: 7,
                    speed: 300
                });
                return this.reel('blink', 150, [[7, 3, 1, 1], [8, 3, 1, 1]]);
            },
            blink: function () {
                this.animate('blink', -1);
                return this;
            },
            muzzle: function () {
                this.sprite(8, 3);
                return this;
            }
        });
    });