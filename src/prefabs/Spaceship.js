// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
    
        scene.add.existing(this); // Add to existing Scene, DisplayList, UpdateList
        this.points = pointValue; 
    }

    update() {
        // Move spaceship left
        if(this.texture.key == 'spaceshipRight') {
        this.x += game.settings.spaceshipSpeed;
        } else if(this.texture.key == 'spaceship'){
            this.x -= game.settings.spaceshipSpeed;
        }
        // Wrap around screen bounds
        if(this.x <= 0 - this.width && this.texture.key == "spaceship") {
            this.reset();
        }
        if(this.x >= game.config.width + this.width && this.texture.key == "spaceshipRight") {
            this.reset();
        }
    }

    reset() {
        if(game.settings.gameTimer == "60000") {
            if(this.texture.key == "spaceship") { 
                this.x = game.config.width + Phaser.Math.Between(0, 300);
            } else if(this. texture.key == "spaceshipRight" ){
                this.x = 0 - Phaser.Math.Between(0, 300);
            }
        } else {
            if(this.texture.key == "spaceship") { 
                this.x = game.config.width + Phaser.Math.Between(0, 500);
            } else {
                this.x = 0 - Phaser.Math.Between(0, 500);
            }
        }
    }
}
