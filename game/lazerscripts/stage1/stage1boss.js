var Game,
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Game = this.Game;

Game.Scripts || (Game.Scripts = {});

Game.Scripts.Stage1Boss = (function (superClass) {
    extend(Stage1Boss, superClass);

    function Stage1Boss() {
        return Stage1Boss.__super__.constructor.apply(this, arguments);
    }

    Stage1Boss.prototype.assets = function () {
        return this.loadAssets('largeDrone');
    };

    Stage1Boss.prototype.rocketStrikeDance = function () {
        return this.parallel(this.movePath([[.7, .4], [.8, .3], [.9, .5], [.7, .6], [.8, .7], [.9, .4], [.7, .1], [.6, .2]]), this.repeat(2, this.sequence(this.fireRockets(4), this.wait(1500), this.fireRockets(4), this.wait(1000), this.fireRockets(2), this.wait(300), this.fireRockets(2), this.wait(300), this.fireRockets(2), this.wait(300))));
    };

    Stage1Boss.prototype.rocketStrikeDanceHoming = function () {
        return this.parallel(this.movePath([[.7, .4], [.8, .3], [.9, .5], [.7, .6], [.8, .7], [.9, .4], [.7, .1], [.6, .2]]), this.repeat(2, this.sequence(this.fireRockets(2, true), this.wait(600), this.fireRockets(2, true), this.wait(600), this.fireRockets(2, true), this.wait(900), this.fireRockets(4), this.wait(300))));
    };

    Stage1Boss.prototype.fireRockets = function (amount, homing) {
        var script;
        script = Game.Scripts.Stage1BossRocket;
        if (homing) {
            script = Game.Scripts.Stage1BossAimedRocket;
        }
        return this.sequence(this.async(this.placeSquad(script, {
            options: {
                z: 5,
                offsetX: 0,
                offsetY: 50,
                pointsOnHit: 0,
                pointsOnDestroy: 0,
                location: this.location()
            }
        })), this.animate('emptyWing', 0, 'wing'), this.async(this.placeSquad(script, {
            options: {
                z: -5,
                offsetX: 0,
                offsetY: -50,
                pointsOnHit: 0,
                pointsOnDestroy: 0,
                location: this.location()
            }
        })), this["if"]((function () {
            return amount > 2;
        }), this.async(this.placeSquad(Game.Scripts.Stage1BossRocket, {
            options: {
                z: -5,
                offsetX: 30,
                offsetY: -100,
                location: this.location(),
                pointsOnHit: 0,
                pointsOnDestroy: 0
            }
        }))), this["if"]((function () {
            return amount > 3;
        }), this.async(this.placeSquad(Game.Scripts.Stage1BossRocket, {
            options: {
                z: -5,
                offsetX: 30,
                offsetY: 100,
                location: this.location(),
                pointsOnHit: 0,
                pointsOnDestroy: 0
            }
        }))), this.wait(500), this.animate('reload', 0, 'wing'));
    };

    Stage1Boss.prototype.smoke = function (version) {
        var options;
        if (version == null) {
            version = 'heavy';
        }
        options = {
            heavy: {
                alpha: .8,
                wait: 40
            },
            medium: {
                alpha: .6,
                wait: 80
            },
            light: {
                alpha: .4,
                wait: 140
            }
        }[version];
        return this.sequence(this.blast(this.location(), (function (_this) {
            return function () {
                return {
                    radius: 10,
                    duration: 480,
                    z: _this.entity.z - 3,
                    alpha: options.alpha,
                    lightness: 1.0
                };
            };
        })(this), function () {
            return {
                rotation: this.rotation + 1,
                alpha: Math.max(0, this.alpha - .003),
                lightness: function () {
                    return Math.max(.2, this.lightness - .05);
                },
                y: this.y - (Math.random() * 2)
            };
        }), this.wait(function () {
            return options.wait + (Math.random() * 50);
        }));
    };

    return Stage1Boss;

})(Game.EntityScript);

