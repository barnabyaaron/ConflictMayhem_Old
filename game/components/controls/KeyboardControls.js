define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function(_, Crafty, Game) {
        Crafty.c('KeyboardControls',
        {
            init: function() {
                this.requires('Listener');
                return this.bind('RemoveComponent', function (componentName) {
                    if (componentName === 'ControlScheme') {
                        return this.removeComponent('KeyboardControls');
                    }
                });
            },
            remove: function() {
                return this.unbind('KeyDown', this._keyHandling);
            },
            setupControls: function(player) {
                return player.addComponent('KeyboardControls').controls(this.controlMap).addComponent('ControlScheme');
            },
            controls: function(controlMap) {
                this.controlMap = controlMap;
                this.bind('KeyDown', this._keyHandling);
                return this;
            },
            _keyHandling: function(e) {
                if (e.key === this.controlMap.fire) {
                    this.trigger('Fire', e);
                }
                if (e.key === this.controlMap.up) {
                    this.trigger('Up', e);
                }
                if (e.key === this.controlMap.down) {
                    this.trigger('Down', e);
                }
                if (e.key === this.controlMap.left) {
                    this.trigger('Left', e);
                }
                if (e.key === this.controlMap.right) {
                    return this.trigger('Right', e);
                }
            },
            assignControls: function(ship) {
                var controlMap, direction, directions, key, keyMap, keyValue, movementMap, ref, value;
                controlMap = this.controlMap;
                movementMap = {};
                directions = {
                    up: -90,
                    down: 90,
                    left: 180,
                    right: 0
                };
                for (direction in directions) {
                    value = directions[direction];
                    keyValue = controlMap[direction];
                    ref = Crafty.keys;
                    for (key in ref) {
                        keyMap = ref[key];
                        if (keyMap === keyValue) {
                            movementMap[key] = value;
                        }
                    }
                }
                ship.addComponent('Multiway, Keyboard').multiway({
                    y: 400,
                    x: 400
                }, movementMap, {
                    clamp: true
                }).bind('GamePause', function (paused) {
                    if (paused) {
                        this.disabledBeforePause = this.disableControls;
                        return this.disableControl();
                    } else {
                        if (!this.disabledBeforePause) {
                            return this.enableControl();
                        }
                    }
                });
                this.listenTo(ship, 'KeyDown', function (e) {
                    if (e.key === controlMap.fire) {
                        ship.shoot(true);
                    }
                    if (e.key === controlMap.switchWeapon) {
                        ship.switchWeapon(true);
                    }
                    if (e.key === controlMap["super"]) {
                        ship.superWeapon(true);
                    }
                    if (e.key === controlMap.pause) {
                        return Game.togglePause();
                    }
                });
                return this.listenTo(ship, 'KeyUp', function (e) {
                    if (e.key === controlMap.fire) {
                        ship.shoot(false);
                    }
                    if (e.key === controlMap.switchWeapon) {
                        ship.switchWeapon(false);
                    }
                    if (e.key === controlMap["super"]) {
                        return ship.superWeapon(false);
                    }
                });
            }
        });
    });