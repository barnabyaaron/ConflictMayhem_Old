define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('ShipSpawnable',
        {
            init: function() {
                this.requires('Listener');
                return this.bind('Activated', this.spawnShip);
            },
            remove: function() {
                return this.unbind('Activated', this.spawnShip);
            },
            spawnPosition: function(spawnPosition) {
                this.spawnPosition = spawnPosition;
                if (this.spawnPosition == null) {
                    this.spawnPosition = function () {
                        return {
                            x: x,
                            y: y
                        };
                    };
                }
                return this;
            },
            spawnShip: function(stats) {
                var base, base1, base2, pos, ref;
                if (stats == null) {
                    stats = {};
                }
                if (!this.has('ControlScheme')) {
                    return;
                }
                if (!(this.lives > 0)) {
                    return;
                }
                pos = this.spawnPosition();
                if (pos.x < 10) {
                    pos.x = 10;
                }
                if (this.ship != null) {
                    pos = {
                        x: this.ship.x + Crafty.viewport.x,
                        y: this.ship.y + Crafty.viewport.y
                    };
                    this.ship.destroy();
                    this.ship = null;
                }
                this.ship = Crafty.e(this.level.getShipType()).attr({
                    x: pos.x - Crafty.viewport.x,
                    y: pos.y - Crafty.viewport.y,
                    z: this.z,
                    playerNumber: this.playerNumber
                });
                this.ship.playerColor = this.color();
                if (typeof (base = this.ship).colorOverride === "function") {
                    base.colorOverride(this.color(), 'partial');
                }
                if (this.has('Color')) {
                    if (typeof (base1 = this.ship).color === "function") {
                        base1.color(this.color());
                    }
                }
                if (this.has('ControlScheme')) {
                    this.assignControls(this.ship);
                }
                this.listenTo(this.ship, 'HitTarget', function (data) {
                    var points, ref1;
                    this.stats.shotsHit += 1;
                    points = (ref1 = data.pointsOnHit) != null ? ref1 : 0;
                    if (data != null) {
                        return this.addPoints(points, data.location);
                    }
                });
                this.listenTo(this.ship, 'DestroyTarget', function (data) {
                    var points, ref1, ref2;
                    this.stats.enemiesKilled += 1;
                    points = ((ref1 = data.pointsOnDestroy) != null ? ref1 : 0) + ((ref2 = data.pointsOnHit) != null ? ref2 : 0);
                    if (data != null) {
                        return this.addPoints(points, data.location);
                    }
                });
                this.listenTo(this.ship, 'BonusPoints', function (data) {
                    return this.addPoints(data.points, data.location);
                });
                this.listenTo(this.ship, 'PowerUp', function (powerUp) {
                    if (powerUp.type === 'ship') {
                        if (powerUp.contains === 'life') {
                            this.gainLife();
                        }
                        if (powerUp.contains === 'points') {
                            this.addPoints(500);
                        }
                    }
                    return this.addPoints(20);
                });
                this.listenTo(this.ship, 'Shoot', function () {
                    return this.stats.shotsFired += 1;
                });
                this.trigger('ShipSpawned', this.ship);
                Crafty.trigger('ShipSpawned', this.ship);
                this.ship.stats(stats);
                this.ship.start();
                this.listenTo(this.ship, 'Destroyed', function () {
                    this.ship.destroy();
                    stats = this.ship.stats();
                    this.ship = null;
                    return Crafty.e('Delay').delay((function (_this) {
                        return function () {
                            _this.loseLife();
                            return _this.spawnShip(stats);
                        };
                    })(this), 2000, 0);
                });
                return this;
            }
        });
    });