Game.Scripts.Stage1BossStage1 = (function (superClass) {
    extend(Stage1BossStage1, superClass);

    function Stage1BossStage1() {
        return Stage1BossStage1.__super__.constructor.apply(this, arguments);
    }

    Stage1BossStage1.prototype.spawn = function () {
        return Crafty.e('LargeDrone, Horizon').drone({
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .35,
            defaultSpeed: 100,
            health: 23000,
            pointsOnHit: 10
        });
    };

    Stage1BossStage1.prototype.execute = function () {
        this.bindSequence('Hit', this.fase2, (function (_this) {
            return function () {
                return _this.entity.healthBelow(.5);
            };
        })(this));
        return this.sequence(this.invincible(true), this.animate('slow', -1, 'eye'), this.disableWeapons(), this.parallel(this.moveTo({
            x: .75,
            y: .41
        }), this.say('Drone Commander', 'We have control over the AI now! You will suffer!\nEarths defences are in our hands!')), this.laugh(), this.invincible(false), this.enableWeapons(), this.async(this.placeSquad(Game.Scripts.Stage1BossRocket, {
            options: {
                location: this.location(),
                pointsOnDestroy: 0,
                pointsOnHit: 0
            }
        })), this.animate('emptyWing', 0, 'wing'), this.animate('reload', 0, 'wing'), this.moveTo({
            y: .43,
            speed: 5
        }), this.repeat(this.sequence(this.repeat(2, this.rocketStrikeDance()), this.mineFieldStrike())));
    };

    Stage1BossStage1.prototype.mineFieldStrike = function () {
        return this.sequence(this.parallel(this.sequence(this.moveTo({
            x: -.2,
            y: .8,
            speed: 400,
            easing: 'easeInQuad'
        }), this.turnAround(), this.movePath([[.2, .2], [.9, .6], [1.2, .4]], {
            speed: 400
        }), this.turnAround(), this.movePath([[.8, .2], [.5, .5], [1.2, .6]], {
            speed: 400
        })), this.placeSquad(Game.Scripts.Stage1BossMineField, {
            amount: 30,
            delay: 300,
            options: {
                location: this.location(),
                gridConfig: {
                    x: {
                        start: 0.1,
                        steps: 6,
                        stepSize: 0.15
                    },
                    y: {
                        start: 0.125,
                        steps: 8,
                        stepSize: 0.1
                    }
                }
            }
        })), this.movePath([[.7, .4]], {
            speed: 300
        }, 'easeOutQuad'));
    };

    Stage1BossStage1.prototype.bombRaid = function (armed) {
        if (armed == null) {
            armed = false;
        }
        return this.sequence(this.bigExplosion(), this.wait(200), this.bigExplosion(), this.moveTo({
            y: .1,
            speed: 200,
            easing: 'easeInOutQuad'
        }), this["while"](this.moveTo({
            x: -100,
            speed: 400
        }), this.sequence(this.async(this.placeSquad(Game.Scripts.Stage1BossBombRaid, {
            options: {
                location: this.location(),
                armed: false
            }
        })), this.wait(300))), this.turnAround(), this["while"](this.moveTo({
            x: 1.0,
            speed: 400
        }), this.sequence(this.async(this.placeSquad(Game.Scripts.Stage1BossBombRaid, {
            options: {
                location: this.location(),
                armed: armed
            }
        })), this.smoke('light'), this.wait(300))), this.moveTo({
            x: 1.2,
            speed: 400
        }), this.turnAround(), this.moveTo({
            x: .85,
            y: .41,
            speed: 400
        }));
    };

    Stage1BossStage1.prototype.fase2 = function () {
        this.bindSequence('Hit', this.endOfFight, (function (_this) {
            return function () {
                return _this.entity.healthBelow(.2);
            };
        })(this));
        return this.sequence(this.cancelBullets('Mine'), this.cancelBullets('shadow'), this.setSpeed(200), this.repeat(this.sequence(this.bombRaid(true), this.repeat(2, this["while"](this.rocketStrikeDanceHoming(), this.sequence(this.async(this.runScript(Game.Scripts.Stage1BossMine, this.location())), this.wait(1500)))), this.wait(1000))));
    };

    Stage1BossStage1.prototype.laugh = function () {
        return this.sequence((function (_this) {
            return function () {
                return Crafty.audio.play('laugh');
            };
        })(this), (function (_this) {
            return function () {
                return _this.entity.invincible = true;
            };
        })(this), this.repeat(5, this.sequence(this.rotate(10, 200), this.rotate(-10, 200))), this.rotate(0, 200), (function (_this) {
            return function () {
                return _this.entity.invincible = false;
            };
        })(this));
    };

    Stage1BossStage1.prototype.endOfFight = function () {
        return this.sequence(this.cancelBullets('Mine'), this.cancelBullets('shadow'), this.invincible(true), this["while"](this.moveTo({
            x: .6,
            y: .90,
            speed: 50
        }), this.sequence(this.smallExplosion(), this["while"](this.wait(300), this.smoke()))), this.moveTo({
            y: 1.1,
            x: .4,
            speed: 50
        }), this.moveTo({
            y: .6,
            x: .4,
            speed: 350,
            easing: 'easeOutQuad'
        }), this.sendToBackground(0.9, -100), this.parallel(this["while"](this.moveTo({
            x: -.15,
            speed: 300,
            easing: 'easeInQuad'
        }), this.smoke('medium')), this.scale(0.8, {
            duration: 3000
        })), this.leaveAnimation(this.sequence(this.turnAround(), this.sendToBackground(0.7, -150), this["while"](this.moveTo({
            x: 1.1,
            speed: 500,
            easing: 'easeInQuad'
        }), this.smoke('medium')))));
    };

    return Stage1BossStage1;

})(Game.Scripts.Stage1Boss);

