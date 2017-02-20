﻿Crafty.defineScene('Intro', function () {
    var Game, entry, h, offset, w;
    Game = window.Game;
    Game.resetCredits();
    Crafty.background('#000000');
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    w = Crafty.viewport.width;
    h = Crafty.viewport.height;
    offset = .15;
    Crafty.e('2D, DOM, Text, Tween, Delay').attr({
        x: w * (.5 - offset),
        y: h * .4,
        w: 400
    }).text('Speedlazer').textColor('#0000ff').textFont({
        size: '40px',
        weight: 'bold',
        family: 'Press Start 2P'
    }).delay(function () {
        this.tween({
            x: (w * (.5 + offset)) - 400
        }, 2000);
        return this.one('TweenEnd', function () {
            return this.tween({
                x: w * (.5 - offset)
            }, 2000);
        });
    }, 4000, -1);
    Crafty.e('2D, DOM, Text, Tween, Delay').attr({
        x: (w * .5) - 150,
        y: h * .6,
        w: 300
    }).text('Press fire to start!').textColor('#FF0000').textFont({
        size: '15px',
        weight: 'bold',
        family: 'Press Start 2P'
    }).delay(function () {
        this.tween({
            alpha: 0.5
        }, 1000);
        return this.one('TweenEnd', function () {
            return this.tween({
                alpha: 1
            }, 1000);
        });
    }, 2000, -1);
    entry = Game.highscores()[0];
    Crafty.e('2D, DOM, Text').attr({
        x: 0,
        y: h * .85,
        w: w
    }).text("HI SCORE: " + entry.score + " " + entry.initials).textColor('#FFFF00').textAlign('center').textFont({
        size: '10px',
        weight: 'bold',
        family: 'Press Start 2P'
    });
    Crafty('Player').each(function () {
        this.reset();
        return this.one('Activated', function () {
            return Crafty.enterScene(Game.firstLevel);
        });
    });
    return Crafty.e('Delay').delay(function () {
        return Crafty.enterScene('Scores');
    }, 20000);
}, function () {
    Crafty('Delay').each(function () {
        return this.destroy();
    });
    return Crafty('Player').each(function () {
        return this.unbind('Activated');
    });
});

// ---
// generated by coffee-script 1.9.2