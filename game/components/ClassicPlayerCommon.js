define([
    'underscore',
    'crafty',
    'game/constants/ClassicPlayer'
], function (_, Crafty, ClassicPlayerConstants) {

    Crafty.c('ClassicPlayerCommon',
    {
        init: function () {
            this.tmp = null;
            this.requires("2D, DOM, Multiway");
            this.multiway(ClassicPlayerConstants.SPEED,
            {
                LEFT_ARROW: 180,
                RIGHT_ARROW: 0,
                D: 0,
                A: 180
            });
            this.bind("NewDirection",
                function (info) {
                    return this.direction = info;
                });
            return this.bind("Moved",
                function (from) {
                    if (this.movingOutsidePlayfield(from.oldValue, this.direction)) {
                        return this.attr({
                            x: from.oldValue
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