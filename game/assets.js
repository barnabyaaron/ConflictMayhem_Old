define(function () {

    var imageFileAssetHashNameMap = {
        alien1: "images/alien1-87aa3275.png",
        alien2: "images/alien2-51b00616.png",
        alien3: "images/alien3-7023c5b6.png",
        alien_explosion: "images/alien_explosion-9b3848d5.png",
        alien_shot: "images/alien_shot-f8e9dd99.png",
        player_base: "images/player_base-66bea591.png",
        player_cannon: "images/player_cannon-68d25d48.png",
        player_explosion: "images/player_explosion-aa4dac04.png",
        player_life: "images/player_life-3cf170ba.png",
        shell: "images/shell-c144c700.png",
        shield: "images/shield-bd571849.png",
        spaceship: "images/spaceship-3e42decd.png",
        spaceship_explosion: "images/spaceship_explosion-59f3c340.png"
    };

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
                images: [
                    "sprites/alien1.png",
                    "sprites/alien2.png",
                    "sprites/alien3.png",
                    "sprites/alien_explosion.png",
                    "sprites/alien_shot.png",
                    "sprites/player_base.png",
                    "sprites/player_cannon.png",
                    "sprites/player_explosion.png",
                    "sprites/player_life.png",
                    "sprites/shell.png",
                    "sprites/shield.png",
                    "sprites/spaceship.png",
                    "sprites/spaceship_explosion.png"
                ],
                audio: {
                    alien_die: [
                        "alien_die.wav",
                        "alien_die.mp3",
                        "alien_die.ogg"
                    ],
                    alien_move0: [
                        "alien_move0.wav",
                        "alien_move0.mp3",
                        "alien_move0.ogg"
                    ],
                    alien_move1: [
                        "alien_move1.wav",
                        "alien_move1.mp3",
                        "alien_move1.ogg"
                    ],
                    alien_shot_hit: [
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
                sprites: {}
            }
        }
    ];
});