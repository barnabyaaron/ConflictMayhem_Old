define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('PlayerInfo', {
            init: function () {
                this.requires('2D, Listener');
                this.boosts = {};
                return this.visible = true;
            },
            playerInfo: function (x, player) {
                this.player = player;
                this.score = Crafty.e('2D, Text, UILayerDOM').attr({
                    w: 220,
                    h: 20,
                    x: x,
                    y: 10,
                    z: 200
                }).textFont({
                    size: '10px',
                    family: 'Press Start 2P'
                });
                if (this.player.has('Color')) {
                    this.score.textColor(this.player.color());
                }
                this.lives = Crafty.e('2D, Text, UILayerDOM').attr({
                    w: 220,
                    h: 20,
                    x: x,
                    y: 30,
                    z: 200
                }).textFont({
                    size: '10px',
                    family: 'Press Start 2P'
                });
                this.heart = Crafty.e('2D, ColorEffects, heart, UILayerWebGL').attr({
                    w: 16,
                    h: 16,
                    x: x - 2,
                    y: 26,
                    z: 200
                }).colorOverride(player.color(), 'partial');
                if (this.player.has('Color')) {
                    this.lives.textColor(player.color());
                }
                this.updatePlayerInfo();
                this.createBoostsVisuals(x);
                this.listenTo(player, 'UpdateLives', this.updatePlayerInfo);
                this.listenTo(player, 'UpdatePoints', this.updatePlayerInfo);
                this.listenTo(player, 'Activated', (function (_this) {
                    return function () {
                        return _this.updatePlayerInfo();
                    };
                })(this));
                this.listenTo(player, 'Deactivated', (function (_this) {
                    return function () {
                        return _this.updatePlayerInfo();
                    };
                })(this));
                this.listenTo(player, 'GameLoop', (function (_this) {
                    return function () {
                        return _this.updateBoostInfo();
                    };
                })(this));
                return this;
            },
            setVisibility: function (visibility) {
                return this.visible = visibility;
            },
            createBoostsVisuals: function (x) {
                var playerColor;
                playerColor = this.player.color();
                this.boosts['speedb'] = Crafty.e('2D, UILayerWebGL, speedBoost, ColorEffects').attr({
                    w: 16,
                    h: 16
                }).attr({
                    x: x + 50,
                    y: 29,
                    z: 200
                }).colorOverride(playerColor, 'partial');
                this.boosts['rapidb'] = Crafty.e('2D, UILayerWebGL, rapidFireBoost, ColorEffects').attr({
                    w: 16,
                    h: 16
                }).attr({
                    x: x + 70,
                    y: 28,
                    z: 200
                }).colorOverride(playerColor, 'partial');
                this.boosts['aimb'] = Crafty.e('2D, UILayerWebGL, aimBoost, ColorEffects').attr({
                    w: 16,
                    h: 16
                }).attr({
                    x: x + 90,
                    y: 28,
                    z: 200
                }).colorOverride(playerColor, 'partial');
                return this.boosts['damageb'] = Crafty.e('2D, UILayerWebGL, damageBoost, ColorEffects').attr({
                    w: 16,
                    h: 16
                }).attr({
                    x: x + 110,
                    y: 28,
                    z: 200
                }).colorOverride(playerColor, 'partial');
            },
            updateBoostInfo: function () {
                var alpha, boost, e, n, ref, ref1, results, stats, timing;
                ref = this.boosts;
                for (n in ref) {
                    e = ref[n];
                    e.attr({
                        alpha: 0
                    });
                }
                if (!this.player.has('ControlScheme')) {
                    return;
                }
                if (this.visibile === false) {
                    return;
                }
                if (this.player.ship != null) {
                    stats = this.player.ship.stats();
                    ref1 = stats.primary.boostTimings;
                    results = [];
                    for (boost in ref1) {
                        timing = ref1[boost];
                        alpha = 1;
                        if (timing < 2000) {
                            if (Math.floor(timing / 200) % 2 === 0) {
                                alpha = 0;
                            }
                        }
                        results.push(this.boosts[boost].attr({
                            alpha: alpha
                        }));
                    }
                    return results;
                }
            },
            updatePlayerInfo: function () {
                var e, n, ref, results, text;
                if (this.player.has('ControlScheme')) {
                    this.score.text('Score: ' + this.player.points);
                } else {
                    this.score.text(this.player.name);
                }
                if (this.player.has('ControlScheme')) {
                    if (this.player.lives === 0) {
                        this.lives.text('Game Over');
                        return this.heart.attr({
                            alpha: 0,
                            visible: false
                        });
                    } else {
                        if (this.visibile === true) {
                            this.heart.attr({
                                alpha: 1
                            });
                        }
                        this.heart.attr({
                            visible: true
                        });
                        text = this.player.lives - 1;
                        if (text === Infinity) {
                            text = 'Demo mode';
                        }
                        return this.lives.text('&nbsp;  ' + text);
                    }
                } else {
                    this.lives.text('Press fire to start!');
                    this.heart.attr({
                        alpha: 0,
                        visible: false
                    });
                    ref = this.boosts;
                    results = [];
                    for (n in ref) {
                        e = ref[n];
                        results.push(e.attr({
                            alpha: 0
                        }));
                    }
                    return results;
                }
            }
        });
    });