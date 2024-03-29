﻿define([
        'underscore',
        'crafty',
        'dll',
        'storage',
        'collections/scenes',
        'game/constants/ClassicAlien',
        'game/constants/ClassicAlienShot',
        'game/constants/ClassicExplosion',
        'game/constants/ClassicShip',
        'game/constants/ClassicPlayer',
        'game/constants/PlayerLife',
        'game/constants/Score',
        'game/constants/ClassicShield'
    ],
    function (_, Crafty, DLL, storage, Scenes, ClassicAlienConstants, ClassicAlienShotConstants, ClassicExplosionConstants, ClassicShipConstants, PlayerConstants, PlayerLifeConstants, ScoreConstants, ShieldConstants) {

        var Random = (function () {
            function Random() { }

            Random.getInRange = function (min, max) {
                return Math.random() * (max - min) + min;
            };

            return Random;

        })();

        var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

        var Classic = (function() {
            function Classic(options) {
                this.options = options;
                this.playerRespawning = bind(this.playerRespawning, this);
                this.playerAlienCollision = bind(this.playerAlienCollision, this);
                this.playerHit = bind(this.playerHit, this);
                this.alienShotHit = bind(this.alienShotHit, this);
                this.shieldHit = bind(this.shieldHit, this);
                this.spaceshipHit = bind(this.spaceshipHit, this);
                this.alienHit = bind(this.alienHit, this);
                this.update = bind(this.update, this);
                this.initialize();
            }

            Classic.prototype.initialize = function() {
                this.inputSink = Crafty.e("Keyboard");
                this.player = this.createPlayer();
                this.banner = Crafty.e("Banner");
                this.score = Crafty.e("Score");
                this.lives = Crafty.e("Lives");
                this.spaceship = Crafty.e("ClassicSpaceship");
                this.createAliens();
                this.createAlienShots();
                this.createAlienExplosions();
                this.createShields();

                this.score.bind("LifeIncrement", (function (_this) {
                    return function () {
                        return _this.lives.lifeUp();
                    };
                })(this));
                return this.resetBoard();
            };

            Classic.prototype.resetBoard = function() {
                this.banner.hide();
                this.lives.reset();
                this.player_won = false;
                this.score.reset();
                this.resetAliens();
                this.resetAlienShots();
                this.resetSpaceship();
                this.resetPlayer();
                return this.resetShields();
            };

            Classic.prototype.nextRound = function() {
                this.inputSink.unbind("KeyUp");
                this.banner.hide();
                this.player_won = false;
                this.player.enableShooting();
                this.resetAliens();
                return this.resetAlienShots();
            };

            Classic.prototype.resetSpaceship = function() {
                this.shipSpawnCounter = 0;
                return this.spaceship.hide();
            };

            Classic.prototype.createAliens = function() {
                var alien, alienIndex, column, i, j, leftStart, row, topStart;
                this.alienMoveSoundIndex = 0;
                this.alienPool = [];
                this.aliens = new DLL.DoublyLinkedList();
                leftStart = Crafty.viewport.width / 2 - ClassicAlienConstants.WIDTH * 5.5;
                topStart = 100;
                alienIndex = 0;
                for (column = i = 0; i < 11; column = ++i) {
                    for (row = j = 0; j < 5; row = ++j) {
                        alien = Crafty.e("ClassicAlien")
                            .alien(3 - Math.floor((row + 1) / 2),
                                leftStart + ClassicAlienConstants.WIDTH * column,
                                topStart + ClassicAlienConstants.HEIGHT * row,
                                alienIndex++);
                        this.alienPool.push(alien);
                    }
                }
                return this.alienCount = this.alienPool.length;
            };

            Classic.prototype.resetAliens = function() {
                var alien, i, len, node, ref;
                this.alienMoveCounter = 0;
                this.aliens = new DLL.DoublyLinkedList();
                ref = this.alienPool;
                for (i = 0, len = ref.length; i < len; i++) {
                    alien = ref[i];
                    node = this.aliens.append(alien);
                    alien.respawn().setContainingNode(node);
                }
                return this.updateAlienMoveInterval();
            };

            Classic.prototype.updateAlienMoveInterval = function() {
                return this.alienMoveInterval = ClassicAlienConstants.MOVEMENT_INTERVAL /
                    Math.pow(80, 1 - (this.aliens.size() / this.alienCount));
            };

            Classic.prototype.createAlienShots = function() {
                var _, alienShot, alienShotNode, i, ref, results;
                this.alienShotPool = [];
                this.alienShots = new DLL.DoublyLinkedList();
                results = [];
                for (_ = i = 0, ref = ClassicAlienShotConstants.MAX_SHOTS - 1;
                    0 <= ref ? i <= ref : i >= ref;
                    _ = 0 <= ref ? ++i : --i) {
                    alienShot = Crafty.e("ClassicAlienShot");
                    alienShot.bind("ShieldHit", this.shieldHit);
                    alienShot.bind("PlayerHit", this.playerHit);
                    alienShotNode = this.alienShots.append(alienShot);
                    alienShot.setContainingNode(alienShotNode);
                    alienShot.setContainingList(this.alienShots);
                    results.push(this.alienShotPool.push(alienShot));
                }
                return results;
            };

            Classic.prototype.createAlienExplosions = function() {
                var _, alienExplosion, explosions, i, results;
                explosions = this.alienExplosions = new DLL.DoublyLinkedList();
                results = [];
                for (_ = i = 0; i <= 6; _ = ++i) {
                    alienExplosion = Crafty.e('ClassicExplosion').explosion('classic_alienExplosion', 1, 500, 2);
                    alienExplosion.bind("ExplosionEnded",
                        function() {
                            return explosions.append(this);
                        });
                    results.push(this.alienExplosions.append(alienExplosion));
                }
                return results;
            };

            Classic.prototype.resetAlienShots = function() {
                var alienShot, i, len, ref, results;
                ref = this.alienShotPool;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    alienShot = ref[i];
                    results.push(alienShot.stop());
                }
                return results;
            };

            Classic.prototype.createShields = function() {
                var middle, spacing;
                this.shieldPool = [];
                spacing = 80;
                middle = Crafty.viewport.width / 2;
                this.createShieldFormation(middle - spacing * 3, 500);
                this.createShieldFormation(middle - spacing, 500);
                this.createShieldFormation(middle + spacing, 500);
                return this.createShieldFormation(middle + spacing * 3, 500);
            };

            Classic.prototype.createShieldFormation = function(x, y) {
                var coordinate, coordinates, i, len, results, shieldBlock, size;
                size = ShieldConstants.WIDTH;
                coordinates = [
                    [x - 0.5 * size, y - 2 * size], [x - 1.5 * size, y - 2 * size], [x + 0.5 * size, y - 2 * size],
                    [x - 1.5 * size, y - size], [x + 0.5 * size, y - size], [x - 2.5 * size, y - size],
                    [x + 1.5 * size, y - size], [x - 2.5 * size, y], [x + 1.5 * size, y]
                ];
                results = [];
                for (i = 0, len = coordinates.length; i < len; i++) {
                    coordinate = coordinates[i];
                    shieldBlock = Crafty.e("ClassicShield");
                    results.push(this.shieldPool.push(shieldBlock.shield.apply(shieldBlock, coordinate)));
                }
                return results;
            };

            Classic.prototype.resetShields = function() {
                var i, len, ref, results, shield;
                ref = this.shieldPool;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    shield = ref[i];
                    results.push(shield.respawn());
                }
                return results;
            };

            Classic.prototype.leftmostAlien = function() {
                return this.aliens.head().data;
            };

            Classic.prototype.rightmostAlien = function() {
                return this.aliens.tail().data;
            };

            Classic.prototype.update = function(updateData) {
                if (this.handleAlienMovement(updateData.dt)) {
                    if (!this.player.isDead()) {
                        this.handleAlienShots();
                    }
                }
                if (!this.player_won) {
                    return this.handleShipSpawning(updateData.dt);
                }
            };

            Classic.prototype.handleShipSpawning = function(dt) {
                if (this.shipSpawnCounter < ClassicShipConstants.SPAWN_CHANCE_INTERVAL) {
                    if (!this.spaceship.isFlying()) {
                        return this.shipSpawnCounter += dt;
                    }
                } else {
                    this.shipSpawnCounter = 0;
                    if (Random.getInRange(0, 100) < ClassicShipConstants.SPAWN_CHANCE) {
                        return this.spaceship.flyTowards(Math.round(Math.random()) ? 'w' : 'e');
                    }
                }
            };

            Classic.prototype.handleAlienMovement = function(dt) {
                var alien, alienNode;
                if (this.alienMoveCounter < this.alienMoveInterval) {
                    this.alienMoveCounter += dt;
                    return false;
                } else {
                    this.alienMoveCounter = 0;
                    alienNode = this.aliens.head();
                    if (!alienNode) {
                        return false;
                    }
                    if (this.aliensMovingOutsideScreen()) {
                        while (alienNode) {
                            alien = alienNode.data;
                            alien.descend();
                            if (alien.y + ClassicAlienConstants.HEIGHT > Crafty.viewport.height) {
                                alien.dieSilently();
                                this.lives.deplete();
                                this.player.die();
                            }
                            alienNode = alienNode.next;
                        }
                    } else {
                        while (alienNode) {
                            alienNode.data.advance();
                            alienNode = alienNode.next;
                        }
                    }
                    this.alienMoveSoundIndex = (this.alienMoveSoundIndex + 1) % 2;

                    this.alienMoveSoundId = Crafty.audio.play("classic_alien_move" + this.alienMoveSoundIndex);
                    
                    return true;
                }
            };

            Classic.prototype.handleAlienShots = function() {
                var alienNode, results, shotNode;

                alienNode = this.aliens.head();
                results = [];
                while (alienNode && this.alienShots.size() > 0) {
                    if (Random.getInRange(0, 100) < ClassicAlienShotConstants.BASE_SHOT_CHANCE) {
                        shotNode = this.alienShots.head();
                        if (!shotNode) {
                            continue;
                        }
                        shotNode.data.fireBy(alienNode.data);
                    }
                    results.push(alienNode = alienNode.next);
                }
                return results;
            };

            Classic.prototype.aliensMovingOutsideScreen = function () {
                return (this.leftmostAlien().direction === 'w' &&
                        (this.leftmostAlien().x - ClassicAlienConstants.HORIZONTAL_SPEED < 0)) ||
                    (this.rightmostAlien().direction === 'e' &&
                    (this.rightmostAlien().x + ClassicAlienConstants.WIDTH + ClassicAlienConstants.HORIZONTAL_SPEED >
                        Crafty.viewport.width));
            };

            Classic.prototype.alienHit = function(alien) {
                var alienExplosionNode, pointsGained;
                pointsGained = alien.pointsWorth();
                this.score.addScore(pointsGained);
                alienExplosionNode = this.alienExplosions.head();
                alienExplosionNode.remove();
                alienExplosionNode.data.explosionText("" + pointsGained, '#FFFFFF', 10).explodeAt(alien.x, alien.y);
                alien.die();
                this.updateAlienMoveInterval();
                if (this.aliens.size() === 0) {
                    return this.victory();
                }
            };

            Classic.prototype.spaceshipHit = function(hitDataArray) {
                var playerShot, pointsGained, spaceship;
                playerShot = hitDataArray[0];
                spaceship = hitDataArray[1];
                pointsGained = spaceship.pointsWorth(playerShot);
                this.score.addScore(pointsGained);
                return spaceship.destroy(pointsGained);
            };

            Classic.prototype.shieldHit = function(shield) {
                return shield.degrade();
            };

            Classic.prototype.alienShotHit = function(alienShot) {
                this.score.addScore(alienShot.pointsWorth());
                return alienShot.die();
            };

            Classic.prototype.playerHit = function(player) {
                if (this.player.die()) {
                    return this.lives.lifeDown();
                }
            };

            Classic.prototype.playerAlienCollision = function (alien) {
                if (this.player.die()) {
                    return this.lives.deplete();
                }
            };

            Classic.prototype.createPlayer = function() {
                var player = Crafty.e("ClassicPlayer");

                player.bind("AlienHit", this.alienHit);
                player.bind("SpaceshipHit", this.spaceshipHit);
                player.bind("ShieldHit", this.shieldHit);
                player.bind("AlienShotHit", this.alienShotHit);
                player.bind("Respawning", this.playerRespawning);
                player.bind("HitByAlien", this.playerAlienCollision);

                player.setPosition(Crafty.viewport.width / 2 - PlayerConstants.WIDTH / 2,
                    Crafty.viewport.height - PlayerConstants.HEIGHT);
                player.show();
                player.enableControl();
                return player;
            };

            Classic.prototype.resetPlayer = function() {
                this.player.destroy();
                this.player = this.createPlayer();
            };

            Classic.prototype.playerRespawning = function(player) {
                if (this.lives.lives === 0) {
                    return this.gameOver();
                } else {
                    this.resetPlayer();
                }
            };

            Classic.prototype.gameOver = function() {
                this.player.hide();
                this.player.disableControl();
                this.banner.show("Game Over",
                    "Final score - " + (this.score.getScore()) + "<br>Press enter to try again",
                    500,
                    200,
                    600,
                    400);
                return this.inputSink.one("KeyUp",
                (function(_this) {
                    return function (e) {
                        if (e.key === Crafty.keys.ENTER) {
                            return _this.resetBoard();
                        }
                    };
                })(this));
            };

            Classic.prototype.victory = function () {
                if (storage.get('classic_mode') === true) {
                    this.banner.show("Victory",
                    "Well done, but more aliens are inbound!<br>Press enter to persevere",
                    500,
                    200,
                    600,
                    300);
                    this.player.disableShooting();
                    this.player_won = true;
                    return this.inputSink.bind("KeyUp",
                    (function (_this) {
                        return function (e) {
                            if (e.key === Crafty.keys.ENTER) {
                                return _this.nextRound();
                            }
                        };
                    })(this));
                } else {
                    storage.set("level", 2);
                    storage.set("classic_mode_unlocked", true);

                    // @TODO Display Level Complete Panel
                    var levelCompletePanel = Crafty.e("LevelCompletePanel");
                    //this.options.changeScene('menu'); // Temp return to menu
                }
            };

            return Classic;
        })();

        return Classic;
    });