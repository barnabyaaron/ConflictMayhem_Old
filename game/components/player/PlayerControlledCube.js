define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function (_, Crafty, Game) {
        Crafty.c('PlayerControlledCube', {
            init: function () {
                this.requires('2D, WebGL, Color, Listener, Collision, SunBlock, PlayerControlledShip, Acceleration, InventoryWeapons');
                this.attr({
                    w: 40,
                    h: 40
                });
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
                return this.currentRenderedSpeed = 0;
            },
            start: function () {
                this.addComponent('Invincible').invincibleDuration(2000);
                this.onHit('Enemy', function (collision) {
                    var e, hit, i, len;
                    if (Game.paused) {
                        return;
                    }
                    if (this.has('Invincible')) {
                        return;
                    }
                    hit = false;
                    for (i = 0, len = collision.length; i < len; i++) {
                        e = collision[i];
                        if (!e.obj.hidden) {
                            hit = true;
                        }
                    }
                    if (hit) {
                        return this.trigger('Hit');
                    }
                });
                this.onHit('PowerUp', function (e) {
                    var i, len, pu, results;
                    if (Game.paused) {
                        return;
                    }
                    results = [];
                    for (i = 0, len = e.length; i < len; i++) {
                        pu = e[i];
                        this.pickUp(pu.obj);
                        results.push(this.trigger('PowerUp', pu.obj));
                    }
                    return results;
                });
                this.bind('Hit', function () {
                    return this.trigger('Destroyed', this);
                });
                this.bind('GameLoop', function (fd) {
                    var motionX, motionY;
                    motionX = (this._currentSpeed.x / 1000.0) * fd.dt;
                    motionY = (this._currentSpeed.y / 1000.0) * fd.dt;
                    this.updateAcceleration();
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
                    this.trigger('PowerUp', powerUp.settings);
                    return powerUp.pickup();
                }
            },
            clearItems: function () {
                var i, len, ref, ref1, w;
                if ((ref = this.primaryWeapon) != null) {
                    ref.uninstall();
                }
                this.primaryWeapon = null;
                ref1 = this.primaryWeapons;
                for (i = 0, len = ref1.length; i < len; i++) {
                    w = ref1[i];
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
                    return function (level) {
                        return _this.scoreText("L +" + level);
                    };
                })(this));
                this.primaryWeapons.push(weapon);
                return this.currentPrimary = this.primaryWeapons.length - 1;
            },
            hasItem: function (item) {
                if (this.items == null) {
                    this.items = [];
                }
                return ~this.items.indexOf(item);
            },
            scoreText: function (text) {
                return Crafty.e('Text, DOM, 2D, Tween').textColor('#FFFFFF').text(text).attr({
                    x: this.x,
                    y: this.y - 10,
                    z: 990,
                    w: 100
                }).textFont({
                    size: '10px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                }).tween({
                    y: this.y - 40,
                    alpha: 0.5
                }, 1000).one('TweenEnd', function () {
                    return this.destroy();
                });
            }
        });
    });