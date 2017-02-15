define([
    'underscore',
    'crafty'
], function (_, Crafty) {

    var ClassicAlienConstants = (function() {
        function ClassicAlienConstants() { }

        ClassicAlienConstants.IDLE_X = -200;
        ClassicAlienConstants.IDLE_Y = 400;
        ClassicAlienConstants.WIDTH = ClassicAlienConstants.HEIGHT = 48;
        ClassicAlienConstants.HORIZONTAL_SPEED = 10;
        ClassicAlienConstants.VERTICAL_SPEED = 25;
        ClassicAlienConstants.MOVEMENT_INTERVAL = 2000;
        ClassicAlienConstants.HITBOX = {
            1: (function() {
                return [[8, 8], [39, 8], [39, 37], [8, 37]];
            }),
            2: (function() {
                return [[8, 8], [39, 8], [39, 37], [8, 37]];
            }),
            3: (function() {
                return [[8, 8], [39, 8], [39, 37], [8, 37]];
            })
        };

        return ClassicAlienConstants;
    })();

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
        die: function() {
            Crafty.audio.play('classic_alien_die');
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