let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    physics: { 
        default: "arcade",
        arcade: {
            Gravity: {
                x: 0,
                y: 0,
            },
        },
    }
};

let game = new Phaser.Game(config);

// Define game settings 
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
};

// Feserve some keyboard variables 
let keyF, keyLEFT, keyRIGHT;
// Mouse 
var input, mouse;