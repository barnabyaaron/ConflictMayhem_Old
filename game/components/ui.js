define([
        'underscore',
        'jquery',
        'crafty',
        'game/main'
    ],
    function(_, $, Crafty, Main) {

        Crafty.c("MenuButton",
        {
            init: function() {
                this.requires("2D, DOM, Mouse");
                this.attr({
                    w: 340,
                    h: 60,
                    visible: false
                });
            },
            create: function(type, x, y, clickFunc, text) {
                var menuSprite = "button";
                if (type !== "") {
                    menuSprite = type + "_" + menuSprite;
                }

                if (type === "" || type === "gold") {
                    // Add Text
                    this.addComponent("Text");
                    this.unselectable().textColor('#FFF').textFont({
                        size: '30px',
                        lineHeight: '60px',
                        family: 'KenVector Future'
                    }).textAlign("center");

                    this.text(text);
                }

                this.addComponent(menuSprite);
                this.type = type;
                this.attr({
                    x: x,
                    y: y,
                    visible: true
                });

                this.bind("MouseOver",
                    function() {
                        this.sprite(menuSprite + "_hover");
                    });

                this.bind("MouseOut",
                    function() {
                        this.sprite(menuSprite);
                    });

                this.bind("MouseDown",
                    function() {
                        this.sprite(menuSprite + "_click");
                    });

                this.bind("MouseUp",
                    function() {
                        this.sprite(menuSprite + "_hover");
                    });

                this.bind("Click", clickFunc);

                return this;
            }
        });

        Crafty.c("RoundButton",
        {
            init: function () {
                this.requires("2D, DOM, Mouse");
                return this;
            },
            create: function (type, x, y, clickFunc) {
                var menuSprite = "button_round";
                if (type !== "") {
                    menuSprite = type + "_" + menuSprite;
                }

                this.addComponent(menuSprite);
                this.type = type;
                this.attr({
                    w: 60,
                    h: 60,
                    x: x,
                    y: y
                });

                this.bind("MouseOver",
                    function () {
                        this.sprite(menuSprite + "_hover");
                    });

                this.bind("MouseOut",
                    function () {
                        this.sprite(menuSprite);
                    });

                this.bind("MouseDown",
                    function () {
                        this.sprite(menuSprite + "_click");
                    });

                this.bind("MouseUp",
                    function () {
                        this.sprite(menuSprite + "_hover");
                    });

                this.bind("Click", clickFunc);

                return this;
            },
            setParent: function(parent) {
                this.parent = parent;
                return this;
            }
        });

        Crafty.c("ClassicMenuPanel",
        {
            init: function() {
                this.requires("2D, DOM, panel");
                this.attr({
                    x: Crafty.viewport.width / 2 - 250,
                    y: Crafty.viewport.height /2 - 246.5,
                    w: 500,
                    h: 493
                });

                this.elements = [];

                // Create Header Text
                this.headerText = Crafty.e("2D, DOM, Text")
                    .unselectable()
                    .textColor('#FFF')
                    .textFont({
                        size: '30px',
                        lineHeight: '60px',
                        family: 'KenVector Future'
                    })
                    .textAlign("center")
                    .text("Classic Mode")
                    .attr({
                        x: this.x,
                        y: this.y - 8,
                        w: 500
                    });
                this.elements.push(this.headerText);

                // Add High Scores
                this.highScoreText = Crafty.e("2D, DOM, Text")
                    .unselectable()
                    .textColor('#FFF')
                    .textFont({
                        size: '22px',
                        family: 'KenVector Future'
                    })
                    .text("High Scores")
                    .attr({
                        x: this.x + 30,
                        y: this.y + 80,
                        w: 400
                    });
                this.elements.push(this.highScoreText);

                this.loadingText = Crafty.e("2D, DOM, Text")
                    .unselectable()
                    .textColor('#FFF')
                    .textFont({
                        size: '22px',
                        family: 'KenVector Future'
                    })
                    .text("Loading")
                    .attr({
                        x: this.x + 50,
                        y: this.y + 130,
                        w: 400
                    });
                this.elements.push(this.loadingText);

                // Load Scores
                var self = this;
                $.getJSON("data/classic_high_scores.json", function (data) {
                    self.loadingText.destroy();
                    self.firstText = Crafty.e("2D, DOM, Text")
                    .unselectable()
                    .textColor('#FFD700')
                    .textFont({
                        size: '22px',
                        family: 'KenVector Future'
                    })
                    .text("1st")
                    .attr({
                        x: self.x + 50,
                        y: self.y + 130,
                        w: 400
                    });
                    self.elements.push(self.firstText);

                    var firstPlayer = data.first;
                    self.firstPlayer = Crafty.e("2D, DOM, Text")
                        .unselectable()
                        .textColor('#FFD700')
                        .textFont({
                            size: '22px',
                            family: 'KenVector Future'
                        })
                        .text(firstPlayer.playerName + ": " + firstPlayer.score)
                        .attr({
                            x: self.x + 75,
                            y: self.y + 160,
                            w: 400
                        });
                    self.elements.push(self.firstPlayer);

                    self.firstMedel = Crafty.e("2D, DOM, medal")
                        .attr({
                            x: (self.x + self.w) - 70,
                            y: self.y + 130,
                            w: 50,
                            h: 66
                        });
                    self.elements.push(self.firstMedel);

                    self.secondText = Crafty.e("2D, DOM, Text")
                        .unselectable()
                        .textColor('#C0C0C0')
                        .textFont({
                            size: '22px',
                            family: 'KenVector Future'
                        })
                        .text("2nd")
                        .attr({
                            x: self.x + 50,
                            y: self.y + 200,
                            w: 400
                        });
                    self.elements.push(self.secondText);

                    var secondPlayer = data.second;
                    self.secondPlayer = Crafty.e("2D, DOM, Text")
                        .unselectable()
                        .textColor('#C0C0C0')
                        .textFont({
                            size: '22px',
                            family: 'KenVector Future'
                        })
                        .text(secondPlayer.playerName + ": " + secondPlayer.score)
                        .attr({
                            x: self.x + 75,
                            y: self.y + 230,
                            w: 400
                        });
                    self.elements.push(self.secondPlayer);

                    self.thirdText = Crafty.e("2D, DOM, Text")
                        .unselectable()
                        .textColor('#cd7f32')
                        .textFont({
                            size: '22px',
                            family: 'KenVector Future'
                        })
                        .text("3rd")
                        .attr({
                            x: self.x + 50,
                            y: self.y + 270,
                            w: 400
                        });
                    self.elements.push(self.thirdText);

                    var thirdPlayer = data.third;
                    self.thirdPlayer = Crafty.e("2D, DOM, Text")
                        .unselectable()
                        .textColor('#cd7f32')
                        .textFont({
                            size: '22px',
                            family: 'KenVector Future'
                        })
                        .text(thirdPlayer.playerName + ": " + thirdPlayer.score)
                        .attr({
                            x: self.x + 75,
                            y: self.y + 300,
                            w: 400
                        });
                    self.elements.push(self.thirdPlayer);
                });

                // Add Buttons
                this.playBtn = Crafty.e("MenuButton").create(
                    "",
                    (this.x + (this.w / 2) - 200),
                    (this.y + this.h) - 90,
                    function () {
                        // Start classic mode
                        Crafty.audio.stop('classic_music');
                        Main.changeScene('classic');
                    },
                    'Play');
                this.elements.push(this.playBtn);

                this.closeBtn = Crafty.e("RoundButton").setParent(this).create(
                    "close",
                    (this.x + this.w) - 100,
                    (this.y + this.h) - 90,
                    function () {
                        Crafty.audio.stop('classic_music');
                        this.parent.destroy();
                    }
                );
                this.elements.push(this.closeBtn);

                return this;
            },
            remove: function () {
                _.each(this.elements,
                    function(element) {
                        element.destroy();
                    });
            }
        });

        Crafty.c("LevelCompletePanel",
        {
            init: function() {
                this.requires("2D, DOM, level_complete_panel");
                this.attr({
                    x: Crafty.viewport.width / 2 - 192,
                    y: Crafty.viewport.height / 2 - 189.5,
                    w: 384,
                    h: 379
                });

                this.elements = [];

                // Get Score
                var scoreEl = Crafty("Score").get(0);
                var score = scoreEl.score;

                // Add Panel Elements

                // Score Panel
                this.scoreText = Crafty.e("2D, DOM, Text").attr(
                {
                    x: this.x + 30,
                    y: this.y + 100
                }).unselectable().textColor('#FFFF00').textAlign('left').textFont({
                    size: '24px',
                    family: 'KenVector Future'
                }).text("Score:");
                this.elements.push(this.scoreText);

                this.scorePanel = Crafty.e("2D, DOM, panel_score, Text").attr({
                        x: this.x + 30,
                        y: this.y + 140,
                        w: 325,
                        h: 74
                }).css({
                    'padding-left': '95px'
                }).unselectable().textColor('#FFFF00').textAlign('left').textFont({
                    size: '30px',
                    lineHeight: '74px',
                    family: 'KenVector Future'
                }).text(score);

                this.elements.push(this.scorePanel);

                this.backBtn = Crafty.e("2D, DOM, back_btn, Mouse").attr({
                    x: this.x + 30,
                    y: this.y + this.h - 100,
                    w: 70,
                    h: 71
                }).bind("Click", function() {
                    // Go back to Menu
                    Main.changeScene('menu');
                });
                this.elements.push(this.backBtn);

                this.continueBtn = Crafty.e("2D, DOM, continue_btn, Mouse").attr({
                    x: this.x + this.w - 100,
                    y: this.y + this.h - 100,
                    w: 70,
                    h: 71
                }).bind("Click",
                    function() {
                        // Go to NEXT Level  @TODO go to level 2
                        alert("Level 2 not yet implemented!");
                    });
                this.elements.push(this.continueBtn);
            },
            remove: function() {
                _.each(this.elements,
                    function(element) {
                        element.destroy();
                    });
            }
        });

    });