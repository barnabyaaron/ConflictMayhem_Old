define(function () {
    
    return [
        {
            scenes: ["menu"],
            data: {
                images: [
                    "earth_bg.jpg"
                ],
                audio: {
                    menu_music: "through_space.mp3",
                    classic_music: [
                        "classic/spaceinvaders1.wav",
                        "classic/spaceinvaders1.mp3",
                        "classic/spaceinvaders1.ogg"
                    ]
                },
                sprites: {
                    "ui/panel_bg.png": {
                        tile: 3185,
                        tileh: 3142,
                        map: {
                            panel: [0, 0]
                        }
                    },
                    "ui/close_btn.png": {
                        tile: 420,
                        tileh: 420,
                        map: {
                            close_button_round: [0, 0],
                            close_button_round_hover: [1, 0],
                            close_button_round_click: [2, 0]
                        }
                    },
                    "ui/first_medal.png": {
                        tile: 451,
                        tileh: 597,
                        map: {
                            medal: [0, 0]
                        }
                    },
                    "ui/menu_buttons.png": {
                        tile: 340,
                        tileh: 60,
                        map: {
                            button: [0, 0],
                            button_hover: [0, 1],
                            button_click: [0, 2]
                        }
                    },
                    "ui/gold_menu_buttons.png": {
                        tile: 340,
                        tileh: 60,
                        map: {
                            gold_button: [0, 0],
                            gold_button_hover: [0, 1],
                            gold_button_click: [0, 2]
                        }
                    },
                    "ui/start_menu_buttons.png": {
                        tile: 340,
                        tileh: 60,
                        map: {
                            start_button: [0, 0],
                            start_button_hover: [0, 1],
                            start_button_click: [0, 2]
                        }
                    },
                    "ui/continue_menu_buttons.png": {
                        tile: 340,
                        tileh: 60,
                        map: {
                            continue_button: [0, 0],
                            continue_button_hover: [0, 1],
                            continue_button_click: [0, 2]
                        }
                    },
                    "ui/classic_menu_buttons.png": {
                        tile: 340,
                        tileh: 60,
                        map: {
                            classic_button: [0, 0],
                            classic_button_hover: [0, 1],
                            classic_button_click: [0, 2]
                        }
                    }
                }
            }
        },
        {
            scenes: ["intro", "classic"],
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
                    classic_player_die: [
                        "player_die.wav",
                        "player_die.mp3",
                        "player_die.ogg"
                    ],
                    classic_player_shoot: [
                        "player_shoot.wav",
                        "player_shoot.mp3",
                        "player_shoot.ogg"
                    ],
                    classic_ship_fly: [
                        "ship_fly.wav",
                        "ship_fly.mp3",
                        "ship_fly.ogg"
                    ],
                    classic_ship_hit: [
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
                            classic_shieldSprite: [0, 0]
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
                            classic_playerExplosion: [0, 0]
                        }
                    },
                    "sprites/shell.png": {
                        tile: 7,
                        tileh: 10,
                        map: {
                            classic_shellSprite: [0, 0]
                        }
                    },
                    "sprites/player_cannon.png": {
                        tile: 64,
                        tileh: 64,
                        map: {
                            classic_cannonSprite: [0, 0]
                        }
                    },
                    "sprites/player_base.png": {
                        tile: 62,
                        tileh: 64,
                        map: {
                            classic_bodySprite: [0, 0]
                        }
                    }
                }
            }
        },
        {
            scenes: ["classic"],
            data: {
                
            }
        }
    ];
});