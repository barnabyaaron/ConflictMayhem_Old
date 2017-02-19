define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function (_, Crafty, Game) {
        Crafty.c('PlayerSpaceship', {
            init: function () {
                this.requires('2D, WebGL, playerShip, ColorEffects, Listener, Collision, SunBlock, ' + 'WaterSplashes, PlayerControlledShip, Acceleration, InventoryWeapons');
                this.attr({
                    w: 71,
                    h: 45
                });
                this.collision([21, 13, 56, 13, 66, 32, 35, 32]);
                this.bind('Moved', function (from) {
                    var setBack;
                    if (this.hit('Edge') || this.hit('Solid')) {
                        setBack = {};
                        setBack[from.axis] = from.oldValue;
                        return this.attr(setBack);
                    }
                });
                this.primaryWeapon = void 0;
                this.primaryWeapons = [];
                this.secondaryWeapon = void 0;
                this.superUsed = 0;
                this.weaponsEnabled = true;
                this.currentRenderedSpeed = 0;
                return this.flip('X');
            },
            updateMovementVisuals: function (rotation, dx, dy, dt) {
                var velocity;
                velocity = Math.max(dx * (1000 / dt), 0);
                return this._updateFlyingSpeed(velocity, dt);
            },
            _updateFlyingSpeed: function (newSpeed, dt) {
                var correction, h, w;
                if (newSpeed < 30) {
                    correction = newSpeed / 2;
                } else {
                    correction = 15 + ((newSpeed / 400) * 100);
                }
                if (this.currentRenderedSpeed > correction) {
                    this.currentRenderedSpeed -= 6;
                } else if (this.currentRenderedSpeed < correction) {
                    this.currentRenderedSpeed += 6;
                }
                if (this.currentRenderedSpeed < 0) {
                    this.currentRenderedSpeed = 0;
                }
                w = 10 + this.currentRenderedSpeed;
                h = Math.min(w / 3, 15);
                return this.backFire.attr({
                    x: this.x - w + 9,
                    y: this.y + 20 - (Math.floor(h / 2)),
                    w: w,
                    h: h
                });
            },
            start: function () {
                var basicC, c, comp, h, j, len, newC, ref, w;
                this.backFire = Crafty.e('2D, WebGL, shipEngineFire, ColorEffects').crop(28, 0, 68, 29);
                this.backFire.timing = 0;
                w = 68;
                h = 10;
                this.backFire.attr({
                    x: this.x - w,
                    y: this.y + 20 - (Math.floor(h / 2)),
                    w: w,
                    h: h,
                    alpha: .8,
                    z: this.z - 1
                });
                this.attach(this.backFire);
                c = {};
                basicC = {
                    _red: 255,
                    _green: 255,
                    _blue: 255
                };
                Crafty.assignColor(this.playerColor, c);
                ref = ['_red', '_green', '_blue'];
                for (j = 0, len = ref.length; j < len; j++) {
                    comp = ref[j];
                    newC = (c[comp] + basicC[comp] + basicC[comp]) / 3;
                    c[comp] = newC;
                }
                this.backFire.colorOverride(c);
                this.addComponent('Invincible').invincibleDuration(2000);
                this.setDetectionOffset(40, 0);
                this.onHit('Hostile', function (collision) {
                    var e, hit, k, len1;
                    if (Game.paused) {
                        return;
                    }
                    if (this.has('Invincible')) {
                        return;
                    }
                    hit = false;
                    for (k = 0, len1 = collision.length; k < len1; k++) {
                        e = collision[k];
                        if (!e.obj.hidden) {
                            hit = true;
                        }
                    }
                    if (hit) {
                        return this.trigger('Hit');
                    }
                });
                this.onHit('PowerUp', function (e) {
                    var k, len1, pu, results;
                    if (Game.paused) {
                        return;
                    }
                    results = [];
                    for (k = 0, len1 = e.length; k < len1; k++) {
                        pu = e[k];
                        if (!pu.obj.pickedUp) {
                            results.push(this.pickUp(pu.obj));
                        } else {
                            results.push(void 0);
                        }
                    }
                    return results;
                });
                this.bind('Hit', function () {
                    Crafty.e('Blast, Explosion').explode({
                        x: this.x + (this.w / 2),
                        y: this.y + (this.h / 2),
                        radius: this.w
                    });
                    Crafty.audio.play("explosion");
                    Crafty('ScrollBackground').get(0).screenShake(10, 1000);
                    return this.trigger('Destroyed', this);
                });
                this.bind('GameLoop', function (fd) {
                    var motionX, motionY, newR, nr, r, ref1, shipSpeedX, shipSpeedY;
                    if (this.has('AnimationMode')) {
                        if (((ref1 = this._choreography) != null ? ref1.length : void 0) === 0) {
                            this._updateFlyingSpeed(this._currentSpeed.x, fd.dt);
                        }
                        return;
                    }
                    motionX = (this._currentSpeed.x / 1000.0) * fd.dt;
                    motionY = (this._currentSpeed.y / 1000.0) * fd.dt;
                    shipSpeedX = this._currentSpeed.x + this.vx;
                    shipSpeedY = this._currentSpeed.y + this.vy;
                    this.updateAcceleration();
                    r = this.rotation;
                    newR = shipSpeedY / 40;
                    nr = r;
                    if (r < newR) {
                        nr += 1;
                    } else if (r > newR) {
                        nr -= 1;
                    }
                    this.rotation = nr;
                    if (this.hit('Edge') || this.hit('Solid')) {
                        nr = r;
                    }
                    this.rotation = 0;
                    this._updateFlyingSpeed(shipSpeedX, fd.dt);
                    this.rotation = nr;
                    this.x += motionX;
                    this.y += motionY;
                    if (this.hit('Edge') || this.hit('Solid')) {
                        this.x -= motionX;
                        this.y -= motionY;
                    }
                    if (this.hit('Edge') || this.hit('Solid')) {
                        return this.trigger('Hit');
                    }
                });
                return this;
            },
            forcedSpeed: function (speed, options) {
                if (options == null) {
                    options = {};
                }
                return this.targetSpeed(speed, options);
            },
            shoot: function (onOff) {
                if (!this.weaponsEnabled) {
                    return;
                }
                if (this.primaryWeapon != null) {
                    this.primaryWeapon.shoot(onOff);
                }
                if (this.secondaryWeapon != null) {
                    return this.secondaryWeapon.shoot(onOff);
                }
            },
            switchWeapon: function (onOff) {
                var nextWeapon, ref;
                if (!onOff) {
                    return;
                }
                nextWeapon = (this.currentPrimary + 1) % this.primaryWeapons.length;
                if ((ref = this.primaryWeapon) != null) {
                    ref.uninstall();
                }
                this.primaryWeapon = this.primaryWeapons[nextWeapon];
                this.primaryWeapon.install(this);
                return this.currentPrimary = nextWeapon;
            },
            superWeapon: function (onOff) {
                if (!onOff) {
                    return;
                }
                return this.superUsed += 1;
            },
            pickUp: function (powerUp) {
                var contents;
                contents = powerUp.settings.contains;
                if (this.installItem(powerUp.settings)) {
                    Crafty.audio.play('powerup');
                    this.trigger('PowerUp', powerUp.settings);
                    return powerUp.pickup();
                }
            },
            clearItems: function () {
                var j, len, ref, ref1, w;
                if ((ref = this.primaryWeapon) != null) {
                    ref.uninstall();
                }
                ref1 = this.primaryWeapons;
                for (j = 0, len = ref1.length; j < len; j++) {
                    w = ref1[j];
                    w.destroy();
                }
                this.primaryWeapons = [];
                return this.items = [];
            },
            _installPrimary: function (componentName) {
                var ref, weapon;
                weapon = Crafty.e(componentName);
                weapon.install(this);
                if ((ref = this.primaryWeapon) != null) {
                    ref.uninstall();
                }
                this.primaryWeapon = weapon;
                this.listenTo(weapon, 'levelUp', (function (_this) {
                    return function (info) {
                        var t;
                        t = {
                            damage: 'Damage',
                            rapid: 'RapidFire',
                            aim: 'AimAssist',
                            speed: 'BulletSpeed'
                        };
                        return _this.scoreText(t[info.aspect] + " +" + info.level);
                    };
                })(this));
                this.listenTo(weapon, 'boost', (function (_this) {
                    return function (info) {
                        var t;
                        t = {
                            damageb: 'Damage',
                            rapidb: 'RapidFire',
                            aimb: 'AimAssist',
                            speedb: 'BulletSpeed'
                        };
                        return _this.scoreText(t[info.aspect] + " Boost!");
                    };
                })(this));
                this.listenTo(weapon, 'boostExpired', (function (_this) {
                    return function (info) {
                        var t;
                        t = {
                            damageb: 'Damage',
                            rapidb: 'RapidFire',
                            aimb: 'AimAssist',
                            speedb: 'BulletSpeed'
                        };
                        return _this.scoreText(t[info.aspect] + " Boost expired", {
                            positive: false
                        });
                    };
                })(this));
                this.primaryWeapons.push(weapon);
                return this.currentPrimary = this.primaryWeapons.length - 1;
            },
            hasItem: function (item) {
                var i, j, len, ref;
                if (this.items == null) {
                    this.items = [];
                }
                ref = this.items;
                for (j = 0, len = ref.length; j < len; j++) {
                    i = ref[j];
                    if (i.contains === item) {
                        return true;
                    }
                }
                return false;
            },
            scoreText: function (text, settings) {
                var location, t;
                if (settings == null) {
                    settings = {};
                }
                settings = _.defaults(settings, {
                    positive: true,
                    location: {
                        x: this.x,
                        y: this.y
                    },
                    attach: true,
                    duration: 1000,
                    distance: 70,
                    delay: 400
                });
                location = typeof settings.location === "function" ? settings.location() : void 0;
                if (location) {
                    location = {
                        x: location.x - Crafty.viewport.x,
                        y: location.y - Crafty.viewport.y
                    };
                }
                if (location == null) {
                    location = settings.location;
                }
                t = Crafty.e('Text, DOM, 2D, Tween, Delay').textColor(settings.positive ? '#DDD' : '#F00').text(text).attr({
                    x: location.x,
                    y: location.y - 10,
                    z: 990,
                    w: 250,
                    alpha: .75
                }).textFont({
                    size: '10px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                if (settings.attach) {
                    this.attach(t);
                } else {
                    t.addComponent('ViewportFixed');
                }
                return t.delay((function (_this) {
                    return function () {
                        if (settings.attach) {
                            _this.detach(t);
                        }
                        t.tween({
                            rotation: 0,
                            y: t.y - settings.distance,
                            alpha: 0.5
                        }, settings.duration, 'easeInQuad');
                        return t.one('TweenEnd', function () {
                            return t.destroy();
                        });
                    };
                })(this), settings.delay);
            }
        });
    });