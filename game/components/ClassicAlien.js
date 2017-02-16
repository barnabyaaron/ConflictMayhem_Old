define([
    'underscore',
    'crafty',
    'storage',
    'game/constants/ClassicAlien'
], function (_, Crafty, storage, ClassicAlienConstants) {
    
    Crafty.c("ClassicAlien",
    {
        init: function() {
            this.requires("2D, DOM, SpriteAnimation, Collision");
            return this.direction = 'w';
        },
        respawn: function() {
            this.attr({
                x: this.spawnX,
                y: this.spawnY,
                visible: true
            });
            this.reelPosition(0);
            this.direction = 'w';
            return this;
        },
        die: function () {
            Crafty.audio.play('alien_die');
            
            return this.dieSilently();
        },
        dieSilently: function() {
            this.attr({
                x: ClassicAlienConstants.IDLE_X,
                y: ClassicAlienConstants.IDLE_Y,
                visible: false
            });
            this.node.remove();
            return this;
        },
        alien: function(type, x, y) {
            this.addComponent("classic_alien" + type);
            this.spawnX = x;
            this.spawnY = y;
            this.type = type;
            this.collision(new Crafty.polygon(ClassicAlienConstants.HITBOX[type]()));
            this.reel("move", 1, 0, 0, 2);
            this.reel("move");
            return this;
        },
        advance: function() {
            this.move(this.direction, ClassicAlienConstants.HORIZONTAL_SPEED);
            this.reelPosition((this.reelPosition() + 1) % 2);
            return this;
        },
        descend: function() {
            this.move('s', ClassicAlienConstants.VERTICAL_SPEED);
            if (this.direction === 'w') {
                this.direction = 'e';
            } else {
                this.direction = 'w';
            }
            return this;
        },
        pointsWorth: function() {
            return 50 * this.type;
        },
        setContainingNode: function(node) {
            this.node = node;
            return this;
        }
    });

});