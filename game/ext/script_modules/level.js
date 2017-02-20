var Game,
  slice = [].slice;

Game = this.Game;

if (Game.ScriptModule == null) {
    Game.ScriptModule = {};
}

Game.ScriptModule.Level = {
    placeSquad: function (scriptClass, settings) {
        if (settings == null) {
            settings = {};
        }
        return (function (_this) {
            return function (sequence) {
                var i, loadingAssets, options, ref, scripts, synchronizer;
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                synchronizer = new Game.Synchronizer;
                settings = _.clone(settings);
                options = _.defaults({
                    synchronizer: synchronizer
                }, settings.options);
                settings = _.defaults({}, settings, {
                    amount: 1,
                    delay: 1000
                });
                if (options.gridConfig != null) {
                    options.grid = new Game.LocationGrid(options.gridConfig);
                }
                settings.options = options;
                scripts = (function () {
                    var j, ref, results1;
                    results1 = [];
                    for (i = j = 0, ref = settings.amount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                        results1.push(synchronizer.registerEntity(new scriptClass(this.level)));
                    }
                    return results1;
                }).call(_this);
                loadingAssets = WhenJS(true);
                if (((ref = scripts[0]) != null ? ref.assets : void 0) != null) {
                    loadingAssets = scripts[0].assets(_.clone(settings.options))(sequence);
                }
                return loadingAssets.then(function () {
                    var promises, script;
                    promises = (function () {
                        var j, len, results1;
                        results1 = [];
                        for (i = j = 0, len = scripts.length; j < len; i = ++j) {
                            script = scripts[i];
                            results1.push((function (_this) {
                                return function (script, i) {
                                    return _this.wait(i * settings.delay)(sequence).then(function () {
                                        var s;
                                        _this._verify(sequence);
                                        s = _.clone(settings.options);
                                        s.index = i;
                                        return script.run(s);
                                    });
                                };
                            })(this)(script, i));
                        }
                        return results1;
                    }).call(_this);
                    return WhenJS.all(promises).then(function (results) {
                        var alive, allKilled, j, killedAt, lastKilled, lastLocation, len, location, ref1;
                        _this.attackWaveResults = (_this.attackWaveResults || []).concat(results);
                        allKilled = true;
                        lastLocation = null;
                        lastKilled = null;
                        for (j = 0, len = results.length; j < len; j++) {
                            ref1 = results[j], alive = ref1.alive, killedAt = ref1.killedAt, location = ref1.location;
                            if (alive) {
                                allKilled = false;
                            } else {
                                if (lastKilled == null) {
                                    lastKilled = killedAt;
                                }
                                if (lastLocation == null) {
                                    lastLocation = location;
                                }
                                if (killedAt.getTime() > lastKilled.getTime()) {
                                    lastKilled = killedAt;
                                    lastLocation = location;
                                }
                            }
                        }
                        if (allKilled && lastLocation) {
                            lastLocation.x -= Crafty.viewport.x;
                            lastLocation.y -= Crafty.viewport.y;
                            if (settings.drop) {
                                return _this.drop({
                                    item: settings.drop,
                                    location: lastLocation
                                })(sequence);
                            }
                        }
                    });
                });
            };
        })(this);
    },
    attackWaves: function (promise, settings) {
        if (settings == null) {
            settings = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                _this.attackWaveResults = [];
                return promise(sequence).then(function () {
                    var alive, allKilled, j, killedAt, lastKilled, lastLocation, len, location, ref, ref1;
                    allKilled = true;
                    lastLocation = null;
                    lastKilled = null;
                    ref = _this.attackWaveResults;
                    for (j = 0, len = ref.length; j < len; j++) {
                        ref1 = ref[j], alive = ref1.alive, killedAt = ref1.killedAt, location = ref1.location;
                        if (alive) {
                            allKilled = false;
                        } else {
                            if (lastKilled == null) {
                                lastKilled = killedAt;
                            }
                            if (lastLocation == null) {
                                lastLocation = location;
                            }
                            if (killedAt.getTime() > lastKilled.getTime()) {
                                lastKilled = killedAt;
                                lastLocation = location;
                            }
                        }
                    }
                    if (allKilled && lastLocation) {
                        lastLocation.x += Crafty.viewport.x;
                        lastLocation.y += Crafty.viewport.y;
                        if (settings.drop) {
                            return _this.drop({
                                item: settings.drop,
                                location: function () {
                                    return lastLocation;
                                }
                            })(sequence);
                        }
                    }
                });
            };
        })(this);
    },
    say: function (speaker, text, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                if (text == null) {
                    text = speaker;
                    speaker = void 0;
                }
                options = _.defaults(options, {
                    speaker: speaker,
                    noise: 'none',
                    bottom: _this.level.visibleHeight
                });
                return Game.say(speaker, text, options);
            };
        })(this);
    },
    drop: function (options) {
        return (function (_this) {
            return function (sequence) {
                var coords, d, item, itemSettings, player, pos, ship;
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                itemSettings = _this.inventory(options.item);
                item = function () {
                    return Crafty.e('PowerUp').powerUp(itemSettings);
                };
                if (!itemSettings) {
                    console.warn('Item ', options.item, ' is not known');
                    return WhenJS();
                }
                if (player = options.inFrontOf) {
                    ship = player.ship();
                    if (ship) {
                        _this.level.addComponent(item().attr({
                            z: -1
                        }), {
                            x: Crafty.viewport.width,
                            y: player.ship().y + Crafty.viewport.y
                        });
                    } else {
                        if (!player.gameOver) {
                            d = WhenJS.defer();
                            player.entity.one('ShipSpawned', function (ship) {
                                _this.level.addComponent(item().attr({
                                    z: -1
                                }), {
                                    x: Crafty.viewport.width,
                                    y: ship.y + Crafty.viewport.y
                                });
                                return d.resolve();
                            });
                            return d.promise;
                        }
                    }
                }
                if (pos = options.location) {
                    coords = typeof pos === "function" ? pos() : void 0;
                    if (coords) {
                        coords.x -= Crafty.viewport.x;
                        coords.y -= Crafty.viewport.y;
                    } else {
                        coords = pos;
                    }
                    return item().attr({
                        x: coords.x,
                        y: coords.y,
                        z: -1
                    });
                }
            };
        })(this);
    },
    player: function (nr) {
        var active, key, players;
        players = {};
        active = [];
        Crafty('Player').each(function () {
            return players[this.name] = {
                name: this.name,
                entity: this,
                active: false,
                gameOver: false,
                has: function (item) {
                    var ref;
                    return (ref = this.ship()) != null ? ref.hasItem(item) : void 0;
                },
                ship: function () {
                    var _this, ship;
                    _this = this;
                    ship = null;
                    Crafty('Player ControlScheme').each(function () {
                        if (this.name === _this.name) {
                            return ship = this.ship;
                        }
                    });
                    return ship;
                }
            };
        });
        Crafty('Player ControlScheme').each(function () {
            players[this.name].active = true;
            if (this.lives > 0) {
                return active.push(this.name);
            } else {
                players[this.name].active = false;
                return players[this.name].gameOver = true;
            }
        });
        key = nr === 'anyActive' ? _.sample(active) : "Player " + nr;
        return players[key];
    },
    setScenery: function (scenery) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                return _this.level.setScenery(scenery);
            };
        })(this);
    },
    waitForScenery: function (sceneryType, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                var d;
                _this._verify(sequence);
                options = _.defaults(options, {
                    event: 'enter'
                });
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                d = WhenJS.defer();
                _this.level.notifyScenery(options.event, sceneryType, function () {
                    return d.resolve();
                });
                return d.promise;
            };
        })(this);
    },
    gainHeight: function (height, options) {
        return (function (_this) {
            return function (sequence) {
                var currentSpeed, d, duration, level, ref, ref1, speedY;
                _this._verify(sequence);
                d = WhenJS.defer();
                currentSpeed = (ref = (ref1 = _this.level._forcedSpeed) != null ? ref1.x : void 0) != null ? ref : _this.level._forcedSpeed;
                duration = options.duration;
                if (_this._skippingToCheckpoint() || duration === 0) {
                    return _this.level.setHeight(-height);
                } else {
                    speedY = (height / duration) * 1000;
                    _this.level.setForcedSpeed({
                        x: currentSpeed,
                        y: -speedY
                    }, {
                        accellerate: false
                    });
                    level = _this.level;
                    Crafty.e('Delay').delay(function () {
                        level.setForcedSpeed(currentSpeed, {
                            accellerate: false
                        });
                        return d.resolve();
                    }, duration);
                    return d.promise;
                }
            };
        })(this);
    },
    setSpeed: function (speed, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                options = _.defaults(options, {
                    accellerate: true
                });
                return _this.level.setForcedSpeed(speed, options);
            };
        })(this);
    },
    disableWeapons: function () {
        var players;
        players = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return _this.level.setWeaponsEnabled(false, players);
            };
        })(this);
    },
    enableWeapons: function () {
        var players;
        players = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return _this.level.setWeaponsEnabled(true, players);
            };
        })(this);
    },
    blast: function (location, options, frameOptions) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                var e, ref, ref1, x, y;
                _this._verify(sequence);
                ref = location(), x = ref.x, y = ref.y;
                x -= Crafty.viewport.x;
                y -= Crafty.viewport.y;
                options = (ref1 = typeof options === "function" ? options() : void 0) != null ? ref1 : options;
                options = _.defaults({
                    x: x,
                    y: y
                }, options, {
                    damage: 0,
                    radius: 20,
                    duration: 160,
                    z: 5,
                    topDesaturation: 0,
                    bottomDesaturation: 0,
                    lightness: 1.0,
                    alpha: 1.0
                });
                e = Crafty.e('Blast, Explosion').explode(options, frameOptions);
                if (y > _this._getSeaLevel() - 60 && options.lightness === 1.0) {
                    e.addComponent('WaterSplashes');
                    e.attr({
                        waterSplashSpeed: 500,
                        defaultWaterCooldown: 450
                    });
                    e.setDetectionOffset(40, 0);
                    e.setSealevel(_this._getSeaLevel());
                }
                if (options.damage) {
                    e.ship = _this.entity.deathCause;
                    return e.addComponent('Hostile');
                }
            };
        })(this);
    },
    loadAssets: function () {
        var names;
        names = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                return _this.level.loadAssets(names);
            };
        })(this);
    },
    updateTitle: function (text) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return Crafty('LevelTitle').text(text);
            };
        })(this);
    },
    chapterTitle: function (number, text) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                Crafty('LevelTitle').text(number + ": " + text);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                return Crafty.e('BigText').bigText(text, {
                    "super": "Chapter " + number + ":"
                });
            };
        })(this);
    },
    showText: function (text, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                return Crafty.e('BigText').bigText(text, options);
            };
        })(this);
    },
    pickTarget: function (selection) {
        return (function (_this) {
            return function (sequence) {
                var pickTarget, refreshTarget;
                pickTarget = function (selection) {
                    var entities;
                    entities = Crafty(selection);
                    if (entities.length === 0) {
                        return null;
                    }
                    return entities.get(Math.floor(Math.random() * entities.length));
                };
                refreshTarget = function (ship) {
                    _this.target = {
                        x: ship.x,
                        y: ship.y
                    };
                    return Crafty.one('ShipSpawned', function (ship) {
                        _this.target = pickTarget(selection);
                        return _this.target.one('Destroyed', refreshTarget);
                    });
                };
                _this.target = pickTarget(selection);
                if (selection === 'PlayerControlledShip' && _this.target) {
                    return _this.target.one('Destroyed', refreshTarget);
                }
            };
        })(this);
    },
    targetLocation: function (override) {
        if (override == null) {
            override = {};
        }
        return (function (_this) {
            return function () {
                var hasX, hasY, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
                if ((override.x != null) && ((-1 < (ref = override.x) && ref < 2))) {
                    override.x *= Crafty.viewport.width;
                }
                if ((override.y != null) && ((-1 < (ref1 = override.y) && ref1 < 2))) {
                    override.y *= Crafty.viewport.height;
                }
                hasX = override.x || ((ref2 = _this.target) != null ? ref2.x : void 0);
                hasY = override.y || ((ref3 = _this.target) != null ? ref3.y : void 0);
                if (!(hasX && hasY)) {
                    return null;
                }
                return {
                    x: ((ref4 = override.x) != null ? ref4 : _this.target.x + Crafty.viewport.x) + ((ref5 = override.offsetX) != null ? ref5 : 0),
                    y: ((ref6 = override.y) != null ? ref6 : _this.target.y + Crafty.viewport.y) + ((ref7 = override.offsetY) != null ? ref7 : 0)
                };
            };
        })(this);
    },
    changeSeaLevel: function (offsetY) {
        return (function (_this) {
            return function (sequence) {
                var level;
                _this._verify(sequence);
                _this.level.sealevelOffset = offsetY;
                level = _this.level;
                return Crafty('WaterSplashes').each(function () {
                    return this.setSealevel((Crafty.viewport.height - 20) + level.sealevelOffset);
                });
            };
        })(this);
    },
    screenShake: function (amount, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                options = _.defaults(options, {
                    duration: 1000
                });
                _this.level.screenShake(amount, options);
                return _this.wait(options.duration)(sequence);
            };
        })(this);
    },
    screenFlash: function (amount, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                var defer, flasher;
                _this._verify(sequence);
                options = _.defaults(options, {
                    duration: 200,
                    pauses: 400,
                    color: '#FF0000',
                    alpha: 1
                });
                flasher = _this._fader();
                defer = WhenJS.defer();
                flasher.attr({
                    alpha: 0
                }).color(options.color).delay(function () {
                    this.attr({
                        alpha: options.alpha
                    });
                    return this.delay(function () {
                        return this.attr({
                            alpha: 0
                        });
                    }, options.duration);
                }, options.pauses, amount, function () {
                    this.attr({
                        alpha: 0
                    });
                    return defer.resolve();
                });
                return defer.promise;
            };
        })(this);
    },
    moveCamera: function (settings) {
        if (settings == null) {
            settings = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this.level.cameraPan(settings);
                return _this.wait(settings.duration)(sequence);
            };
        })(this);
    },
    setWeapons: function (newWeapons) {
        return (function (_this) {
            return function (sequence) {
                var self;
                _this._verify(sequence);
                self = _this;
                Crafty('PlayerControlledShip').each(function () {
                    var item, itemSettings, j, len, results1;
                    this.clearItems();
                    results1 = [];
                    for (j = 0, len = newWeapons.length; j < len; j++) {
                        item = newWeapons[j];
                        itemSettings = self.inventory(item);
                        results1.push(this.installItem(itemSettings));
                    }
                    return results1;
                });
                return _this.level.setStartWeapons(newWeapons);
            };
        })(this);
    },
    inventory: function (name) {
        if (name === 'pool') {
            Crafty('Player').each(function () {
                if (this.eligibleForExtraLife() && name === 'pool') {
                    name = 'life';
                    return this.rewardExtraLife();
                }
            });
        }
        if (name === 'pool') {
            name = (this.powerupPool || []).pop() || 'points';
        }
        return this.level.inventory(name);
    },
    inventoryAdd: function (type, name, options) {
        return this.level.inventoryAdd(type, name, options);
    },
    setPowerupPool: function () {
        var powerups;
        powerups = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return _this.powerupPool = _.shuffle(powerups);
            };
        })(this);
    },
    hideHud: function (settings) {
        if (settings == null) {
            settings = {};
        }
        settings = _.defaults(settings, {
            visible: false
        });
        return this.toggleHud(settings);
    },
    showHud: function (settings) {
        if (settings == null) {
            settings = {};
        }
        settings = _.defaults(settings, {
            visible: true
        });
        return this.toggleHud(settings);
    },
    toggleHud: function (settings) {
        if (settings == null) {
            settings = {};
        }
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                settings = _.defaults(settings, {
                    duration: 1000
                });
                Crafty('UILayerDOM, UILayerWebGL').each(function () {
                    this.addComponent('Tween');
                    if (this.visible && settings.visible) {
                        return this.tween({
                            alpha: 1.0
                        }, settings.duration);
                    } else {
                        return this.tween({
                            alpha: 0.0
                        }, settings.duration);
                    }
                });
                return _this.wait(settings.duration)(sequence).then(function () {
                    return Crafty('PlayerInfo').each(function () {
                        return this.setVisibility(settings.visible);
                    });
                });
            };
        })(this);
    },
    setShipType: function (newType) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return _this.level.setShipType(newType);
            };
        })(this);
    },
    endGame: function () {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return _this.gotoGameOver = true;
            };
        })(this);
    },
    disableControls: function () {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return Crafty('PlayerControlledShip').each(function () {
                    return this.disableControl();
                });
            };
        })(this);
    },
    screenFadeOut: function () {
        return (function (_this) {
            return function (sequence) {
                var defer, fader;
                _this._verify(sequence);
                fader = _this._fader();
                defer = WhenJS.defer();
                fader.attr({
                    alpha: 0
                }).color('#000000').tween({
                    alpha: 1
                }, 4000).bind('TweenEnd', function () {
                    return defer.resolve();
                });
                return defer.promise;
            };
        })(this);
    },
    screenFadeIn: function () {
        return (function (_this) {
            return function (sequence) {
                var defer, fader;
                _this._verify(sequence);
                fader = _this._fader();
                defer = WhenJS.defer();
                fader.attr({
                    alpha: 1
                }).color('#000000').tween({
                    alpha: 0
                }, 4000).bind('TweenEnd', function () {
                    this.destroy();
                    return defer.resolve();
                });
                return defer.promise;
            };
        })(this);
    },
    cancelBullets: function (selector, validator) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (validator == null) {
                    validator = function (e) {
                        return true;
                    };
                }
                return Crafty(selector).each(function () {
                    if (validator(this)) {
                        return this.destroy();
                    }
                });
            };
        })(this);
    },
    _fader: function () {
        var fader;
        fader = Crafty('ScreenFader').get(0);
        if (fader == null) {
            fader = Crafty.e('2D, UILayerDOM, Color, Tween, ScreenFader, Delay');
        }
        fader.attr({
            x: 0,
            y: 0,
            z: 1000
        }).attr({
            w: Crafty.viewport.width,
            h: Crafty.viewport.height
        });
        return fader;
    }
};