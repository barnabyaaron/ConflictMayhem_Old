define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function(_, Crafty, Game) {
        Crafty.c('Enemy',
        {
            init: function() {
                this
                    .requires('2D, WebGL, Collision, Tween, Choreography ViewportFixed, Hideable, Flipable, Scaleable, SunBlock, Hostile');
                this.attr({
                    pointsOnHit: 10,
                    pointsOnDestroy: 50
                });
                return this.invincible = false;
            },
            enemy: function(options) {
                if (options == null) {
                    options = {};
                }
                options = _.defaults(options,
                {
                    projectile: 'Bullet'
                });

                Crafty.trigger('EnemySpawned', this);
                this.onHit(options.projectile,
                    function(e) {
                        var bullet;
                        if (Game.paused) {
                            return;
                        }
                        if (this.hidden) {
                            return;
                        }
                        bullet = e[0].obj;
                        if (!this.invincible) {
                            if (this.juice !== false) {
                                this.attr({
                                    hitFlash: {
                                        _red: 255,
                                        _green: 255,
                                        _blue: 0
                                    }
                                });
                            }
                            this.absorbDamage(bullet);
                            this.trigger('Hit',
                            {
                                entity: this,
                                projectile: bullet
                            });
                        }
                        return bullet.destroy();
                    }, function() {
                        return this.attr({
                            hitFlash: false
                        });
                    });

                this.onHit('Explosion',
                    function(e) {
                        var c, i, len, results, splosion;
                        if (Game.paused) {
                            return;
                        }
                        if (this.hidden) {
                            return;
                        }
                        if (this.invincible) {
                            return;
                        }
                        results = [];
                        for (i = 0, len = e.length; i < len; i++) {
                            c = e[i];
                            splosion = c.obj;
                            if (splosion.damage > 0) {
                                this.trigger('Hit', {
                                    entity: this,
                                    projectile: splosion
                                });
                                if (this.juice !== false) {
                                    this.attr({
                                        hitFlash: {
                                            _red: 255,
                                            _green: 255,
                                            _blue: 128
                                        }
                                    });
                                }
                                this.absorbDamage(splosion);
                                results.push(splosion.damage = 0);
                            } else {
                                results.push(void 0);
                            }
                        }
                        return results;
                    }, function() {
                        return this.attr({
                            hitFlash: false
                        });
                    });
                return this;
            },
            absorbDamage: function(cause) {
                var data, ref, ref1, x, y;
                if (cause == null) {
                    return;
                }
                x = this.x + this.w / 2;
                y = this.y + this.h / 2;
                data = {
                    pointsOnHit: this.pointsOnHit,
                    pointsOnDestroy: this.pointsOnDestroy,
                    location: {
                        x: x,
                        y: y
                    }
                };
                this.health -= cause.damage;
                if (typeof this.updatedHealth === "function") {
                    this.updatedHealth();
                }
                if (this.health <= 0) {
                    Crafty.trigger('EnemyDestroyed', this);
                    this.trigger('Destroyed', this);
                    this.destroy();
                    if ((ref = cause.ship) != null) {
                        ref.trigger('DestroyTarget', data);
                    }
                    return this.deathCause = cause.ship;
                } else {
                    return (ref1 = cause.ship) != null ? ref1.trigger('HitTarget', data) : void 0;
                }
            }
        });
    });