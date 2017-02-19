define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Player', {
            init: function () {
                return this.reset();
            },
            reset: function () {
                this.softReset();
                return this.removeComponent('ControlScheme');
            },
            softReset: function () {
                this.stats = {
                    shotsFired: 0,
                    shotsHit: 0,
                    enemiesKilled: 0,
                    bonus: 0
                };
                return this.attr({
                    lives: 3,
                    points: 0
                });
            },
            loseLife: function () {
                if (!(this.lives > 0)) {
                    return;
                }
                this.lives -= 1;
                this.trigger('UpdateLives', {
                    lives: this.lives
                });
                if (this.lives <= 0) {
                    return Crafty.trigger('PlayerDied', this);
                }
            },
            gainLife: function () {
                this.lives += 1;
                return this.trigger('UpdateLives', {
                    lives: this.lives
                });
            },
            eligibleForExtraLife: function () {
                this.lastExtraLifeThreshold || (this.lastExtraLifeThreshold = 0);
                if (this.points - this.lastExtraLifeThreshold >= 10000) {
                    return true;
                }
            },
            rewardExtraLife: function () {
                return this.lastExtraLifeThreshold = this.points;
            },
            addPoints: function (amount, location) {
                if (!(this.lives > 0)) {
                    return;
                }
                if (location && amount > 0) {
                    this.ship.scoreText("+" + amount, {
                        location: location,
                        attach: false,
                        duration: 200,
                        distance: 30,
                        delay: 10
                    });
                }
                this.points += amount;
                return this.trigger('UpdatePoints', {
                    points: this.points
                });
            }
        });
    });