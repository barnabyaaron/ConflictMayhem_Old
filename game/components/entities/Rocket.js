define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Rocket',
        {
            init: function () {
                // @TODO 'standardRocket' sprite
                return this.requires('Enemy, standardRocket');
            },
            rocket: function(attr) {
                if (attr == null) {
                    attr = {};
                }
                this.crop(0, 0, 47, 17);
                this.attr(_.defaults(attr, {
                    health: 300
                }));
                this.origin('center');
                this.enemy();
                return this;
            },
            updateMovementVisuals: function(rotation, dx, dy, dt) {
                this.vx = dx * (1000 / dt);
                this.vy = dy * (1000 / dt);
                if (rotation != null) {
                    return this.rotation = rotation;
                }
            }
        });
    });