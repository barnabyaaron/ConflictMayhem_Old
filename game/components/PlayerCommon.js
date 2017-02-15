define([
    'underscore',
    'crafty',
    'game/constants/Player'
], function (_, Crafty, PlayerConstants) {

    Crafty.c('PlayerCommon',
    {
        init: function () {
            this.tmp = null;
            this.requires("2D, DOM, Multiway");
            this.multiway(PlayerConstants.SPEED,
            {
                LEFT_ARROW: 180,
                RIGHT_ARROW: 0
            });
            this.bind("NewDirection",
                function (info) {
                    return this.direction = info;
                });
            return this.bind("Moved",
                function (info) {
                    if (this.movingOutsidePlayfield(info.x, this.direction)) {
                        return this.attr({
                            x: info.x,
                            y: info.y
                        });
                    }
                });
        },
        movingOutsidePlayfield: function (x, direction) {
            this.tmp = x + direction.x;
            return (this.tmp < 0) || (this.tmp + this._w > Crafty.viewport.width);
        }
    });

});