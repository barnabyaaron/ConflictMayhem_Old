define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        var indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

        Crafty.c('Cheats', {
            init: function () {
                this.addCheat('Freddie', ['Up', 'Up', 'Down', 'Down', 'Left', 'Right', 'Left', 'Right', 'Fire'], (function (_this) {
                    return function () {
                        var alreadyProtected, ship;
                        alreadyProtected = false;
                        ship = _this.ship;
                        Crafty('Freddy').each(function () {
                            if (this.ship === ship) {
                                return alreadyProtected = true;
                            }
                        });
                        if (!alreadyProtected) {
                            return Crafty.e('Freddy').freddy({
                                protect: _this.ship
                            });
                        }
                    };
                })(this));
                return this._listenInput();
            },
            remove: function () {
                var input, inputs, j, len, results;
                inputs = ['Up', 'Down', 'Left', 'Right', 'Fire'];
                results = [];
                for (j = 0, len = inputs.length; j < len; j++) {
                    input = inputs[j];
                    results.push(this.unbind(input));
                }
                return results;
            },
            addCheat: function (name, sequence, method) {
                if (this.cheats == null) {
                    this.cheats = [];
                }
                return this.cheats.push({
                    name: name,
                    sequence: sequence,
                    method: method,
                    index: 0
                });
            },
            _listenInput: function () {
                var input, inputs, j, len, results;
                inputs = ['Up', 'Down', 'Left', 'Right', 'Fire'];
                results = [];
                for (j = 0, len = inputs.length; j < len; j++) {
                    input = inputs[j];
                    results.push((function (_this) {
                        return function (input) {
                            return _this.bind(input, function () {
                                var c, k, len1, ref, results1;
                                ref = _this.cheats;
                                results1 = [];
                                for (k = 0, len1 = ref.length; k < len1; k++) {
                                    c = ref[k];
                                    if (c.sequence[c.index] === input) {
                                        c.index += 1;
                                        if (c.index === c.sequence.length) {
                                            results1.push(c.method());
                                        } else {
                                            results1.push(void 0);
                                        }
                                    } else {
                                        results1.push(c.index = 0);
                                    }
                                }
                                return results1;
                            });
                        };
                    })(this)(input));
                }
                return results;
            }
        });

        Crafty.c('Freddy', {
            init: function () {
                return this.requires('2D, WebGL, freddie, Scalable, ColorEffects, Collision');
            },
            remove: function () {
                return this.unbind('GameLoop', this._move);
            },
            freddy: function (options) {
                var fx, fy, midX, midY;
                this.ship = options.protect;
                this.ship.scoreText('Help me Freddie!');
                if (typeof this.colorOverride === "function") {
                    this.colorOverride(this.ship.playerColor, 'partial');
                }
                this.attr({
                    scale: .5,
                    z: this.ship.z + 5
                });
                midX = Math.floor(this.w / 2);
                midY = Math.floor(this.h / 2);
                fy = 15;
                fx = 15;
                this.collision([-fx, -fy, midX, -(2 * fy), this.w + fx, -fy, this.w + (2 * fx), midY, this.w + fx, this.h + fy, midX, this.h + (2 * fy), -fx, this.h + fy, -(2 * fx), midY]);
                this.ship.addComponent('Invincible').invincibleDuration(-1);
                this.attr({
                    x: -Crafty.viewport.x - 100,
                    y: -Crafty.viewport.y + (Crafty.viewport.height * .5)
                });
                this.circlePos = 180;
                this.eaten = 0;
                this.hFlash = 0;
                this.shooting = 0;
                this.ship.bind('Remove', (function (_this) {
                    return function () {
                        return _this.destroy();
                    };
                })(this));
                this.bind('GameLoop', this._move);
                return this.onHit('Hostile', (function (_this) {
                    return function (collision) {
                        var e, enemy, i, ids, j, len, newCols, ref, results;
                        if (Game.paused) {
                            return;
                        }
                        ids = (function () {
                            var j, len, results;
                            results = [];
                            for (j = 0, len = collision.length; j < len; j++) {
                                e = collision[j];
                                results.push(e.obj[0]);
                            }
                            return results;
                        })();
                        if (_this.previousCols == null) {
                            _this.previousCols = [];
                        }
                        newCols = (function () {
                            var j, len, results;
                            results = [];
                            for (j = 0, len = ids.length; j < len; j++) {
                                i = ids[j];
                                if (indexOf.call(this.previousCols, i) < 0) {
                                    results.push(i);
                                }
                            }
                            return results;
                        }).call(_this);
                        _this.previousCols = ids;
                        results = [];
                        for (j = 0, len = collision.length; j < len; j++) {
                            e = collision[j];
                            if (!(ref = e.obj[0], indexOf.call(newCols, ref) >= 0)) {
                                continue;
                            }
                            enemy = e.obj;
                            if (enemy.hidden) {
                                continue;
                            }
                            if (enemy.invincible) {
                                continue;
                            }
                            _this.attr({
                                hitFlash: {
                                    _red: 255,
                                    _green: 255,
                                    _blue: 0
                                }
                            });
                            _this.hFlash = 5;
                            if (enemy.absorbDamage != null) {
                                enemy.absorbDamage(500);
                            }
                            if (enemy.has('Projectile')) {
                                enemy.destroy();
                            }
                            _this.eaten += 1;
                            results.push(_this.scale = Math.min(.5 + ((.5 / 50) * _this.eaten), 1.0));
                        }
                        return results;
                    };
                })(this), (function (_this) {
                    return function () {
                        return _this.previousCols = [];
                    };
                })(this));
            },
            _move: function (fd) {
                var angle, circleSpeed, dist, j, rad, rot, rx, ry, speed, targetX, targetY;
                circleSpeed = 8000;
                speed = this.ship._targetSpeed.x + 300;
                rx = 80;
                ry = 55;
                circleSpeed -= Math.min(Crafty('Enemy').length * 800, circleSpeed - 1000);
                rot = (360 / circleSpeed) * fd.dt;
                this.circlePos = (this.circlePos + rot + 360) % 360;
                rad = this.circlePos * 0.0174532925;
                targetX = this.ship.x + 10 + (Math.floor(this.ship.w / 2)) - (Math.floor(this.w / 2)) + (rx * Math.cos(rad));
                targetY = this.ship.y + (Math.floor(this.ship.h / 2)) - (Math.floor(this.h / 2)) + (ry * Math.sin(rad));
                dist = speed * (fd.dt / 1000);
                if (this.hFlash > 0) {
                    this.hFlash -= 1;
                    if (this.hFlash === 0) {
                        this.attr({
                            hitFlash: false
                        });
                    }
                }
                if (this.eaten > 50 && Crafty('Enemy').length > 0) {
                    this.shooting += 1;
                    if (this.shooting % 5 === 0) {
                        for (angle = j = 0; j < 360; angle = j += 30) {
                            Crafty.e('Bullet').attr({
                                w: 8,
                                h: 8,
                                x: this.x + (Math.floor(this.w / 2)),
                                y: this.y + (Math.floor(this.h / 2)),
                                z: 1,
                                rotation: angle
                            }).fire({
                                origin: this,
                                speed: this.ship._currentSpeed.x + 400,
                                damage: 400,
                                direction: angle
                            });
                        }
                    }
                    if (this.shooting > 200) {
                        this.eaten = 0;
                        this.scale = .5;
                        this.shooting = 0;
                    }
                }
                if (this.x > targetX) {
                    this.x -= Math.min(dist, this.x - targetX);
                } else {
                    this.x += Math.min(dist, targetX - this.x);
                }
                if (this.y > targetY) {
                    return this.y -= Math.min(dist, this.y - targetY);
                } else {
                    return this.y += Math.min(dist, targetY - this.y);
                }
            }
        });
    });