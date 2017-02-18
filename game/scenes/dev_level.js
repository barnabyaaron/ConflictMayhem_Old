﻿define([
        'underscore',
        'crafty',
        'storage',
        'require'
], function (_, Crafty, storage, require) {

    var Scene = {
        name: "dev_level",
        init: function (options) {
            var self = this;
            
            Crafty.background('#000 url(assets/images/black.png) repeat left top');

            Crafty.e("2D, DOM, Text").attr({
                x: 10,
                y: 5,
                w: 300
            }).unselectable().textColor('#FFF').textFont({
                size: '30px',
                family: 'KenVector Future'
            }).text("Dev Level");

            if (storage.get('DEBUG_MODE') === true) {
                Crafty.bind("KeyDown",
                    function (e) {
                        if (e.key === Crafty.keys.F10) {
                            // Return to Menu
                            options.changeScene('menu');
                        }
                    });
            }


            // Create Frank
            var frank = Crafty.e("Frank");
            frank.spawn(100, 100);
        },
        uninit: function () { }
    };

    return Scene;
});