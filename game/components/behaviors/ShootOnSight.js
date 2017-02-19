define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('ShootOnSight',
        {
            init: function() {
                return this.requires('Delay');
            },
            remove: function() {
                return this.unbind('GameLoop', this._checkForShot);
            },
            shootOnSight: function(options) {
                var ref, ref1, ref2, wo;
                this.shootConfig = _.defaults(options, {
                    targetType: 'PlayerControlledShip',
                    sightAngle: 10,
                    shootWhenHidden: false,
                    cooldown: 800
                });
                wo = (ref = this.weaponOrigin) != null ? ref : [0, 0];
                wo[0] *= (ref1 = this.scale) != null ? ref1 : 1;
                wo[1] *= (ref2 = this.scale) != null ? ref2 : 1;
                if (this.muzzleFlash == null) {
                    this.muzzleFlash = Crafty.e('Sphere').attr({
                        x: this.x + wo[0],
                        y: this.y + wo[1],
                        alpha: 0
                    }).muzzle();
                    this.attach(this.muzzleFlash);
                }
                this.muzzleFlash.attr({
                    alpha: 0
                });
                this.lastShotAt = 0;
                this.bind('GameLoop', this._checkForShot);
                return this.bind('Revealing', (function (_this) {
                    return function () {
                        return _this.muzzleFlash.attr({
                            alpha: 0
                        });
                    };
                })(this));
            },
            _checkForShot: function(fd) {
                var self, target, targets;
                if (this.shooting) {
                    return;
                }
                if (this.lastShotAt != null) {
                    this.lastShotAt += fd.dt;
                    if (this.lastShotAt < this.shootConfig.cooldown) {
                        return;
                    }
                }
                self = this;
                targets = [];
                Crafty(this.shootConfig.targetType).each(function () {
                    var angle;
                    angle = self._determineAngle(this);
                    if (Math.abs(angle - self.rotation) < self.shootConfig.sightAngle) {
                        return targets.push(this);
                    }
                });
                if (targets.length > 0) {
                    target = _.sample(targets);
                    return this._shoot(target);
                }
            },
            _determineAngle: function(entity) {
                var angle;
                angle = Math.atan2(this.y - entity.y, this.x - entity.x);
                angle *= 180 / Math.PI;
                if (this.xFlipped) {
                    angle += 180;
                }
                return (angle + 360) % 360;
            },
            _shoot: function(target) {
                if (this.hidden && !this.shootConfig.shootWhenHidden) {
                    return;
                }
                this.shooting = true;
                this.muzzleFlash.attr({
                    alpha: 1
                });
                return this.delay((function (_this) {
                    return function () {
                        var angle, ref, ref1, ref2, wo;
                        _this.lastShotAt = 0;
                        wo = (ref = _this.weaponOrigin) != null ? ref : [0, 0];
                        wo[0] *= (ref1 = _this.scale) != null ? ref1 : 1;
                        wo[1] *= (ref2 = _this.scale) != null ? ref2 : 1;
                        angle = _this._determineAngle(target);
                        if (_this.xFlipped) {
                            angle += 180;
                        }
                        angle = (angle + 360) % 360;
                        _this.shootConfig.projectile(wo[0] + _this.x, wo[1] + _this.y, angle);
                        _this.muzzleFlash.attr({
                            alpha: 0
                        });
                        return _this.shooting = false;
                    };
                })(this), 300);
            }
        });
    });