Game.Scripts.Stage1BossMine = (function (superClass) {
    extend(Stage1BossMine, superClass);

    function Stage1BossMine() {
        return Stage1BossMine.__super__.constructor.apply(this, arguments);
    }

    Stage1BossMine.prototype.assets = function () {
        return this.loadAssets('mine');
    };

    Stage1BossMine.prototype.spawn = function (location) {
        return Crafty.e('Mine').mine({
            health: 100,
            x: location().x,
            y: location().y + 10,
            z: -4,
            defaultSpeed: 200,
            pointsOnHit: 0,
            pointsOnDestroy: 0
        });
    };

    Stage1BossMine.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.pickTarget('PlayerControlledShip'), this.moveTo({
            y: 1.1,
            easing: 'easeInQuad'
        }), (function (_this) {
            return function () {
                return _this.entity.attr({
                    z: 0
                });
            };
        })(this), this.moveTo(this.targetLocation(), {
            y: 1.01,
            easing: 'easeInOutQuad'
        }), this.moveTo(this.targetLocation({
            x: null
        })), this.animate('open'), this.wait(200), this.animate('blink', -1), this.wait(1000), (function (_this) {
            return function () {
                return _this.entity.absorbDamage({
                    damage: _this.entity.health
                });
            };
        })(this), this.endSequence());
    };

    Stage1BossMine.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossMine;

})(Game.EntityScript);

