define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('RapidWeaponLaser', {
            init: function () {
                this.requires('2D,WebGL,muzzleFlash');
                this.attr({
                    w: 30,
                    h: 16
                });
                this.stats = {
                    rapid: 0,
                    damage: 0,
                    aim: 0,
                    speed: 0
                };
                this.boosts = {};
                this.boostTimings = {};
                this.lastShot = 0;
                this.shotsFired = 0;
                this.burstCount = Infinity;
                return this.frontFire = true;
            },
            remove: function () {
                return this.unbind('GameLoop', this._autoFire);
            },
            install: function (ship) {
                this.ship = ship;
                this.attr({
                    x: this.ship.x + 38,
                    y: this.ship.y + 22,
                    z: this.ship.z + 1,
                    alpha: 0
                });
                this.ship.attach(this);
                this.shooting = false;
                this._determineWeaponSettings();
                return this.bind('GameLoop', this._autoFire);
            },
            uninstall: function () {
                this.attr({
                    alpha: 0
                });
                return this.unbind('GameLoop', this._autoFire);
            },
            upgrade: function (aspect) {
                this.stats[aspect] += 1;
                this._determineWeaponSettings();
                return this.trigger('levelUp', {
                    aspect: aspect,
                    level: this.stats[aspect]
                });
            },
            boost: function (aspect) {
                this.boosts[aspect] = 10;
                this.boostTimings[aspect] = 15 * 1000;
                this._determineWeaponSettings();
                return this.trigger('boost', {
                    aspect: aspect
                });
            },
            _determineWeaponSettings: function () {
                var k, levels, value;
                this.cooldown = 175 - ((this.boosts.rapidb || this.stats.rapid) * 10);
                this.damage = 100 + ((this.boosts.damageb || this.stats.damage) * 50);
                this.aimAngle = 0 + ((this.boosts.aimb || this.stats.aim) * 6);
                this.aimDistance = Math.min(40 + ((this.boosts.aimb || this.stats.aim) * 50), 500);
                this.speed = 650 + ((this.boosts.speedb || this.stats.speed) * 70);
                levels = (function () {
                    var ref, results;
                    ref = this.stats;
                    results = [];
                    for (k in ref) {
                        value = ref[k];
                        if (k !== 'damage') {
                            results.push(value);
                        }
                    }
                    return results;
                }).call(this);
                return this.overallLevel = Math.min.apply(Math, levels);
            },
            shoot: function (onOff) {
                if (onOff) {
                    this.shooting = true;
                    return this.attr({
                        alpha: 0
                    });
                } else {
                    this.shooting = false;
                    this._clearPicked();
                    this.shotsFired = 0;
                    return this.lastShot = 500;
                }
            },
            _autoFire: function (fd) {
                var allowBullet, k, ref, v;
                this.lastShot += fd.dt;
                ref = this.boostTimings;
                for (k in ref) {
                    v = ref[k];
                    this.boostTimings[k] -= fd.dt;
                    if (v < 0) {
                        delete this.boostTimings[k];
                        delete this.boosts[k];
                        this._determineWeaponSettings();
                        this.trigger('boostExpired', {
                            aspect: k
                        });
                    }
                }
                if (this.lastShot >= 60) {
                    this.attr({
                        alpha: 0
                    });
                }
                if (!this.shooting) {
                    return;
                }
                allowBullet = this.shotsFired < this.burstCount;
                if (!this.ship.weaponsEnabled) {
                    return;
                }
                if (!allowBullet) {
                    return;
                }
                if (this.lastShot > this.cooldown) {
                    if (this.frontFire) {
                        this._createFrontBullet();
                        this.attr({
                            alpha: 1
                        });
                    } else {
                        this._createBackBullet();
                    }
                    Crafty.audio.play('shoot', 1, .05);
                    this.frontFire = !this.frontFire;
                    this.lastShot = 0;
                    return this.shotsFired += 1;
                }
            },
            _createFrontBullet: function () {
                var settings, start;
                settings = {
                    w: Math.floor(this.speed / 25),
                    speed: this.speed,
                    h: 8 + this.overallLevel,
                    o: this.overallLevel
                };
                start = {
                    x: this.x + this.w,
                    y: this.y + (this.h / 2) - (settings.h / 2) + 1 + settings.o
                };
                return Crafty.e('Bullet').attr({
                    w: settings.w,
                    h: settings.h,
                    x: start.x,
                    y: start.y,
                    z: 1
                }).fire({
                    ship: this.ship,
                    damage: this.damage,
                    speed: this.ship._currentSpeed.x + settings.speed,
                    direction: this._bulletDirection(start)
                });
            },
            _createBackBullet: function () {
                var settings, start;
                settings = {
                    w: Math.floor(this.speed / 35),
                    speed: this.speed,
                    h: 7 + this.overallLevel,
                    o: this.overallLevel
                };
                start = {
                    x: this.x + this.w,
                    y: this.y + (this.h / 2) - (settings.h / 2) - 2 - settings.o
                };
                return Crafty.e('Bullet').attr({
                    w: settings.w,
                    h: settings.h,
                    x: start.x,
                    y: start.y,
                    z: -1
                }).fire({
                    ship: this.ship,
                    damage: this.damage,
                    speed: this.ship._currentSpeed.x + settings.speed,
                    direction: this._bulletDirection(start)
                });
            },
            _bulletDirection: function (start) {
                var adjust, angle, dist, distance, projected, target, time;
                target = this._targetEnemy(start);
                if (!target) {
                    this._clearPicked();
                    this.currentShot = 0;
                    return 0;
                }
                distance = Math.sqrt(Math.pow(Math.abs(start.x - target.x), 2) + Math.pow(Math.abs(start.y - target.y), 2));
                time = distance / (this.speed + this.ship._currentSpeed.x);
                projected = {
                    x: target.x + (Math.floor(target.w / 2)) + (target.vx * time),
                    y: target.y + (Math.floor(target.h / 2)) + (target.vy * time)
                };
                angle = Math.atan2(projected.y - start.y, projected.x - start.x);
                angle *= 180 / Math.PI;
                if (!((-this.aimAngle < angle && angle < this.aimAngle))) {
                    this._clearPicked();
                    this.currentShot = 0;
                    return 0;
                }
                if (this.currentShot == null) {
                    this.currentShot = 0;
                }
                dist = Math.abs(this.currentShot - angle);
                adjust = 2;
                if (dist > 10) {
                    adjust = 4;
                }
                if (dist > 15) {
                    adjust = 8;
                }
                if (dist > 40) {
                    adjust = 25;
                }
                if (dist > 90) {
                    adjust = 50;
                }
                if (this.currentShot < angle) {
                    this.currentShot += adjust;
                } else {
                    this.currentShot -= adjust;
                }
                return this.currentShot;
            },
            _targetEnemy: function (start) {
                var angle, distance, i, item, len, list, pickedDistance;
                if (this.pickedEntity) {
                    return this.pickedEntity;
                }
                list = [];
                Crafty('Enemy').each(function () {
                    if (!this.hidden) {
                        return list.push({
                            x: this.x,
                            y: this.y + (this.h / 2),
                            e: this
                        });
                    }
                });
                this.pickedEntity = null;
                pickedDistance = Infinity;
                for (i = 0, len = list.length; i < len; i++) {
                    item = list[i];
                    angle = Math.atan2(item.y - start.y, item.x - start.x);
                    angle *= 180 / Math.PI;
                    distance = Math.abs(start.x - item.x) + Math.abs(start.y - item.y);
                    if ((-this.aimAngle < angle && angle < this.aimAngle)) {
                        if (distance < pickedDistance) {
                            pickedDistance = distance;
                            this.pickedEntity = item.e;
                        }
                    }
                }
                if (this.pickedEntity) {
                    this.pickedEntity.one('Remove', (function (_this) {
                        return function () {
                            return _this._clearPicked();
                        };
                    })(this));
                    this.pickedEntity.one('Hiding', (function (_this) {
                        return function () {
                            return _this._clearPicked();
                        };
                    })(this));
                }
                return this.pickedEntity;
            },
            _clearPicked: function () {
                if (this.pickedEntity) {
                    this.pickedEntity.unbind('Remove', this._clearPicked);
                    this.pickedEntity.unbind('Hiding', this._clearPicked);
                }
                return this.pickedEntity = null;
            }
        });
    });