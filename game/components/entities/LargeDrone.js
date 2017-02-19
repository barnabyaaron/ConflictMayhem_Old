define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('LargeDrone',
        {
            init: function () {
                // @TODO 'standardLargeDrone' sprite
                return this.requires('Enemy, standardLargeDrone, SpriteAnimation');
            },
            drone: function(attr) {
                var defaultHealth, ref;
                if (attr == null) {
                    attr = {};
                }
                defaultHealth = 360000;
                this.crop(0, 0, 90, 70);
                this.attr(_.defaults(attr, {
                    health: defaultHealth,
                    maxHealth: (ref = attr.health) != null ? ref : defaultHealth,
                    z: -1
                }));
                this.origin('center');
                this.collision([2, 36, 16, 15, 86, 2, 88, 4, 62, 15, 57, 46, 46, 66, 18, 66, 3, 47]);
                // @TODO 'eyeStart' sprite
                this.eye = Crafty.e('2D, WebGL, eyeStart, SpriteAnimation');
                this.eye.crop(0, 0, 20, 26);
                this.attach(this.eye);
                this.eye.attr({
                    x: 2 + this.x,
                    y: 18 + this.y,
                    z: 1
                });
                this.eye.reel('slow', 1500, [[6, 0], [7, 0], [8, 0], [9, 0], [6, 1], [7, 1], [8, 1], [9, 1]]);
                // @TODO 'wingLoaded' sprite
                this.wing = Crafty.e('2D, WebGL, wingLoaded, SpriteAnimation');
                this.wing.crop(0, 0, 46, 21);
                this.attach(this.wing);
                this.wing.attr({
                    x: 19 + this.x,
                    y: 28 + this.y,
                    z: 1,
                    h: 21,
                    w: 46
                });
                this.wing.reel('emptyWing', 30, [[14, 2, 2, 1]]);
                this.wing.reel('reload', 500, [[6, 2, 2, 1], [8, 2, 2, 1], [10, 2, 2, 1], [12, 2, 2, 1]]);
                this.enemy();
                this.onHit('Mine', function (e) {
                    var c, i, len, mine;
                    if (Game.paused) {
                        return;
                    }
                    if (this.hidden) {
                        return;
                    }
                    for (i = 0, len = e.length; i < len; i++) {
                        c = e[i];
                        mine = c.obj;
                        if (mine.hidden) {
                            return;
                        }
                        if (mine.z < 0) {
                            return;
                        }
                        mine.absorbDamage(300);
                    }
                });
                this.updatedHealth();
                this.bind('Hit', (function (_this) {
                    return function (data) {
                        if (data.projectile.has('Bullet')) {
                            _this.shiftedX += 1;
                            Crafty.audio.play('hit', 1, .5);
                            return Crafty.e('Blast, LaserHit').explode({
                                x: data.projectile.x,
                                y: data.projectile.y,
                                z: _this.z + 2,
                                radius: 4,
                                duration: 50
                            });
                        }
                    };
                })(this));
                return this;
            },
            healthBelow: function(perc) {
                return (this.health / this.maxHealth) < perc;
            },
            updatedHealth: function() {
                var healthPerc;
                healthPerc = this.health / this.maxHealth;
                if (healthPerc < .3) {
                    return this.sprite(9, 8, 3, 3);
                }
                if (healthPerc < .6) {
                    return this.sprite(6, 8, 3, 3);
                }
                if (healthPerc < .9) {
                    return this.sprite(3, 8, 3, 3);
                }
                return this.sprite(0, 8, 3, 3);
            },
            updateMovementVisuals: function(rotation, dx, dy, dt) {
                this.vx = dx * (1000 / dt);
                return this.vy = dy * (1000 / dt);
            }
        });
    });