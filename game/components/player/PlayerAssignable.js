define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('PlayerAssignable', {
            init: function () {
                this._attachControllerAssignTrigger();
                return this.preferredPlayer = null;
            },
            _assignControls: function () {
                var player;
                player = this._preferredplayer() || this._firstUnassignedPlayer();
                if (player == null) {
                    this._attachControllerAssignTrigger();
                    return;
                }
                this.preferredPlayer = player.getId();
                this.setupControls(player);
                return player.one('Deactivated', (function (_this) {
                    return function () {
                        return _this._attachControllerAssignTrigger();
                    };
                })(this));
            },
            _attachControllerAssignTrigger: function () {
                return this.one('Fire', this._assignControls);
            },
            _preferredplayer: function (preferred) {
                var player;
                if (this.preferredPlayer !== null) {
                    player = Crafty(this.preferredPlayer);
                    if (!player.has('ControlScheme')) {
                        return player;
                    }
                }
            },
            _firstUnassignedPlayer: function () {
                var i, len, player, playerId, players;
                players = Crafty('Player');
                for (i = 0, len = players.length; i < len; i++) {
                    playerId = players[i];
                    player = Crafty(playerId);
                    if (!player.has('ControlScheme')) {
                        return player;
                    }
                }
            }
        });
    });