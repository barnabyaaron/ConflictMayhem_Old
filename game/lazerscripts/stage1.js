var Game,
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Game = this.Game;

Game.Scripts || (Game.Scripts = {});

Game.Scripts.Stage1 = (function (superClass) {
    extend(Stage1, superClass);

    function Stage1() {
        return Stage1.__super__.constructor.apply(this, arguments);
    }

    Stage1.prototype.nextScript = 'Stage2';

    Stage1.prototype.assets = function () {
        return this.loadAssets('explosion', 'playerShip', 'general');
    };

    Stage1.prototype.execute = function () {
        this.inventoryAdd('weapon', 'lasers', {
            marking: 'L'
        });
        this.inventoryAdd('ship', 'life', {
            marking: '❤',
            icon: 'heart'
        });
        this.inventoryAdd('ship', 'points', {
            marking: 'P',
            icon: 'star'
        });
        this.inventoryAdd('weaponUpgrade', 'rapid', {
            marking: 'RF',
            icon: 'rapidFireBoost'
        });
        this.inventoryAdd('weaponUpgrade', 'damage', {
            marking: 'D',
            icon: 'damageBoost'
        });
        this.inventoryAdd('weaponUpgrade', 'aim', {
            marking: 'A',
            icon: 'aimBoost'
        });
        this.inventoryAdd('weaponUpgrade', 'speed', {
            marking: 'S',
            icon: 'speedBoost'
        });
        this.inventoryAdd('weaponBoost', 'rapidb', {
            marking: 'RF',
            icon: 'rapidFireBoost'
        });
        this.inventoryAdd('weaponBoost', 'aimb', {
            marking: 'A',
            icon: 'aimBoost'
        });
        this.inventoryAdd('weaponBoost', 'speedb', {
            marking: 'S',
            icon: 'speedBoost'
        });
        this.inventoryAdd('weaponBoost', 'damageb', {
            marking: 'D',
            icon: 'damageBoost'
        });
        return this.sequence(this.setPowerupPool('rapidb', 'speed', 'points', 'rapidb'), this.introText(), this.tutorial(), this.setPowerupPool('aimb', 'speedb', 'rapidb', 'speed', 'aim', 'rapid'), this.droneTakeover(), this.oceanFighting(), this.setPowerupPool('aim', 'speedb', 'rapidb', 'rapid', 'rapidb', 'aimb'), this.enteringLand(), this.cityBay(), this.setPowerupPool('speed', 'rapid', 'aim', 'speed', 'rapid', 'aim'), this.midstageBossfight(), this.bossfightReward(), this.skylineFighting(), this.highSkylineFighting());
    };

    Stage1.prototype.introText = function () {
        return this.sequence(this.setWeapons(['lasers']), this.setSpeed(100), this.setScenery('Intro'), this.sunRise(), this.cameraCrew(), this.async(this.runScript(Game.Scripts.IntroBarrel)), this["if"]((function () {
            return this.player(1).active && this.player(2).active;
        }), this.say('General', 'Time to get the last 2 ships to the factory\n' + 'to install the AI controlled defence systems', {
            noise: 'low'
        }), this.say('General', 'Time to get the last ship to the factory\n' + 'to install the AI controlled defence systems', {
            noise: 'low'
        })));
    };

    Stage1.prototype.tutorial = function () {
        return this.sequence(this.setSpeed(200), this.setScenery('Ocean'), this.say('General', 'We send some drones for some last manual target practice', {
            noise: 'low'
        }), this.parallel(this.showText('Get Ready', {
            color: '#00FF00',
            mode: 'blink',
            blink_amount: 3,
            blink_speed: 300
        }), this.say('John', 'Let\'s go!')), this.parallel(this.gainHeight(150, {
            duration: 4000
        }), this.repeat(2, this.sequence(this.placeSquad(Game.Scripts.Swirler, {
            amount: 6,
            delay: 250,
            drop: 'pool'
        }), this.wait(1000)))), this.say('General', 'Great job, now get the ship to the defence factory in the city\n' + 'We will send some more target practice', {
            noise: 'low'
        }), this.placeSquad(Game.Scripts.Shooter, {
            amount: 6,
            delay: 500,
            drop: 'pool'
        }));
    };

    Stage1.prototype.droneTakeover = function () {
        return this.sequence(this.parallel(this.say('John', 'What are those drones doing there!?'), this.placeSquad(Game.Scripts.CrewShooters, {
            amount: 4,
            delay: 750,
            drop: 'pool'
        })), this.say('General', 'They do not respond to our commands anymore!\nOur defence AI has been hacked!', {
            noise: 'low'
        }), this.async(this.chapterTitle(1, 'Hacked')));
    };

    Stage1.prototype.cameraCrew = function () {
        return this.async(this.placeSquad(Game.Scripts.CameraCrew));
    };

    Stage1.prototype.oceanFighting = function () {
        return this.sequence(this.checkpoint(this.checkpointStart('Ocean', 45000)), this.parallel(this.sequence(this.wait(2000), this.say('General', 'We\'re under attack!?!', {
            noise: 'low'
        })), this.swirlAttacks()), this.setScenery('CoastStart'), this.swirlAttacks(), this.parallel(this.gainHeight(-150, {
            duration: 4000
        }), this.sequence(this.wait(2000), this.underWaterAttacks())));
    };

    Stage1.prototype.enteringLand = function () {
        return this.sequence(this.checkpoint(this.checkpointStart('CoastStart', 93000)), this.setScenery('BayStart'), this.mineSwarm(), this.underWaterAttacks());
    };

    Stage1.prototype.cityBay = function () {
        return this.sequence(this.checkpoint(this.checkpointStart('Bay', 131000)), this.setScenery('UnderBridge'), this.parallel(this.placeSquad(Game.Scripts.Stalker, {
            drop: 'pool'
        }), this.mineSwarm({
            direction: 'left'
        })), this.sequence(this.stalkerShootout(), this.parallel(this.placeSquad(Game.Scripts.Stalker, {
            drop: 'pool'
        }), this.mineSwarm({
            direction: 'left'
        }))));
    };

    Stage1.prototype.midstageBossfight = function () {
        return this.sequence(this.checkpoint(this.checkpointStart('BayFull', 168000)), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'pool',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'pool',
            inFrontOf: this.player(2)
        }))), this.mineSwarm({
            direction: 'left'
        }), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'pool',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'pool',
            inFrontOf: this.player(2)
        }))), this.parallel(this.mineSwarm(), this.sequence(this.wait(5000), this.setScenery('UnderBridge'))), this.async(this.showText('Warning!', {
            color: '#FF0000',
            mode: 'blink'
        })), this["while"](this.waitForScenery('UnderBridge', {
            event: 'enter'
        }), this.waitingRocketStrike()), this.setSpeed(75), this.waitForScenery('UnderBridge', {
            event: 'inScreen'
        }), this.setSpeed(0), this.checkpoint(this.checkpointStart('UnderBridge', 203000)), this.placeSquad(Game.Scripts.Stage1BossStage1), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'life',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'life',
            inFrontOf: this.player(2)
        }))), this.setSpeed(200), this.wait(500), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'rapidb',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'rapidb',
            inFrontOf: this.player(2)
        }))), this.wait(500), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'speedb',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'speedb',
            inFrontOf: this.player(2)
        }))));
    };

    Stage1.prototype.waitingRocketStrike = function () {
        return this.sequence(this.placeSquad(Game.Scripts.Stage1BossRocketStrike, {
            amount: 6,
            delay: 150,
            options: {
                gridConfig: {
                    x: {
                        start: 1.1,
                        steps: 1,
                        stepSize: 0.05
                    },
                    y: {
                        start: 0.125,
                        steps: 12,
                        stepSize: 0.05
                    }
                }
            }
        }), this.wait(200));
    };

    Stage1.prototype.swirlAttacks = function () {
        return this.attackWaves(this.parallel(this.repeat(2, this.placeSquad(Game.Scripts.Swirler, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        })), this.repeat(2, this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        }))), {
            drop: 'pool'
        });
    };

    Stage1.prototype.underWaterAttacks = function () {
        return this.sequence(this.placeSquad(Game.Scripts.Stalker, {
            drop: 'pool'
        }), this.repeat(2, this.stalkerShootout()));
    };

    Stage1.prototype.sunRise = function (options) {
        if (options == null) {
            options = {
                skipTo: 0
            };
        }
        return this.async(this.runScript(Game.Scripts.SunRise, _.extend({
            speed: 2
        }, options)));
    };

    Stage1.prototype.mineSwarm = function (options) {
        var ref;
        if (options == null) {
            options = {
                direction: 'right'
            };
        }
        return this.placeSquad(Game.Scripts.JumpMine, {
            amount: 20,
            delay: 100,
            options: {
                gridConfig: {
                    x: {
                        start: 0.1,
                        steps: 16,
                        stepSize: 0.05
                    },
                    y: {
                        start: 0.125,
                        steps: 12,
                        stepSize: 0.05
                    }
                },
                points: (ref = options.points) != null ? ref : true,
                direction: options.direction
            }
        });
    };

    Stage1.prototype.stalkerShootout = function () {
        return this.parallel(this.placeSquad(Game.Scripts.Stalker, {
            drop: 'pool'
        }), this.attackWaves(this.parallel(this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        }), this.placeSquad(Game.Scripts.Swirler, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        })), {
            drop: 'pool'
        }));
    };

    Stage1.prototype.bossfightReward = function () {
        return this.sequence(this.checkpoint(this.checkpointMidStage('BayFull', 400000)), this.say('General', 'Hunt him down! We need that AI control back!', {
            noise: 'low'
        }), this.setSpeed(200), this.setPowerupPool('rapidb', 'speedb', 'aimb', 'speed', 'rapidb'), this.parallel(this.sequence(this.wait(4000), this.gainHeight(800, {
            duration: 14000
        })), this.sequence(this.stalkerShootout(), this.setScenery('Skyline'), this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            drop: 'pool',
            options: {
                shootOnSight: true
            }
        }), this.attackWaves(this.parallel(this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        }), this.placeSquad(Game.Scripts.Swirler, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        })), {
            drop: 'pool'
        }))));
    };

    Stage1.prototype.skylineFighting = function () {
        return this.sequence(this.setSpeed(100), this.checkpoint(this.checkpointMidStage('Skyline', 450000)), this.changeSeaLevel(500), this.setPowerupPool('damageb', 'damage', 'aimb', 'rapidb', 'damage', 'damageb'), this.attackWaves(this.parallel(this.placeSquad(Game.Scripts.ScraperFlyer, {
            amount: 8,
            delay: 500
        }), this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        })), {
            drop: 'pool'
        }), this.parallel(this.attackWaves(this.parallel(this.placeSquad(Game.Scripts.ScraperFlyer, {
            amount: 8,
            delay: 500
        }), this.placeSquad(Game.Scripts.Shooter, {
            amount: 8,
            delay: 500,
            options: {
                shootOnSight: true
            }
        })), {
            drop: 'pool'
        }), this.cloneEncounter()), this.placeSquad(Game.Scripts.Stage1BossPopup), this.setScenery('Skyline'), this.parallel(this.attackWaves(this.sequence(this.placeSquad(Game.Scripts.ScraperFlyer, {
            amount: 6,
            delay: 500
        }), this.placeSquad(Game.Scripts.ScraperFlyer, {
            amount: 8,
            delay: 500
        })), {
            drop: 'pool'
        }), this.sequence(this.wait(3000), this.placeSquad(Game.Scripts.Shooter, {
            amount: 4,
            delay: 750,
            drop: 'pool',
            options: {
                shootOnSight: true
            }
        }), this.placeSquad(Game.Scripts.HeliAttack, {
            drop: 'pool'
        }))));
    };

    Stage1.prototype.highSkylineFighting = function () {
        return this.sequence(this.parallel(this.placeSquad(Game.Scripts.Stage1BossPopup), this.cloneEncounter()), this.gainHeight(300, {
            duration: 4000
        }), this.checkpoint(this.checkpointEndStage('Skyline', 500000)), this.parallel(this.repeat(2, this.cloneEncounter()), this.placeSquad(Game.Scripts.HeliAttack, {
            drop: 'pool',
            amount: 2,
            delay: 5000
        })), this.async(this.showText('Warning!', {
            color: '#FF0000',
            mode: 'blink'
        })), this.setScenery('SkylineBase'), this["while"](this.wait(3000), this.waitingRocketStrike()), this.placeSquad(Game.Scripts.Stage1BossLeaving), this.say('General', 'He is going to the military complex!\nBut we cant get through those shields now...', {
            noise: 'low'
        }));
    };

    Stage1.prototype.cloneEncounter = function () {
        return this.attackWaves(this.parallel(this.sequence(this.wait(4000), this.placeSquad(Game.Scripts.PlayerClone, {
            options: {
                from: 'top'
            }
        })), this.placeSquad(Game.Scripts.PlayerClone, {
            options: {
                from: 'bottom'
            }
        })), {
            drop: 'pool'
        });
    };

    Stage1.prototype.checkpointStart = function (scenery, sunSkip) {
        return this.sequence(this.setScenery(scenery), this.sunRise({
            skipTo: sunSkip
        }), this.wait(2000));
    };

    Stage1.prototype.checkpointMidStage = function (scenery, sunSkip) {
        return this.sequence(this.setScenery(scenery), this.sunRise({
            skipTo: sunSkip
        }), this.wait(2000));
    };

    Stage1.prototype.checkpointEndStage = function (scenery, sunSkip) {
        return this.sequence(this.setScenery(scenery), this.sunRise({
            skipTo: sunSkip
        }), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'damage',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'damage',
            inFrontOf: this.player(2)
        }))), this.wait(2000), this.parallel(this["if"]((function () {
            return this.player(1).active;
        }), this.drop({
            item: 'rapid',
            inFrontOf: this.player(1)
        })), this["if"]((function () {
            return this.player(2).active;
        }), this.drop({
            item: 'speed',
            inFrontOf: this.player(2)
        }))));
    };

    return Stage1;

})(Game.LazerScript);

// ---
// generated by coffee-script 1.9.2