Game.Scripts.Stage1BossRocketStrike = (function (superClass) {
    extend(Stage1BossRocketStrike, superClass);

    function Stage1BossRocketStrike() {
        return Stage1BossRocketStrike.__super__.constructor.apply(this, arguments);
    }

    Stage1BossRocketStrike.prototype.spawn = function (options) {
        var location;
        options = _.defaults(options, {
            pointsOHit: 125,
            pointsOnDestroy: 50
        });
        location = options.grid.getLocation();
        return Crafty.e('Rocket').rocket({
            health: 250,
            x: location.x * Crafty.viewport.width,
            y: location.y * Crafty.viewport.height,
            z: 5,
            defaultSpeed: 600,
            pointsOnHit: options.pointsOnHit,
            pointsOnDestroy: options.pointsOnDestroy
        });
    };

    Stage1BossRocketStrike.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this["while"](this.moveTo({
            x: -205,
            easing: 'easeInQuad'
        }), this.sequence(this.blast(this.location(), function () {
            return {
                radius: 5,
                duration: 135,
                z: 1,
                alpha: .8,
                lightness: 1.0,
                gravity: Math.random() * .2,
                vertical: 0
            };
        }, function () {
            return {
                vertical: this.vertical + Math.random() * this.gravity,
                rotation: this.rotation + (Math.random() * 3),
                alpha: Math.max(0.1, this.alpha - Math.random() * .03),
                lightness: Math.max(.4, this.lightness - .05),
                y: this.y - this.vertical
            };
        }), this.wait(20)));
    };

    Stage1BossRocketStrike.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossRocketStrike;

})(Game.EntityScript);

Game.Scripts.Stage1BossRocket = (function (superClass) {
    extend(Stage1BossRocket, superClass);

    function Stage1BossRocket() {
        return Stage1BossRocket.__super__.constructor.apply(this, arguments);
    }

    Stage1BossRocket.prototype.spawn = function (options) {
        var location;
        options = _.defaults(options, {
            pointsOnHit: 125,
            pointsOnDestroy: 50,
            offsetY: 0,
            offsetX: 0,
            scale: 1.0,
            health: 250
        });
        if (options.location == null) {
            return null;
        }
        location = typeof options.location === "function" ? options.location() : void 0;
        if (!location) {
            return null;
        }
        this.offsetY = options.offsetY;
        this.offsetX = options.offsetX;
        return Crafty.e('Rocket').rocket({
            health: options.health,
            x: location.x - 30,
            y: location.y - 8 + Math.round(Math.random() * 15),
            z: 5,
            scale: options.scale,
            defaultSpeed: 600,
            pointsOnHit: options.pointsOnHit,
            pointsOnDestroy: options.pointsOnDestroy
        });
    };

    Stage1BossRocket.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this["while"](this.sequence(this.moveTo(this.location({
            offsetY: this.offsetY,
            offsetX: this.offsetX
        })), this["if"]((function () {
            return this.offsetX !== 0 || this.offsetY !== 0;
        }), this.wait(500)), this.moveTo({
            x: -205,
            easing: 'easeInQuad'
        })), this.sequence(this.blast(this.location(), function () {
            return {
                radius: 5,
                duration: 135,
                z: 1,
                alpha: .8,
                lightness: 1.0,
                gravity: Math.random() * .2,
                vertical: 0
            };
        }, function () {
            return {
                vertical: this.vertical + Math.random() * this.gravity,
                rotation: this.rotation + (Math.random() * 3),
                alpha: Math.max(0.1, this.alpha - Math.random() * .03),
                lightness: Math.max(.4, this.lightness - .05),
                y: this.y - this.vertical
            };
        }), this.wait(20)));
    };

    Stage1BossRocket.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossRocket;

})(Game.EntityScript);

