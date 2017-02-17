define([
    'underscore',
    'crafty',
    'game/constants/Score'
], function (_, Crafty, ScoreConstants) {

    Crafty.c('Score',
    {
        init: function() {
            this.score = 0;
            this.requires("2D, DOM, score_bar, Text");
            this.attr({
                x: ScoreConstants.MARGIN_X,
                y: ScoreConstants.MARGIN_Y,
                w: 160,
                h: 55
            }).css({
                'padding-left': '60px'
            });
            return this.updateScore()
                .unselectable()
                .textColor('#FFFF00')
                .textAlign('left')
                .textFont({
                    size: '16px',
                    lineHeight: '55px',
                    family: 'KenVector Future'
                });
        },
        reset: function() {
            this.score = 0;
            return this.updateScore();
        },
        addScore: function(add) {
            if (Math.floor((this.score + add) / ScoreConstants.LIFE_GAIN_SCORE) > Math.floor(this.score / ScoreConstants.LIFE_GAIN_SCORE)) {
                this.trigger("LifeIncrement", this);
            }
            this.score += add;
            return this.updateScore();
        },
        updateScore: function() {
            return this.text(this.score);
        },
        getScore: function() {
            return this.score;
        }
    });

});