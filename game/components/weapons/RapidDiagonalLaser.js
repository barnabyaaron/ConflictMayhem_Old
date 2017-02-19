define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('RapidDiagonalLaser', {
            init: function () {
                this.requires('2D,WebGL,Color');
                this.color('#d08080');
                this.attr({
                    w: 30,
                    h: 5
                });
                this.xp = 0;
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
                this.level = this.determineLevel(this.xp);
                this.attr({
                    x: this.ship.x + 20,
                    y: this.ship.y + 30,
                    z: this.ship.z + 1,
                    alpha: 0
                });
                this.ship.attach(this);
                this.shooting = false;
                this._determineCooldown();
                return this.bind('GameLoop', this._autoFire);
            },
            uninstall: function () {
                this.attr({
                    alpha: 0
                });
                return this.unbind('GameLoop', this._autoFire);
            },
            addXP: function (amount) {
                var level;
                this.xp += amount;
                level = this.level;
                this.level = this.determineLevel(this.xp);
                if (level !== this.level) {
                    this._determineCooldown();
                    return this.trigger('levelUp', this.level);
                }
            },
            _determineCooldown: function () {
                return this.cooldown = (function () {
                    switch (this.level) {
                        case 0:
                            return 200;
                        case 1:
                            return 150;
                        case 2:
                            return 75;
                        case 3:
                            return 75;
                    }
                }).call(this);
            },
            determineLevel: function (xp) {
                var i, j, len, level, levelBoundaries, neededXP, progress, ref;
                levelBoundaries = [1500, 6000, 24000, 96000];
                neededXP = 0;
                level = 0;
                for (j = 0, len = levelBoundaries.length; j < len; j++) {
                    i = levelBoundaries[j];
                    neededXP += i;
                    if (xp >= neededXP) {
                        level += 1;
                    }
                }
                progress = (xp - ((ref = levelBoundaries[level - 1]) != null ? ref : 0)) / levelBoundaries[level];
                return level;
            },
            shoot: function (onOff) {
                if (onOff) {
                    return this.shooting = true;
                } else {
                    this.shooting = false;
                    this.shotsFired = 0;
                    return this.lastShot = 500;
                }
            },
            _autoFire: function (fd) {
                var allowBullet, angle, deviation, f;
                this.lastShot += fd.dt;
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
                    angle = (function () {
                        switch (this.level) {
                            case 0:
                                return 5;
                            case 1:
                                return 7;
                            case 2:
                                return 12;
                            case 3:
                                return 12;
                        }
                    }).call(this);
                    f = (this.shotsFired % 2) === 0 ? 1 : -1;
                    deviation = Math.random() * 1.5;
                    this._createAngleBullet(0 + (deviation * f));
                    deviation = Math.random() * 1.5;
                    this._createAngleBullet(angle + (deviation * f));
                    deviation = Math.random() * 1.5;
                    this._createAngleBullet(-angle + (deviation * f));
                    Crafty.audio.play('shoot', 1, .10);
                    this.frontFire = !this.frontFire;
                    this.lastShot = 0;
                    return this.shotsFired += 1;
                }
            },
            _createAngleBullet: function (angle) {
                var settings;
                settings = (function () {
                    switch (this.level) {
                        case 0:
                            return {
                                w: 5,
                                speed: 550,
                                h: 5
                            };
                        case 1:
                            return {
                                w: 6,
                                speed: 555,
                                h: 5
                            };
                        case 2:
                            return {
                                w: 8,
                                speed: 560,
                                h: 5
                            };
                        case 3:
                            return {
                                w: 10,
                                speed: 565,
                                h: 5
                            };
                    }
                }).call(this);
                return Crafty.e('Bullet').attr({
                    x: this.x + this.w,
                    y: this.y + (this.h / 2) - (settings.h / 2) + 1,
                    w: settings.w,
                    h: settings.h,
                    rotation: angle
                }).fire({
                    origin: this,
                    damage: 100,
                    speed: this.ship._currentSpeed.x + settings.speed,
                    direction: angle
                }).bind('HitTarget', (function (_this) {
                    return function (target) {
                        _this.addXP(1);
                        return _this.ship.trigger('BulletHit', target);
                    };
                })(this)).bind('DestroyTarget', (function (_this) {
                    return function (target) {
                        _this.addXP(5);
                        return _this.ship.trigger('BulletDestroyedTarget', target);
                    };
                })(this));
            }
        });
    });