Game.Scripts.Stage1BossAimedRocket = (function (superClass) {
    extend(Stage1BossAimedRocket, superClass);

    function Stage1BossAimedRocket() {
        return Stage1BossAimedRocket.__super__.constructor.apply(this, arguments);
    }

    Stage1BossAimedRocket.prototype.spawn = function (options) {
        var location, ref;
        options = _.defaults(options, {
            pointsOHit: 125,
            pointsOnDestroy: 50,
            z: 5,
            scale: 1.0,
            offsetY: 0
        });
        if (options.location == null) {
            return null;
        }
        location = typeof options.location === "function" ? options.location() : void 0;
        if (!location) {
            return null;
        }
        this.offsetY = options.offsetY;
        this.cooldown = (ref = options.cooldown) != null ? ref : 500;
        return Crafty.e('Rocket').rocket({
            health: 250,
            x: location.x - 30,
            y: location.y - 8 + Math.round(Math.random() * 15),
            z: options.z,
            defaultSpeed: 500,
            scale: options.scale,
            pointsOnHit: options.pointsOnHit,
            pointsOnDestroy: options.pointsOnDestroy
        });
    };

    Stage1BossAimedRocket.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.pickTarget('PlayerControlledShip'), this.moveTo(this.location({
            offsetY: this.offsetY
        })), this.wait(this.cooldown), this["while"](this.moveThrough(this.targetLocation()), this.sequence(this.blast(this.location(), function () {
            return {
                radius: 5,
                duration: 135,
                z: 1,
                alpha: .8,
                lightness: 1.0,
                gravity: Math.random() * .2,
                vertical: 0
            };
        }, function () {
            return {
                vertical: this.vertical + Math.random() * this.gravity,
                rotation: this.rotation + (Math.random() * 3),
                alpha: Math.max(0.1, this.alpha - Math.random() * .03),
                lightness: Math.max(.4, this.lightness - .05),
                y: this.y - this.vertical
            };
        }), this.wait(20))));
    };

    Stage1BossAimedRocket.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossAimedRocket;

})(Game.EntityScript);

Game.Scripts.Stage1BossHomingRocket = (function (superClass) {
    extend(Stage1BossHomingRocket, superClass);

    function Stage1BossHomingRocket() {
        return Stage1BossHomingRocket.__super__.constructor.apply(this, arguments);
    }

    Stage1BossHomingRocket.prototype.spawn = function (options) {
        var location, ref;
        options = _.defaults(options, {
            pointsOHit: 125,
            pointsOnDestroy: 50,
            z: 5,
            scale: 1.0,
            offsetY: 0
        });
        if (options.location == null) {
            return null;
        }
        location = typeof options.location === "function" ? options.location() : void 0;
        if (!location) {
            return null;
        }
        this.offsetY = options.offsetY;
        this.cooldown = (ref = options.cooldown) != null ? ref : 500;
        return Crafty.e('Rocket').rocket({
            health: 250,
            x: location.x - 30,
            y: location.y - 8 + Math.round(Math.random() * 15),
            z: options.z,
            defaultSpeed: 500,
            scale: options.scale,
            pointsOnHit: options.pointsOnHit,
            pointsOnDestroy: options.pointsOnDestroy
        });
    };

    Stage1BossHomingRocket.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.pickTarget('PlayerControlledShip'), this.moveTo(this.location({
            offsetY: this.offsetY
        })), this.wait(this.cooldown), this["while"](this.movePath([this.targetLocation(), [-160, .5]]), this.sequence(this.blast(this.location(), function () {
            return {
                radius: 5,
                duration: 135,
                z: 1,
                alpha: .8,
                lightness: 1.0,
                gravity: Math.random() * .2,
                vertical: 0
            };
        }, function () {
            return {
                vertical: this.vertical + Math.random() * this.gravity,
                rotation: this.rotation + (Math.random() * 3),
                alpha: Math.max(0.1, this.alpha - Math.random() * .03),
                lightness: Math.max(.4, this.lightness - .05),
                y: this.y - this.vertical
            };
        }), this.wait(20))));
    };

    Stage1BossHomingRocket.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossHomingRocket;

})(Game.EntityScript);

