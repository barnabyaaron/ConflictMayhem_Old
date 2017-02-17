define([
        'underscore',
        'crafty',
        'storage',
        'require',
        'game/classes/classic'
], function (_, Crafty, storage, require) {
    var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

    var Scene = {
        name: "intro",
        init: function (options) {
            storage.set("classic_mode", false);
            storage.set("level", 1);

            Crafty.background('#000 url(assets/images/black.png) repeat left top');

            var ctrl = require('game/classes/classic');
            this.Ctrl = new ctrl(options);

            Crafty.bind("EnterFrame", this.Ctrl.update);
        },
        uninit: function () { }
    };

    return Scene;
});