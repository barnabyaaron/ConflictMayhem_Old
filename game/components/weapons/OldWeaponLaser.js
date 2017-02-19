define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('OldWeaponLaser', {
            init: function () {
                this.requires('2D,WebGL,Color');
                this.color('#808080');
                return this.attr({
                    w: 30,
                    h: 5
                });
            },
            remove: function () { },
            install: function (ship) {
                this.ship = ship;
                this.xp = 0;
                this.level = this.determineLevel(this.xp);
                this.attr({
                    x: this.ship.x + 10,
                    y: this.ship.y + 15,
                    z: this.ship.z + 1,
                    alpha: 0
                });
                return this.ship.attach(this);
            },
            uninstall: function () {
                return this.attr({
                    alpha: 0
                });
            },
            addXP: function (amount) {
                var level;
                this.xp += amount;
                level = this.level;
                this.level = this.determineLevel(this.xp);
                if (level !== this.level) {
                    return this.trigger('levelUp', this.level);
                }
            },
            determineLevel: function (xp) {
                var i, j, len, level, levelBoundaries, neededXP, progress, ref;
                levelBoundaries = [1000, 3000, 12000, 96000];
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
                var settings;
                if (!onOff) {
                    return;
                }
                settings = (function () {
                    switch (this.level) {
                        case 0:
                            return {
                                w: 4,
                                speed: 270,
                                h: 4
                            };
                        case 1:
                            return {
                                w: 8,
                                speed: 320,
                                h: 6
                            };
                        case 2:
                            return {
                                w: 8,
                                speed: 320,
                                h: 6
                            };
                        case 3:
                            return {
                                w: 8,
                                speed: 320,
                                h: 6
                            };
                        case 4:
                            return {
                                w: 10,
                                speed: 320,
                                h: 6
                            };
                    }
                }).call(this);
                return Crafty.e('Bullet').attr({
                    x: this.x + this.w,
                    y: this.y + (this.h / 2) - (settings.h / 2),
                    w: settings.w,
                    h: settings.h
                }).fire({
                    origin: this,
                    damage: 100,
                    speed: this.ship._currentSpeed.x + settings.speed,
                    direction: 0
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
            },
            _determineWeaponSettings: function () { }
        });
    });