Game.Scripts.Stage1BossPopup = (function (superClass) {
    extend(Stage1BossPopup, superClass);

    function Stage1BossPopup() {
        return Stage1BossPopup.__super__.constructor.apply(this, arguments);
    }

    Stage1BossPopup.prototype.spawn = function () {
        return Crafty.e('LargeDrone, Horizon').drone({
            maxHealth: 60000,
            health: 17000,
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .5,
            defaultSpeed: 150
        });
    };

    Stage1BossPopup.prototype.execute = function () {
        this.bindSequence('Hit', this.leaveScreen, (function (_this) {
            return function () {
                return _this.entity.healthBelow(.10);
            };
        })(this));
        return this.sequence(this.animate('slow', -1, 'eye'), this.moveTo({
            x: .9,
            y: .45
        }), this["while"](this.repeat(this.rocketStrikeDance()), this.smoke('light')));
    };

    Stage1BossPopup.prototype.leaveScreen = function () {
        return this.sequence(this.invincible(true), this.moveTo({
            y: .5,
            x: 0.95,
            speed: 200,
            easing: 'easeInOutQuad'
        }), this.async(this.placeSquad(Game.Scripts.Stage1BossPopupMineField, {
            amount: 20,
            delay: 50,
            options: {
                location: this.location(),
                gridConfig: {
                    x: {
                        start: 0.1,
                        steps: 12,
                        stepSize: 0.075
                    },
                    y: {
                        start: 0.1,
                        steps: 5,
                        stepSize: 0.075
                    }
                }
            }
        })), this.async(this.placeSquad(Game.Scripts.Stage1BossPopupMineField, {
            amount: 20,
            delay: 50,
            options: {
                location: this.location(),
                gridConfig: {
                    x: {
                        start: 0.1,
                        steps: 12,
                        stepSize: 0.075
                    },
                    y: {
                        start: 0.7,
                        steps: 5,
                        stepSize: 0.075
                    }
                }
            }
        })), this.wait(3000), this.drop({
            item: 'pool',
            location: this.location()
        }), this["while"](this.moveTo({
            x: -.15,
            speed: 500,
            easing: 'easeInOutQuad'
        }), this.sequence(this.smallExplosion(), this["while"](this.wait(300), this.smoke()))), this.leaveAnimation(this.sequence(this.turnAround(), this.sendToBackground(0.7, -150), this["while"](this.moveTo({
            x: 1.1,
            speed: 300
        }), this.smoke('light')))));
    };

    return Stage1BossPopup;

})(Game.Scripts.Stage1Boss);

Game.Scripts.Stage1BossLeaving = (function (superClass) {
    extend(Stage1BossLeaving, superClass);

    function Stage1BossLeaving() {
        return Stage1BossLeaving.__super__.constructor.apply(this, arguments);
    }

    Stage1BossLeaving.prototype.spawn = function () {
        return Crafty.e('LargeDrone, Horizon').drone({
            maxHealth: 180000,
            health: 36000,
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .5,
            defaultSpeed: 150
        });
    };

    Stage1BossLeaving.prototype.execute = function () {
        this.entity.colorDesaturation(Game.backgroundColor);
        this.bindSequence('Hit', this.leaveScreen, (function (_this) {
            return function () {
                return _this.entity.healthBelow(.10);
            };
        })(this));
        return this.sequence(this.animate('slow', -1, 'eye'), this.shortRocketStrikeDance(), this.laugh(), this.leaveScreen());
    };

    Stage1BossLeaving.prototype.shortRocketStrikeDance = function (homing) {
        if (homing == null) {
            homing = false;
        }
        return this.parallel(this.movePath([[.7, .4], [.8, .3], [.9, .5], [.7, .6], [.8, .7], [.9, .4], [.7, .1], [.6, .2]]), this.repeat(2, this.sequence(this.fireRockets(4, homing), this.wait(1500), this.fireRockets(4, homing), this.wait(1000), this.fireRockets(2, homing), this.wait(300), this.fireRockets(2), this.wait(300), this.fireRockets(2, homing), this.wait(300))));
    };

    Stage1BossLeaving.prototype.laugh = function () {
        return this.sequence((function (_this) {
            return function () {
                return Crafty.audio.play('laugh');
            };
        })(this), this.invincible(true), this.repeat(5, this.sequence(this.rotate(10, 200), this.rotate(-10, 200))), this.rotate(0, 200), this.invincible(false));
    };

    Stage1BossLeaving.prototype.leaveScreen = function () {
        return this.leaveAnimation(this.sequence(this.animate('emptyWing', 0, 'wing'), this.sendToBackground(0.9, -100), this.parallel(this["while"](this.moveTo({
            x: -.15,
            y: .4,
            speed: 400
        }), this.smoke()), this.scale(0.5, {
            duration: 3000
        })), (function (_this) {
            return function () {
                return _this.entity.flipX();
            };
        })(this), this.sendToBackground(0.5, -550), this.parallel(this["while"](this.moveTo('MiliBase', {
            speed: 150,
            offsetY: -160,
            offsetX: -40
        }), this.smoke('light')), this.scale(0.2, {
            duration: 4000
        }))));
    };

    Stage1BossLeaving.prototype.attackCycle = function () {
        return this.repeat(4, this.sequence(this.async(this.placeSquad(Game.Scripts.Stage1BossRocket, {
            options: {
                location: this.location(),
                pointsOnDestroy: 0,
                pointsOnHit: 0
            }
        })), this.animate('emptyWing', 0, 'wing'), this.parallel(this["while"](this.moveTo(this.targetLocation({
            offsetY: -20
        }), {
            x: .845
        }), this.smoke('medium')), this.sequence(this.animate('reload', 0, 'wing'), this.wait(1000)))));
    };

    return Stage1BossLeaving;

})(Game.Scripts.Stage1Boss);

