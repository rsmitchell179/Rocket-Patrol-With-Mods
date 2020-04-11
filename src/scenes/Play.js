class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    
    create() {
        // Place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // White rectangle borders 
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0.0);

        // Green UI background
        this.add.rectangle(37, 42, 566, 64, 0x000FF00).setOrigin(0, 0);

        // Add rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        // Add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0, 0);
        
        // Define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Animating Config 
        this.anims.create ({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // Score
        this.p1Score = 0;

        // Score Display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // Game Over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5); 
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // Check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
    
        // Check key for menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Scroll starfield
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver){
            this.p1Rocket.update();     // Update Rocket
            this.ship01.update();       // Update spaceship
            this.ship02.update();
            this.ship03.update();
        }
        // Check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // Simple AABB checking
        if(rocket.x < ship.x + ship.width && 
           rocket.x + rocket.width > ship.x && 
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                      // Temporarily hide ship
        // Create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);    
        boom.anims.play('explode');                             
        boom.on('animationcomplete', () => { // Callback after animation completes
            ship.reset();                    // Reset ship's position
            ship.alpha = 1;                  // Make ship visible again
            boom.destroy();                  // remove explosion sprite
        });
        // Score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        // Play ship explosion sound
        this.sound.play('sfx_explosion');
    }
}