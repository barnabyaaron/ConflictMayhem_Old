var Game,
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Game = this.Game;

Game.Scripts || (Game.Scripts = {});

Game.Scripts.ArmyDrone = (function (superClass) {
    extend(ArmyDrone, superClass);

    function ArmyDrone() {
        return ArmyDrone.__super__.constructor.apply(this, arguments);
    }

    ArmyDrone.prototype.assets = function () {
        return this.loadAssets('drone');
    };

    ArmyDrone.prototype.onKilled = function () {
        return this.sequence(this.deathDecoy(), this.smallExplosion({
            juice: this.juice,
            offsetX: 20,
            offsetY: 20
        }), this.rotate(30, 60), this.endDecoy());
    };

    return ArmyDrone;

})(Game.EntityScript);

Game.Scripts.Swirler = (function (superClass) {
    extend(Swirler, superClass);

    function Swirler() {
        return Swirler.__super__.constructor.apply(this, arguments);
    }

    Swirler.prototype.spawn = function (options) {
        var d, ref;
        d = Crafty.e('Drone').drone({
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height / 2,
            defaultSpeed: (ref = options.speed) != null ? ref : 300,
            juice: options.juice
        });
        this.juice = options.juice;
        if (options.shootOnSight) {
            d.addComponent('ShootOnSight').shootOnSight({
                cooldown: 1000 + (Math.random() * 8000),
                sightAngle: 250,
                projectile: (function (_this) {
                    return function (x, y, angle) {
                        var projectile;
                        projectile = Crafty.e('Sphere, Hostile, Projectile').blink();
                        return projectile.shoot(x, y, angle);
                    };
                })(this)
            });
        }
        return d;
    };

    Swirler.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.movePath([[.5, .21], [.156, .5], [.5, .833], [.86, .52], [.5, .21], [.156, .5], [.5, .833], [.86, .52], [-20, .21]], {
            rotate: false
        });
    };

    return Swirler;

})(Game.Scripts.ArmyDrone);

Game.Scripts.Stalker = (function (superClass) {
    extend(Stalker, superClass);

    function Stalker() {
        return Stalker.__super__.constructor.apply(this, arguments);
    }

    Stalker.prototype.spawn = function () {
        return Crafty.e('Drone').drone({
            health: 100,
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .83,
            defaultSpeed: 600,
            pointsOnHit: 125
        });
    };

    Stalker.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.pickTarget('PlayerControlledShip'), this.moveTo({
            x: 1.1,
            y: 1.01
        }), this.repeat(5, this.sequence(this.moveTo(this.targetLocation(), {
            y: 1.01,
            speed: 400,
            easing: 'easeInOutQuad'
        }), this.wait(100))), this.moveTo({
            y: .7,
            speed: 200,
            easing: 'easeOutQuad'
        }), this.wait(100), this.moveTo({
            y: .73,
            speed: 100,
            easing: 'easeInOutQuad'
        }), this.wait(100), this.moveTo({
            y: .7,
            speed: 100,
            easing: 'easeInOutQuad'
        }), this.moveTo({
            y: -50,
            easing: 'easeInQuad'
        }));
    };

    return Stalker;

})(Game.Scripts.ArmyDrone);

Game.Scripts.ScraperFlyer = (function (superClass) {
    extend(ScraperFlyer, superClass);

    function ScraperFlyer() {
        return ScraperFlyer.__super__.constructor.apply(this, arguments);
    }

    ScraperFlyer.prototype.spawn = function () {
        return Crafty.e('Drone, ShootOnSight, ColorEffects, Horizon').drone({
            x: -50,
            y: Crafty.viewport.height * .7,
            defaultSpeed: 300
        }).shootOnSight({
            cooldown: 5000 + (Math.random() * 8000),
            sightAngle: 250,
            projectile: (function (_this) {
                return function (x, y, angle) {
                    var projectile;
                    projectile = Crafty.e('Sphere, Hostile, Projectile').blink();
                    return projectile.shoot(x, y, angle);
                };
            })(this)
        });
    };

    ScraperFlyer.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.sendToBackground(0.5, -400), this.parallel(this.movePath([[.6, .7], [.8, .3], [.5, .1], [.2, .25], [.5, .7], [.8, .4], [.5, .21], [.156, .5], [.5, .833], [.86, .52], [-.1, .4]]), this.sequence(this.wait(2000), this.scale(1.0, {
            duration: 2000
        }), this.reveal())));
    };

    return ScraperFlyer;

})(Game.Scripts.ArmyDrone);