Game.Scripts.Stage1BossBombRaid = (function (superClass) {
    extend(Stage1BossBombRaid, superClass);

    function Stage1BossBombRaid() {
        return Stage1BossBombRaid.__super__.constructor.apply(this, arguments);
    }

    Stage1BossBombRaid.prototype.assets = function () {
        return this.loadAssets('mine');
    };

    Stage1BossBombRaid.prototype.spawn = function (options) {
        var location, ref;
        location = options.location();
        this.armed = options.armed;
        return Crafty.e('Mine').mine({
            health: 200,
            x: location.x,
            y: location.y + 10,
            z: -4,
            defaultSpeed: 400,
            pointsOnHit: 10,
            pointsOnDestroy: 20,
            scale: (ref = options.scale) != null ? ref : 1.0
        });
    };

    Stage1BossBombRaid.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        if (this.armed) {
            return this.sequence(this.animate('blink', -1), this.moveTo({
                y: .3 + (Math.random() * .6),
                easing: 'easeInOutQuad'
            }), this.wait(200), (function (_this) {
                return function () {
                    return _this.entity.absorbDamage({
                        damage: _this.entity.health
                    });
                };
            })(this));
        } else {
            return this.sequence(this.moveTo({
                y: 1.2,
                easing: 'easeInQuad'
            }));
        }
    };

    Stage1BossBombRaid.prototype.onKilled = function () {
        return this.bigExplosion();
    };

    return Stage1BossBombRaid;

})(Game.EntityScript);

Game.Scripts.Stage1BossDroneRaid = (function (superClass) {
    extend(Stage1BossDroneRaid, superClass);

    function Stage1BossDroneRaid() {
        return Stage1BossDroneRaid.__super__.constructor.apply(this, arguments);
    }

    Stage1BossDroneRaid.prototype.assets = function () {
        return this.loadAssets('drone');
    };

    Stage1BossDroneRaid.prototype.spawn = function (options) {
        var d;
        d = Crafty.e('Drone').drone({
            health: 200,
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .1,
            defaultSpeed: 500
        });
        if (options.shootOnSight) {
            d.addComponent('ShootOnSight').shootOnSight({
                cooldown: 1000,
                sightAngle: 8,
                projectile: (function (_this) {
                    return function (x, y, angle) {
                        var projectile;
                        projectile = Crafty.e('Projectile, Color, Hostile').attr({
                            w: 6,
                            h: 6,
                            speed: 650
                        }).color('#FFFF00');
                        return projectile.shoot(x, y, angle);
                    };
                })(this)
            });
        }
        return d;
    };

    Stage1BossDroneRaid.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.pickTarget('PlayerControlledShip'), this.movePath([
          this.targetLocation({
              offsetX: -20,
              offsetY: 30
          }), [-160, .5]
        ]));
    };

    Stage1BossDroneRaid.prototype.onKilled = function () {
        return this.smallExplosion();
    };

    return Stage1BossDroneRaid;

})(Game.EntityScript);

