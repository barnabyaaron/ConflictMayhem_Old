define([
    'underscore',
    'crafty',
    'storage',
    'game/constants/ClassicPlayer'
], function (_, Crafty, storage, ClassicPlayerConstants) {

    Crafty.c('ClassicPlayer',
    {
        init: function() {
            this.requires('Keyboard');
            this.body = Crafty.e('ClassicPlayerBody');
            this.cannon = Crafty.e('ClassicPlayerCannon');
            this.shot = Crafty.e('ClassicPlayerShot');
            this.explosion = Crafty.e('ClassicExplosion').explosion('classic_playerExplosion', 3, 1000, 2);
            this.isShooting = false;
            this.shootingDisabled = false;
            this.enableControl();
            this.shotHit = (function (_this) {
                return function (hitInfo) {
                    var target;
                    target = hitInfo[0].obj;
                    if (target.has('ClassicAlien')) {
                        _this.trigger('AlienHit', target);
                    }
                    if (target.has('ClassicShield')) {
                        _this.trigger('ShieldHit', target);
                    }
                    if (target.has('ClassicAlienShot')) {
                        _this.trigger('AlienShotHit', target);
                    }
                    if (target.has('ClassicSpaceship')) {
                        _this.trigger('SpaceshipHit', [_this.shot, target]);
                    }
                    return _this.shot.stop();
                };
            })(this);
            this.playerHit = (function (_this) {
                return function (hitInfo) {
                    var target;
                    target = hitInfo[0].obj;
                    if (target.has('ClassicAlien')) {
                        return _this.trigger('HitByAlien', target);
                    }
                };
            })(this);
            this.shot.bind("HitOn", this.shotHit);
            this.body.bind("HitOn", this.playerHit);
            return this.explosion.bind("ExplosionEnded", (function (_this) {
                return function () {
                    return _this.respawn();
                };
            })(this));
        },
        setPosition: function(x, y) {
            this.body.attr({
                x: x,
                y: y
            });
            this.cannon.attr({
                x: x,
                y: y
            });
            return this;
        },
        x: function() {
            return this.body.x;
        },
        y: function() {
            return this.body.y;
        },
        show: function() {
            this.body.attr({
                visible: true
            });
            return this.cannon.attr({
                visible: true
            });
        },
        hide: function() {
            this.body.attr({
                visible: false
            });
            return this.cannon.attr({
                visible: false
            });
        },
        shoot: function() {
            if (!this.shot.isActive()) {
                this.cannon.fire();
                this.shot.fireFrom(this.x() + 29, this.y() + 16);

                Crafty.audio.play('classic_player_shoot');
            }
            return this;
        },
        die: function() {
            if (this.isDead() === false) {
                this.explosion.explodeAt(this.body.x, this.body.y);
                this.disableControl();
                this.stopShooting();
                this.hide();

                Crafty.audio.play('classic_player_die');
                
                return true;
            }
            return false;
        },
        isDead: function() {
            return !this.body._visible;
        },
        respawn: function() {
            return this.trigger("Respawning", this);
        },
        remove: function() {
            this.body.destroy();
            this.cannon.destroy();
        },
        keyDown: function() {
            if (this.isDown(Crafty.keys.SPACE) && this.shootingDisabled === false) {
                return this.startShooting();
            }
        },
        keyUp: function() {
            if (!this.isDown(Crafty.keys.SPACE)) {
                return this.stopShooting();
            }
        },
        startShooting: function() {
            if (!this.isShooting) {
                this.isShooting = true;
                this.shoot();
                return this.bind("ShotStopped", this.shoot);
            }
        },
        stopShooting: function() {
            if (this.isShooting) {
                this.isShooting = false;
                return this.unbind("ShotStopped", this.shoot);
            }
        },
        enableControl: function () {
            this.enableShooting();
            this.bind("KeyDown", this.keyDown);
            return this.bind("KeyUp", this.keyUp);
        },
        disableControl: function () {
            this.disableShooting();
            this.unbind("KeyDown", this.keyDown);
            return this.unbind("KeyUp", this.keyUp);
        },
        disableShooting: function() {
            return this.shootingDisabled = true;
        },
        enableShooting: function() {
            return this.shootingDisabled = false;
        }
    });

});