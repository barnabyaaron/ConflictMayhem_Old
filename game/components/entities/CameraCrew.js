define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function(_, Crafty, Game) {
        Crafty.c('CameraCrew',
        {
            init: function() {
                this.requires('2D, WebGL, Choreography, ViewportFixed, Collision, Hideable, helicopter, SpriteAnimation, Flipable');
                this.reel('fly', 200, [[0, 6, 4, 2], [4, 6, 4, 2]]);
                this.crop(0, 9, 128, 55);
                this.attr({
                    w: 60,
                    h: 25
                });
                return this.origin('center');
            },
            cameraCrew: function() {
                this.animate('fly', -1);
                this.onHit('BackgroundBullet', function (e) {
                    var bullet;
                    if (Game.paused) {
                        return;
                    }
                    this.pauseAnimation();
                    this.sprite(8, 6);
                    bullet = e[0].obj;
                    this.trigger('Hit', this);
                    return bullet.destroy();
                });
                return this;
            }
        });
    });