Game.Scripts.Stage1BossMineField = (function (superClass) {
    extend(Stage1BossMineField, superClass);

    function Stage1BossMineField() {
        return Stage1BossMineField.__super__.constructor.apply(this, arguments);
    }

    Stage1BossMineField.prototype.assets = function () {
        return this.loadAssets('mine');
    };

    Stage1BossMineField.prototype.spawn = function (options) {
        var location, ref;
        location = options.location();
        this.target = options.grid.getLocation();
        return Crafty.e('Mine').mine({
            x: location.x,
            y: location.y + 36,
            defaultSpeed: (ref = options.speed) != null ? ref : 200,
            pointsOnHit: options.points ? 10 : 0,
            pointsOnDestroy: options.points ? 50 : 0
        });
    };

    Stage1BossMineField.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.moveTo({
            y: 1.05,
            speed: 400
        }), this.moveTo({
            x: this.target.x,
            easing: 'easeOutQuad'
        }), this.synchronizeOn('dropped'), this.moveTo({
            y: this.target.y,
            easing: 'easeOutQuad'
        }), this.sequence(this.wait(1000), this.animate('blink', -1), this.wait(1000), this.squadOnce('bridge', this.sequence(this.wait(500), (function (_this) {
            return function () {
                return Crafty.trigger('BridgeCollapse', _this.level);
            };
        })(this), this.screenFlash(2, {
            color: '#FFFF80',
            alpha: .4
        }))), (function (_this) {
            return function () {
                return _this.entity.absorbDamage({
                    damage: _this.entity.health
                });
            };
        })(this), this.endSequence()));
    };

    Stage1BossMineField.prototype.onKilled = function () {
        return this.bigExplosion({
            juice: this.juice
        });
    };

    return Stage1BossMineField;

})(Game.EntityScript);

Game.Scripts.Stage1BossPopupMineField = (function (superClass) {
    extend(Stage1BossPopupMineField, superClass);

    function Stage1BossPopupMineField() {
        return Stage1BossPopupMineField.__super__.constructor.apply(this, arguments);
    }

    Stage1BossPopupMineField.prototype.assets = function () {
        return this.loadAssets('mine');
    };

    Stage1BossPopupMineField.prototype.spawn = function (options) {
        var location, ref;
        location = options.location();
        this.target = options.grid.getLocation();
        this.index = options.index;
        return Crafty.e('Mine').mine({
            health: 700,
            x: location.x,
            y: location.y + 10,
            z: -4,
            defaultSpeed: (ref = options.speed) != null ? ref : 300,
            pointsOnHit: options.points ? 10 : 0,
            pointsOnDestroy: options.points ? 50 : 0
        });
    };

    Stage1BossPopupMineField.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.moveTo({
            x: this.target.x,
            y: this.target.y,
            easing: 'easeOutQuad'
        }), this.synchronizeOn('placed'), this.sequence(this.wait((1 - this.target.xPerc) * 1000), this.animate('blink', -1), this.wait(1000), (function (_this) {
            return function () {
                return _this.entity.absorbDamage({
                    damage: _this.entity.health
                });
            };
        })(this), (function (_this) {
            return function () {
                if (_this.index === 0) {
                    return Crafty('RiggedExplosion').trigger('BigExplosion');
                }
            };
        })(this), this.endSequence()));
    };

    Stage1BossPopupMineField.prototype.onKilled = function () {
        return this.bigExplosion({
            juice: this.juice
        });
    };

    return Stage1BossPopupMineField;

})(Game.EntityScript);

// ---
// generated by coffee-script 1.9.2