define([
        'underscore',
        'crafty',
        'require',
        'core',
        'game/ext/test'
    ],
    function (_, Crafty, require) {

        var GameCore = require('core');
        var Game = new GameCore();

        // Extensions
        Game.TestExt = require('game/ext/test');

        return Game;

    });