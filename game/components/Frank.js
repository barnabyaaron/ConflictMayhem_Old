define([
    'underscore',
    'crafty',
    'storage',
    'game/constants/ClassicAlien'
], function (_, Crafty, storage, ClassicAlienConstants) {

    Crafty.c("Frank",
    {
        init: function () {
            this.requires("2D, DOM, SpriteAnimation, Collision, Mouse, frank, Delay");
            this.attr({
                w: 200,
                h: 282,
                visible: false
            });

            this.bind("Click",
                function () {
                    var randomAudio = [
                        "frank_hit1",
                        "frank_hit2",
                        "frank_die",
                        "frank_laugh",
                        "frank_saying1",
                        "frank_saying2"
                    ];

                    var randomImage = [
                        "frank_shoot",
                        "frank_happy",
                        "frank_hit",
                        "frank_dead"
                    ];

                    Crafty.audio.play(randomAudio[Crafty.math.randomInt(0, (randomAudio.length - 1))]);

                    this.sprite(randomImage[Crafty.math.randomInt(0, (randomImage.length - 1))]);
                    this.delay(function() {
                        this.sprite("frank");
                    }, 700, 0);
                });

            return this;
        },
        spawn: function (x, y) {
            this.attr({
                x: x,
                y: y,
                visible: true
            });
            return this;
        }
    });

});