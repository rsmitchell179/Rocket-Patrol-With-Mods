class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceshipRight', './assets/spaceshipRight.png');
        this.load.image('particle', './assets/particle.png');
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
        // Add rocket (player 2)
        this.p2Rocket = new Rocket(this, game.config.width/2, 431, 'rocket2').setScale(0.5, 0.5).setOrigin(0, 0);

        // Pick Spaceship Direction 0 for left 1 for right
        this.pickSpaceShip1Dir = Phaser.Math.Between(0, 1);
        this.pickSpaceShip2Dir = Phaser.Math.Between(0, 1);
        this.pickSpaceShip3Dir = Phaser.Math.Between(0, 1);

        if(this.pickSpaceShip1Dir) {
            this.ship01 = new Spaceship(this, 0 - Phaser.Math.Between(0, 400), 132, 'spaceshipRight', 0, 30).setOrigin(0, 0);
        } else {
            this.ship01 = new Spaceship(this, game.config.width + Phaser.Math.Between(0, 400), 132, 'spaceship', 0, 30).setOrigin(0, 0);
        }
        if(this.pickSpaceShip2Dir) {
            this.ship02 = new Spaceship(this, 0 - Phaser.Math.Between(0, 400), 196, 'spaceshipRight', 0, 20).setOrigin(0, 0);
        } else {
            this.ship02 = new Spaceship(this, game.config.width + Phaser.Math.Between(0, 400), 196, 'spaceship', 0, 20).setOrigin(0, 0);
        }
        if(this.pickSpaceShip3Dir) {
            this.ship03 = new Spaceship(this, 0 - Phaser.Math.Between(0, 400), 260, 'spaceshipRight', 0, 10).setOrigin(0, 0);
        } else {
            this.ship03 = new Spaceship(this, game.config.width + Phaser.Math.Between(0, 400), 260, 'spaceship', 0, 10).setOrigin(0, 0);
        }
        
        // Define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Mouse position
        input = this.input;
        // Mouse click
        mouse = this.input.mousePointer;

        // Animating Config 
        // this.anims.create ({
        //     key: 'explode',
        //     frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
        //     frameRate: 30
        // });

        // Creating particles and particle emitter 
        this.particles = this.add.particles('particle');
        this.emitter = this.particles.createEmitter({
            speed: 200,
            lifespan: 500,
            blendMode: 'Add',
            scale: {
                start: 1,
                end: 0,
            },
            on: false,
        });

        // Variable to keep track of who's turn it is
        this.turn = 'p1 turn';

        // Score
        // Player 1's score
        this.p1Score = 0;
        // Player 2's score
        this.p2Score = 0;

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
        };

        // Text Display
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '15px',
            backgroundColor: '#F3B141',
            color: '#843605',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        // Display P1 score
        this.scoreLeft = this.add.text(45, 54, this.p1Score, scoreConfig);
        this.add.text(150, 60, 'P1 Score', textConfig);
        this.turnText = this.add.text(290, 60, 'P1 Turn', textConfig);

        // Display P2 score
        scoreConfig.align = 'left';
        this.scoreRight = this.add.text(495, 54, this.p2Score, scoreConfig);
        this.add.text(416, 60, 'P2 Score', textConfig);

        // Game Over flag
        this.gameOver = false;

        // Variable to flag to wait for player 2 turn to start
        this.waitForP2 = false; 

        // Player 1 play clock done
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => { 
            this.waitForP2 = true;
            this.turn = 'p2 turn';
            this.p1Rocket.destroy();
            this.p2Rocket.alpha = 1;    // Reveal P2 Rocket
            this.messageForP2Start = this.add.text(game.config.width/2, game.config.height/2, 'Press F to start player 2\'s turn', scoreConfig).setOrigin(0.5);
            if(this.pickSpaceShip1Dir) {
                this.ship01.x = -5 - Phaser.Math.Between(0, 400);
            } else {
                this.ship01.x = game.config.width + Phaser.Math.Between(0, 400);
            }
            if(this.pickSpaceShip2Dir) {
                this.ship02.x = -5 - Phaser.Math.Between(0, 400);
            } else {
                this.ship02.x = game.config.width + Phaser.Math.Between(0, 400);
            }
            if(this.pickSpaceShip3Dir) {
                this.ship03.x = -5 - Phaser.Math.Between(0, 400);
            } else {
                this.ship03.x = game.config.width + Phaser.Math.Between(0, 400);
            }
        }, null, this);
    }

    update() {
        if(this.waitForP2 && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.messageForP2Start.destroy();
            this.waitForP2 = false;
            this.p2Turn = true;
            // To make sure update() can see this
            let scoreConfig2 = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
            };
            this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig2).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Click to Restart or ← for Menu', scoreConfig2).setOrigin(0.5);
                if(this.p1Score > this.p2Score) {
                    this.add.text(game.config.width/2, game.config.height/2 - 60, 'P1 Wins!!!', scoreConfig2).setOrigin(0.5);
                } else if(this.p1Score < this.p2Score) {
                    this.add.text(game.config.width/2, game.config.height/2 - 60, 'P2 Wins!!!', scoreConfig2).setOrigin(0.5);
                } else {
                    this.add.text(game.config.width/2, game.config.height/2 - 60, 'Tie game!!!', scoreConfig2).setOrigin(0.5);
                }
                this.gameOver = true;
            }, null, this);
        }

        // Check key input for restart
        if(this.gameOver && mouse.isDown) {
            this.scene.restart(this.p1Score, this.p2Score, this.turn);
        }
    
        // Check key for menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Scroll starfield
        this.starfield.tilePositionX -= 5;
        this.starfield.tilePositionY -= 5;

        if(!this.gameOver){
            if(this.turn == 'p1 turn'){
                this.p1Rocket.update();         // Update Rocket(P1)
                this.p2Rocket.alpha = 0;        // Hide P2 Rocket
                this.ship01.update();           // Update spaceship
                this.ship02.update();           // Update spaceship
                this.ship03.update();           // Update spaceship

                // Check collisions of p1 rocket
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
            if(this.turn == "p2 turn" && this.p2Turn){
                this.p2Rocket.update();         // Update Rocket(P2)
                this.ship01.update();           // Update spaceship
                this.ship02.update();           // Update spaceship
                this.ship03.update();           // Update spaceship

                // Check collisions of p1 rocket
                if(this.checkCollision(this.p2Rocket, this.ship03)) {
                    this.p2Rocket.reset();
                    this.shipExplode(this.ship03);
                }
                if (this.checkCollision(this.p2Rocket, this.ship02)) {
                    this.p2Rocket.reset();
                    this.shipExplode(this.ship02);
                }
                if (this.checkCollision(this.p2Rocket, this.ship01)) {
                    this.p2Rocket.reset();
                    this.shipExplode(this.ship01);
                }
            }
                           
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

        // Create particle explosion
        if(ship.texture.key == "spaceship") {
            this.particles.emitParticleAt(ship.x, ship.y, 200);
            this.clock = this.time.delayedCall(1000, () => {
                ship.reset();
                ship.alpha = 1;
            }, null, this);
        } else if(ship.texture.key == "spaceshipRight") {
            this.particles.emitParticleAt(ship.x+30, ship.y, 200);
            this.clock = this.time.delayedCall(1000, () => {
                ship.reset();
                ship.alpha = 1;
            }, null, this);
        }
        // Create explosion sprite at ship's position
        // let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);    
        // boom.anims.play('explode');                             
        // boom.on('animationcomplete', () => { // Callback after animation completes
        //    ship.reset();                    // Reset ship's position
        //    ship.alpha = 1;                  // Make ship visible again
        //    boom.destroy();                  // remove explosion sprite
        // });

        // Score increment and repaint
        if(this.turn == 'p1 turn'){
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }
        if(this.turn == 'p2 turn'){
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }

        // Play ship explosion sound
        let randExplodeSFX = Phaser.Math.Between(0, 4);
        if(randExplodeSFX == 0){
            this.sound.play('sfx_explosion');
        }
        if(randExplodeSFX == 1){
            this.sound.play('sfx_explosion2');
        }
        if(randExplodeSFX == 2){
            this.sound.play('sfx_explosion3');
        }
        if(randExplodeSFX == 3){
            this.sound.play('sfx_explosion4');
        }
        if(randExplodeSFX == 4){
            this.sound.play('sfx_explosion5');
        }
    }
}