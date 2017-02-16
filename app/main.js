﻿// ----------------------------- \\
// Conflict Mayhem
// @author aaron.barnaby
// @date Febuary 2017
// ----------------------------- \\

requirejs.config({
    paths: {
        underscore: '../libs/underscore/underscore',
        backbone: '../libs/backbone/backbone-min',
        crafty: '../libs/crafty/crafty',
        store: '../libs/store/store-min',
        dll: '../libs/DLL/doublylinkedlist',
        game: '../game',
        libs: '../libs'
    },
    shim: {
        underscore: { exports: '_' },
        crafty: { exports: "Crafty" },
        backbone: {
            deps: ['underscore'],
            exports: "Backbone"
        },
        dll: { exports: "DLL" }
    }
});

requirejs(['app', 'game/components'], function (App) { App.initialize(); });