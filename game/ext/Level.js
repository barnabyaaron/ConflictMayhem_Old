define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
            indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

        return (function() {
            function Level(generator, data) {
                this.generator = generator;
                this.data = data != null ? data : {};
                this._waveTicks = bind(this._waveTicks, this);
                this.blocks = [];
                this.bufferLength = Crafty.viewport.width * 3;
                this.generationPosition = {
                    x: 0,
                    y: 40
                };
                this.sceneryEvents = [];
                this.visibleHeight = Crafty.viewport.height - this.generationPosition.y;
                this.shipType = 'PlayerSpaceship';
                this.namespace = this.data.namespace;
                this.currentScenery = this.data.startScenery;
            }

            Level.prototype.setScenery = function (scenery) {
                return this._loadAssetsForScenery(scenery).then((function (_this) {
                    return function () {
                        _this.currentScenery = scenery;
                        return _this._setupLevelScenery();
                    };
                })(this));
            };

            Level.prototype._loadAssetsForScenery = function (scenery) {
                var blockKlass, blockType;
                blockType = this.namespace + "." + scenery;
                blockKlass = this.generator.buildingBlocks[blockType];
                return blockKlass.prototype.loadAssets().then((function (_this) {
                    return function () {
                        var next, nextLoading, prev;
                        nextLoading = [];
                        if (prev = blockKlass.prototype.autoPrevious) {
                            nextLoading.push(function () {
                                return _this._loadAssetsForScenery(prev);
                            });
                        }
                        if (next = blockKlass.prototype.autoNext) {
                            nextLoading.push(function () {
                                return _this._loadAssetsForScenery(next);
                            });
                        }
                        if (nextLoading.length > 0) {
                            return WhenJS.sequence(nextLoading);
                        }
                    };
                })(this));
            };

            Level.prototype.start = function () {
                this.active = true;
                Crafty.viewport.x = 0;
                Crafty.viewport.y = 0;
                this._controlsEnabled = true;
                this.setForcedSpeed(1);
                this.setWeaponsEnabled(true);
                this._scrollWall = Crafty.e('ScrollWall').attr({
                    x: 0,
                    y: 0
                });
                this._playersActive = false;
                Crafty.bind('EnemySpawned', (function (_this) {
                    return function () {
                        var base;
                        if ((base = _this.data).enemiesSpawned == null) {
                            base.enemiesSpawned = 0;
                        }
                        return _this.data.enemiesSpawned += 1;
                    };
                })(this));
                Crafty.e('2D, UILayerDOM, Text, LevelTitle').attr({
                    w: 250,
                    h: 20
                }).attr({
                    x: Crafty.viewport.width - 250,
                    y: 10,
                    z: 2
                }).textFont({
                    size: '10px',
                    family: 'Press Start 2P'
                }).textColor('#A0A0A0').text('');
                this._setupLevelScenery();
                Crafty.bind('PlayerDied', (function (_this) {
                    return function () {
                        var playersActive;
                        playersActive = false;
                        Crafty('Player ControlScheme').each(function () {
                            if (this.lives > 0) {
                                return playersActive = true;
                            }
                        });
                        if (!playersActive) {
                            _this.stop();
                            return Crafty.trigger('GameOver');
                        }
                    };
                })(this));
                return Crafty.bind('GameLoop', this._waveTicks);
            };

            Level.prototype._waveTicks = function (fd) {
                var n, ref, results, wt;
                if (this._registeredWaveTweens == null) {
                    this._registeredWaveTweens = {};
                }
                ref = this._registeredWaveTweens;
                results = [];
                for (n in ref) {
                    wt = ref[n];
                    results.push(wt.tick(fd.dt));
                }
                return results;
            };

            Level.prototype.registerWaveTween = function (name, duration, easing, callback) {
                var base;
                if (this._registeredWaveTweens == null) {
                    this._registeredWaveTweens = {};
                }
                return (base = this._registeredWaveTweens)[name] != null ? base[name] : base[name] = new ((function () {
                    function _Class(arg) {
                        var duration, easing;
                        this.name = arg.name, duration = arg.duration, easing = arg.easing, this.callback = arg.callback;
                        this.ease = new Crafty.easing(duration, easing);
                        this.ease.repeat(3);
                    }

                    _Class.prototype.tick = function (dt) {
                        var forward, v;
                        this.ease.tick(dt);
                        v = this.ease.value();
                        if (this.ease.loops === 1) {
                            this.ease.repeat(3);
                        }
                        forward = (this.ease.loops % 2) === 1;
                        return this.callback(v, forward);
                    };

                    return _Class;

                })())({
                    name: name,
                    duration: duration,
                    easing: easing,
                    callback: callback
                });
            };

            Level.prototype._setupLevelScenery = function () {
                var block, i, len, ref;
                if (this.currentScenery == null) {
                    return;
                }
                if (this.blocks.length !== 0) {
                    return;
                }
                this._placePlayerShips();
                this._seedPreceedingGeometry();
                this._update();
                this.lastUpdate = Crafty.viewport._x + 200;
                ref = this.blocks;
                for (i = 0, len = ref.length; i < len; i++) {
                    block = ref[i];
                    if (block.x < 640) {
                        block.enter();
                    }
                }
                Crafty.bind('ViewportScroll', (function (_this) {
                    return function () {
                        if (_this.lastUpdate - Crafty.viewport._x >= 300) {
                            _this._update();
                            return _this.lastUpdate = Crafty.viewport._x;
                        }
                    };
                })(this));
                Crafty.uniqueBind('LeaveBlock', (function (_this) {
                    return function (block) {
                        var index;
                        index = _.indexOf(_this.blocks, block);
                        if (index > 0) {
                            _this._handleSceneryEvents(_this.blocks[index - 1], 'leave');
                        }
                        _this._handleSceneryEvents(block, 'inScreen');
                        return _this._cleanupBuildBlocks();
                    };
                })(this));
                Crafty.uniqueBind('EnterBlock', (function (_this) {
                    return function (block) {
                        var index;
                        index = _.indexOf(_this.blocks, block);
                        if (index > 0) {
                            _this._handleSceneryEvents(_this.blocks[index - 1], 'outScreen');
                        }
                        return _this._handleSceneryEvents(block, 'enter');
                    };
                })(this));
                return Crafty.uniqueBind('PlayerEnterBlock', (function (_this) {
                    return function (block) {
                        var index;
                        index = _.indexOf(_this.blocks, block);
                        if (index > 0) {
                            _this._handleSceneryEvents(_this.blocks[index - 1], 'playerLeave');
                        }
                        return _this._handleSceneryEvents(block, 'playerEnter');
                    };
                })(this));
            };

            Level.prototype._handleSceneryEvents = function (block, eventType) {
                var event, i, index, ref, results;
                if (block == null) {
                    return;
                }
                block[eventType]();
                ref = this.sceneryEvents;
                results = [];
                for (index = i = ref.length - 1; i >= 0; index = i += -1) {
                    event = ref[index];
                    if (block.name === (this.namespace + "." + event.sceneryType) && eventType === event.eventType) {
                        event.callback.apply(this);
                        results.push(this.sceneryEvents.splice(index, 1));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            };

            Level.prototype.notifyScenery = function (eventType, sceneryType, callback) {
                return this.sceneryEvents.push({
                    eventType: eventType,
                    sceneryType: sceneryType,
                    callback: callback
                });
            };

            Level.prototype._placePlayerShips = function () {
                var defaults, settings;
                defaults = {
                    spawnPosition: {
                        x: 100,
                        y: 200
                    },
                    spawnOffset: {
                        x: -50,
                        y: 0
                    },
                    title: ''
                };
                settings = _.defaults(this.data, defaults);
                Crafty.one('ShipSpawned', (function (_this) {
                    return function () {
                        _this._playersActive = true;
                        return _this._scrollWall.scrollWall(_this._forcedSpeed);
                    };
                })(this));
                Crafty('Player').each(function (index) {
                    var spawnPosition;
                    spawnPosition = function () {
                        var pos;
                        pos = _.clone(settings.spawnPosition);
                        Crafty('PlayerControlledShip').each(function () {
                            pos.x = this.x + settings.spawnOffset.x + Crafty.viewport.x;
                            return pos.y = this.y + settings.spawnOffset.y + Crafty.viewport.y;
                        });
                        return pos;
                    };
                    this.addComponent('ShipSpawnable').spawnPosition(spawnPosition);
                    return Crafty.e('PlayerInfo').playerInfo(30 + (index * (Crafty.viewport.width * .3)), this);
                });
                Crafty.bind('ShipSpawned', (function (_this) {
                    return function (ship) {
                        var i, item, itemSettings, len, ref, results;
                        ship.forcedSpeed(_this._forcedSpeed, {
                            accellerate: false
                        });
                        ship.weaponsEnabled = _this._weaponsEnabled[ship.playerNumber];
                        if (!_this._controlsEnabled) {
                            ship.disableControl();
                        }
                        if (_this.playerStartWeapons != null) {
                            ship.clearItems();
                            ref = _this.playerStartWeapons;
                            results = [];
                            for (i = 0, len = ref.length; i < len; i++) {
                                item = ref[i];
                                itemSettings = _this.inventory(item);
                                results.push(ship.installItem(itemSettings));
                            }
                            return results;
                        }
                    };
                })(this));
                return Crafty('Player ControlScheme').each(function () {
                    return this.spawnShip();
                });
            };

            Level.prototype.inventory = function (name) {
                this.invItems || (this.invItems = {});
                return this.invItems[name];
            };

            Level.prototype.inventoryAdd = function (type, name, options) {
                var base;
                this.invItems || (this.invItems = {});
                return (base = this.invItems)[name] || (base[name] = _.defaults(options, {
                    type: type,
                    contains: name
                }));
            };

            Level.prototype.getShipType = function () {
                return this.shipType;
            };

            Level.prototype.setShipType = function (shipType) {
                this.shipType = shipType;
                return Crafty('Player ControlScheme').each(function () {
                    if (this.ship != null) {
                        return this.spawnShip();
                    }
                });
            };

            Level.prototype.setForcedSpeed = function (speed, options) {
                var delta, ref, ref1;
                options = _.defaults(options, {
                    accellerate: true
                });
                if (this._forcedSpeed) {
                    delta = ((ref = speed.x) != null ? ref : speed) - ((ref1 = this._forcedSpeed.x) != null ? ref1 : this._forcedSpeed);
                } else {
                    delta = 0;
                }
                this._forcedSpeed = speed;
                if (this._playersActive) {
                    this._scrollWall.scrollWall(this._forcedSpeed, options);
                }
                Crafty('Bullet').each(function () {
                    return this.attr({
                        speed: this.speed + delta
                    });
                });
                return Crafty('PlayerControlledShip').each(function () {
                    return this.forcedSpeed(speed, options);
                });
            };

            Level.prototype.screenShake = function (amount, options) {
                if (options == null) {
                    options = {};
                }
                options = _.defaults(options, {
                    duration: 1000
                });
                return this._scrollWall.screenShake(amount, options.duration);
            };

            Level.prototype.cameraPan = function (options) {
                if (options == null) {
                    options = {};
                }
                options = _.defaults(options, {
                    y: 0,
                    x: 0,
                    duration: 1000
                });
                return this._scrollWall.cameraPan(options);
            };

            Level.prototype.setHeight = function (deltaY) {
                this._scrollWall.setHeight(deltaY);
                return Crafty('PlayerControlledShip').each(function () {
                    return this.y += deltaY;
                });
            };

            Level.prototype.setWeaponsEnabled = function (onOff, players) {
                var i, len, player;
                if (!((players != null) && !_.isEmpty(players))) {
                    players = [1, 2];
                }
                if (this._weaponsEnabled == null) {
                    this._weaponsEnabled = {};
                }
                for (i = 0, len = players.length; i < len; i++) {
                    player = players[i];
                    this._weaponsEnabled[player] = onOff;
                }
                return Crafty('PlayerControlledShip').each(function () {
                    var ref;
                    if (ref = this.playerNumber, indexOf.call(players, ref) >= 0) {
                        return this.weaponsEnabled = onOff;
                    }
                });
            };

            Level.prototype.getComponentOffset = function () {
                return {
                    x: this._scrollWall.x,
                    y: this._scrollWall.y
                };
            };

            Level.prototype.addComponent = function (c, relativePosition, offset) {
                var block, position, ref;
                if (offset == null) {
                    offset = null;
                }
                block = this.blocks[(ref = this.currentBlockIndex) != null ? ref : 0];
                if (block == null) {
                    return;
                }
                if (offset == null) {
                    offset = this.getComponentOffset();
                }
                position = {
                    x: relativePosition.x + offset.x - block.x,
                    y: relativePosition.y + offset.y - block.y
                };
                return block.add(position.x, position.y, c);
            };

            Level.prototype.stop = function () {
                var b, i, len, ref, results;
                this.active = false;
                Crafty.unbind('LeaveBlock');
                Crafty.unbind('EnterBlock');
                Crafty.unbind('ShipSpawned');
                Crafty.unbind('ViewportScroll');
                Crafty.unbind('GameLoop', this._waveTicks);
                ref = this.blocks;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    b = ref[i];
                    results.push(b != null ? b.clean() : void 0);
                }
                return results;
            };

            Level.prototype.verify = function () {
                if (!this.active) {
                    throw new Error('sequence mismatch');
                }
            };

            Level.prototype._update = function () {
                var counter, endX, overflowThreshold, results, startX;
                startX = -Crafty.viewport._x;
                endX = startX + this.bufferLength;
                counter = 0;
                overflowThreshold = 10;
                results = [];
                while (this.generationPosition.x < endX && counter < overflowThreshold) {
                    this._generateLevel();
                    results.push(counter += 1);
                }
                return results;
            };

            Level.prototype._generateLevel = function () {
                var blockKlass, blockType, next;
                blockType = this.namespace + "." + this.currentScenery;
                this._addBlockToLevel(blockType, {});
                blockKlass = this.generator.buildingBlocks[blockType];
                if (next = blockKlass.prototype.autoNext) {
                    return this.currentScenery = next;
                }
            };

            Level.prototype._addBlockToLevel = function (blockType, settings) {
                var block, klass;
                klass = this.generator.buildingBlocks[blockType];
                block = new klass(this, this.generator, settings);
                this.blocks.push(block);
                block.build(this.generationPosition);
                return this.generationPosition = {
                    x: block.x + block.delta.x,
                    y: block.y + block.delta.y
                };
            };

            Level.prototype._insertBlockToLevel = function (blockType, settings) {
                var block, klass;
                klass = this.generator.buildingBlocks[blockType];
                if (klass == null) {
                    throw new Error(blockType + " not found");
                }
                block = new klass(this, this.generator, settings);
                this.blocks.unshift(block);
                this.generationPosition = {
                    x: this.generationPosition.x - block.delta.x,
                    y: this.generationPosition.y - block.delta.y
                };
                return block.build(this.generationPosition);
            };

            Level.prototype._cleanupBuildBlocks = function () {
                var first, results;
                first = this.blocks[0];
                results = [];
                while (first.canCleanup()) {
                    this.blocks.shift().clean();
                    results.push(first = this.blocks[0]);
                }
                return results;
            };

            Level.prototype._seedPreceedingGeometry = function () {
                var blockKlass, blockType, next, p, prev;
                blockType = this.namespace + "." + this.currentScenery;
                blockKlass = this.generator.buildingBlocks[blockType];
                if (next = blockKlass.prototype.autoNext) {
                    blockType = this.namespace + "." + next;
                }
                if (prev = blockKlass.prototype.autoPrevious) {
                    blockType = this.namespace + "." + prev;
                }
                p = _.clone(this.generationPosition);
                this._insertBlockToLevel(blockType, {});
                this._insertBlockToLevel(blockType, {});
                this._insertBlockToLevel(blockType, {});
                return this.generationPosition = p;
            };

            Level.prototype.loadAssets = function (names) {
                return this.generator.loadAssets(names);
            };

            Level.prototype.setStartWeapons = function (playerStartWeapons) {
                this.playerStartWeapons = playerStartWeapons;
            };

            return Level;
        })();
    });