define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Drone',
        {
            init: function () {
                // @TODO added 'standardDrone' sprite
                return this.requires('Enemy, standardDrone');
            },
            drone: function(attr) {
                if (attr == null) {
                    attr = {};
                }
                this.attr(_.defaults(attr, {
                    w: 40,
                    h: 40,
                    health: 100,
                    defaultSpeed: 100
                }));
                this.origin('center');
                this.collision([2, 25, 8, 18, 20, 13, 30, 15, 33, 28, 14, 34, 4, 30]);
                this.attr({
                    weaponOrigin: [2, 25]
                });
                this.enemy();
                this.bind('Hit', (function (_this) {
                    return function (data) {
                        if (_this.juice !== false) {
                            _this.shiftedX += 5;
                        }
                        if (_this.juice !== false) {
                            Crafty.audio.play('hit', 1, .5);
                        }
                        if (data.projectile.has('Bullet') && _this.juice !== false) {
                            return Crafty.e('Blast, LaserHit').explode({
                                x: data.projectile.x,
                                y: data.projectile.y,
                                radius: 4,
                                duration: 50
                            });
                        }
                    };
                })(this));
                return this;
            },
            updatedHealth: function() {
                if (this.juice === false) {
                    return;
                }
                if (this.health < 200) {
                    return this.sprite(2, 4, 2, 2);
                }
                return this.sprite(0, 4, 2, 2);
            },
            updateMovementVisuals: function(rotation, dx, dy, dt) {
                this.vx = dx * (1000 / dt);
                this.vy = dy * (1000 / dt);
                if (dx > 0) {
                    return this.flipX();
                } else {
                    return this.unflipX();
                }
            }
        });
    });