﻿define(function () {
    
    return [
        {
            scenes: ["menu"],
            data: {
                images: [],
                sprites: {
                    "ui/Button_Dark_Thin.png": {
                        tile: 368,
                        tileh: 99,
                        map: {
                            button_dark: [0, 0], button_dark_down: [0, 1]
                        }
                    }
                }
            }
        },
        {
            scenes: ["intro"],
            data: {
                images: [],
                audio: {
                    classic_alien_die: [
                        "alien_die.wav",
                        "alien_die.mp3",
                        "alien_die.ogg"
                    ],
                    classic_alien_move0: [
                        "alien_move0.wav",
                        "alien_move0.mp3",
                        "alien_move0.ogg"
                    ],
                    classic_alien_move1: [
                        "alien_move1.wav",
                        "alien_move1.mp3",
                        "alien_move1.ogg"
                    ],
                    classic_alien_shot_hit: [
                        "alien_shot_hit.wav",
                        "alien_shot_hit.mp3",
                        "alien_shot_hit.ogg"
                    ],
                    player_die: [
                        "player_die.wav",
                        "player_die.mp3",
                        "player_die.ogg"
                    ],
                    player_shoot: [
                        "player_shoot.wav",
                        "player_shoot.mp3",
                        "player_shoot.ogg"
                    ],
                    ship_fly: [
                        "ship_fly.wav",
                        "ship_fly.mp3",
                        "ship_fly.ogg"
                    ],
                    ship_hit: [
                        "ship_hit.wav",
                        "ship_hit.mp3",
                        "ship_hit.ogg"
                    ]
                },
                sprites: {
                    "sprites/alien1.png": {
                        tile: 48,
                        tileh: 48,
                        map: {
                            classic_alien1: [0, 0]
                        }
                    },
                    "sprites/alien2.png": {
                        tile: 48,
                        tileh: 48,
                        map: {
                            classic_alien2: [0, 0]
                        }
                    },
                    "sprites/alien3.png": {
                        tile: 48,
                        tileh: 48,
                        map: {
                            classic_alien3: [0, 0]
                        }
                    },
                    "sprites/alien_explosion.png": {
                        tile: 48,
                        tileh: 48,
                        map: {
                            classic_alienExplosion: [0, 0]
                        }
                    },
                    "sprites/alien_shot.png": {
                        tile: 5,
                        tileh: 16,
                        map: {
                            classic_alienShot: [0, 0]
                        }
                    },
                    "sprites/player_life.png": {
                        tile: 25,
                        tileh: 23,
                        map: {
                            playerLife: [0, 0]
                        }
                    },
                    "sprites/shield.png": {
                        tile: 12,
                        tileh: 12,
                        map: {
                            shieldSprite: [0, 0]
                        }
                    },
                    "sprites/spaceship.png": {
                        tile: 80,
                        tileh: 30,
                        map: {
                            classic_spaceshipSprite: [0, 0]
                        }
                    },
                    "sprites/spaceship_explosion.png": {
                        tile: 80,
                        tileh: 30,
                        map: {
                            classic_spaceshipExplosion: [0, 0]
                        }
                    },
                    "sprites/player_explosion.png": {
                        tile: 64,
                        tileh: 64,
                        map: {
                            playerExplosion: [0, 0]
                        }
                    },
                    "sprites/shell.png": {
                        tile: 7,
                        tileh: 10,
                        map: {
                            shellSprite: [0, 0]
                        }
                    },
                    "sprites/player_cannon.png": {
                        tile: 62,
                        map: {
                            cannonSprite: [0, 0]
                        }
                    },
                    "sprites/player_base.png": {
                        tile: 62,
                        map: {
                            bodySprite: [0, 0]
                        }
                    }
                }
            }
        }
    ];
});