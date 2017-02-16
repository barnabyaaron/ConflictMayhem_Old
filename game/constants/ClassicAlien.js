define(function() {
    return {
        IDLE_X: -200,
        IDLE_Y: 400,
        WIDTH: 48,
        HEIGHT: 48,
        HORIZONTAL_SPEED: 10,
        VERTICAL_SPEED: 25,
        MOVEMENT_INTERVAL: 2000,
        HITBOX: {
            1: (function () {
                return [8, 8, 39, 8, 39, 37, 8, 37];
            }),
            2: (function () {
                return [8, 8, 39, 8, 39, 37, 8, 37];
            }),
            3: (function () {
                return [8, 8, 39, 8, 39, 37, 8, 37];
            })
        }
    };
});