Game.Scripts.Shooter = (function (superClass) {
    extend(Shooter, superClass);

    function Shooter() {
        return Shooter.__super__.constructor.apply(this, arguments);
    }

    Shooter.prototype.spawn = function (options) {
        var d, ref;
        d = Crafty.e('Drone').drone({
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .71,
            defaultSpeed: (ref = options.speed) != null ? ref : 300,
            juice: options.juice
        });
        this.juice = options.juice;
        if (options.shootOnSight) {
            d.addComponent('ShootOnSight').shootOnSight({
                cooldown: 1000 + (Math.random() * 8000),
                sightAngle: 250,
                projectile: (function (_this) {
                    return function (x, y, angle) {
                        var projectile;
                        projectile = Crafty.e('Sphere, Hostile, Projectile').blink();
                        return projectile.shoot(x, y, angle);
                    };
                })(this)
            });
        }
        return d;
    };

    Shooter.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.movePath([[.5, .625], [.2, .5], [.53, .21], [.90, .54], [.5, .625], [.2, .5], [.53, .21], [.90, .54], [-20, .625]]);
    };

    return Shooter;

})(Game.Scripts.ArmyDrone);

Game.Scripts.CrewShooters = (function (superClass) {
    extend(CrewShooters, superClass);

    function CrewShooters() {
        return CrewShooters.__super__.constructor.apply(this, arguments);
    }

    CrewShooters.prototype.spawn = function () {
        return Crafty.e('Drone, ShootOnSight, ColorEffects, Horizon').drone({
            x: Crafty.viewport.width + 40,
            y: Crafty.viewport.height * .23,
            defaultSpeed: 250
        }).shootOnSight({
            targetType: 'CameraCrew',
            shootWhenHidden: true,
            projectile: (function (_this) {
                return function (x, y, angle) {
                    var projectile;
                    projectile = Crafty.e('Projectile, Color, BackgroundBullet, ColorEffects, Horizon').attr({
                        w: 3,
                        h: 3,
                        z: -200,
                        speed: 300,
                        topDesaturation: 0.5,
                        bottomDesaturation: 0.5
                    }).color('#FFFF00');
                    return projectile.shoot(x, y, angle);
                };
            })(this)
        });
    };

    CrewShooters.prototype.execute = function () {
        this.bindSequence('Destroyed', this.onKilled);
        return this.sequence(this.sendToBackground(0.50, -200), this.parallel(this.movePath([[.96, .64], [.30, .35], [.65, .23], [.93, .43], [.33, .63], [-.33, .23]]), this.sequence(this.wait(2000), this.scale(1.0, {
            duration: 5000
        }), this.reveal(), this.shootPlayer())));
    };

    CrewShooters.prototype.shootPlayer = function () {
        return (function (_this) {
            return function () {
                return _this.entity.shootOnSight({
                    cooldown: 1000 + (Math.random() * 8000),
                    sightAngle: 360,
                    projectile: function (x, y, angle) {
                        var projectile;
                        projectile = Crafty.e('Sphere, Hostile, Projectile').blink();
                        return projectile.shoot(x, y, angle);
                    }
                });
            };
        })(this);
    };

    return CrewShooters;

})(Game.Scripts.ArmyDrone);

// ---
// generated by coffee-script 1.9.2