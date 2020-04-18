class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload() {
        // Load Audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_explosion2', './assets/explosion.wav');
        this.load.audio('sfx_explosion3', './assets/explosion2.wav');
        this.load.audio('sfx_explosion4', './assets/explosion3.wav');
        this.load.audio('sfx_explosion5', './assets/explosion4.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // Menu display 
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpace = 64;

        this.add.text(centerX, centerY - textSpace, 'ROCKET PATROL WITH MODS', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '26px';
        this.add.text(centerX, centerY, 'Use mouse to move and left click to fire', menuConfig).setOrigin(0.5);
        //this.add.text(centerX, centerY, 'Use ←→ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpace, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);

        // Define keys
        keyLEFT =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Easy mode 
            game.settings = {
                spaceshipSpeed: Phaser.Math.Between(3, 4),
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // Hard mode 
            game.settings = {
                spaceshipSpeed: Phaser.Math.Between(4, 5),
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}