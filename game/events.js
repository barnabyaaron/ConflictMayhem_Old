define([
        'underscore',
        'crafty'
], function (_, Crafty) {
    return {
        init: function () {
            this.playerRespawning = bind(this.playerRespawning, this);
            this.playerAlienCollision = bind(this.playerAlienCollision, this);
            this.playerHit = bind(this.playerHit, this);
            this.alienShotHit = bind(this.alienShotHit, this);
            this.shieldHit = bind(this.shieldHit, this);
            this.spaceshipHit = bind(this.spaceshipHit, this);
            this.alienHit = bind(this.alienHit, this);
            this.update = bind(this.update, this);
        }
    };
});