import Phaser from 'phaser';
import { dialogueData, scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    // this.load.spritesheet('spritesheet', '../public/assets/spritesheet.png', {
    //   frameWidth: 39,
    //   frameHeight: 33.6
    // });
    this.load.image('map', 'public/assets/rpg/map.png');
    // this.load.image('new', 'path/to/new.png');
    // this.load.audio('music', '../public/assets/LADY.mp3');
    // this.load.json('mapData', '../public/assets/map.json');
  }

  create() {
    this.add.image(400, 300, 'map').setScale(scaleFactor);
    // this.sound.add('music').play();

    // this.anims.create({
    //   key: 'idle-down',
    //   frames: [{ key: 'spritesheet', frame: 936 }],
    //   frameRate: 8,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'walk-down',
    //   frames: this.anims.generateFrameNumbers('spritesheet', { start: 936, end: 937 }),
    //   frameRate: 8,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'idle-side',
    //   frames: [{ key: 'spritesheet', frame: 938 }],
    //   frameRate: 8,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'walk-side',
    //   frames: this.anims.generateFrameNumbers('spritesheet', { start: 938, end: 939 }),
    //   frameRate: 8,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'idle-up',
    //   frames: [{ key: 'spritesheet', frame: 975 }],
    //   frameRate: 8,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'walk-up',
    //   frames: this.anims.generateFrameNumbers('spritesheet', { start: 975, end: 976 }),
    //   frameRate: 8,
    //   repeat: -1
    // });

    const player = this.physics.add.sprite(400, 300, 'spritesheet').setScale(scaleFactor).play('idle-down');
    player.speed = 250;
    player.direction = 'down';
    player.isInDialogue = false;

    // const mapData = this.cache.json.get('mapData');
    // console.log(mapData)
    // const layers = mapData.layers;

    // for (const layer of layers) {
    //   if (layer.name === 'boundaries') {
    //     for (const boundary of layer.objects) {
    //       const boundaryRect = this.add.rectangle(boundary.x, boundary.y, boundary.width, boundary.height, 0xffffff, 0);
    //       this.physics.add.existing(boundaryRect);
    //       boundaryRect.body.setImmovable(true);
    //       this.physics.add.collider(player, boundaryRect, () => {
    //         if (boundary.name) {
    //           player.isInDialogue = true;
    //           displayDialogue(dialogueData[boundary.name], () => {
    //             player.isInDialogue = false;
    //             if (boundary.name === 'exit') {
    //               this.scene.start('field');
    //             }
    //           });
    //         }
    //       });
    //     }
    //   } else if (layer.name === 'spawnpoints') {
    //     for (const entity of layer.objects) {
    //       if (entity.name === 'player') {
    //         player.setPosition(entity.x * scaleFactor, entity.y * scaleFactor);
    //       }
    //     }
    //   }
    // }

    this.input.keyboard.on('keydown', (event) => {
      if (player.isInDialogue) return;
      switch (event.code) {
        case 'ArrowRight':
          player.setVelocityX(player.speed);
          player.flipX = false;
          if (player.anims.currentAnim.key !== 'walk-side') player.play('walk-side');
          player.direction = 'right';
          break;
        case 'ArrowLeft':
          player.setVelocityX(-player.speed);
          player.flipX = true;
          if (player.anims.currentAnim.key !== 'walk-side') player.play('walk-side');
          player.direction = 'left';
          break;
        case 'ArrowUp':
          player.setVelocityY(-player.speed);
          if (player.anims.currentAnim.key !== 'walk-up') player.play('walk-up');
          player.direction = 'up';
          break;
        case 'ArrowDown':
          player.setVelocityY(player.speed);
          if (player.anims.currentAnim.key !== 'walk-down') player.play('walk-down');
          player.direction = 'down';
          break;
      }
    });

    this.input.keyboard.on('keyup', () => {
      player.setVelocity(0);
      switch (player.direction) {
        case 'down':
          player.play('idle-down');
          break;
        case 'up':
          player.play('idle-up');
          break;
        default:
          player.play('idle-side');
      }
    });

    this.cameras.main.startFollow(player, true);
  }

  update() {
    // Implement any other update logic if necessary
  }
}

class FieldScene extends Phaser.Scene {
  constructor() {
    super('field');
  }

  preload() {
    // this.load.json('fieldMapData', '../public/assets/new.json');
  }

  create() {
    const fieldMapData = this.cache.json.get('fieldMapData');
    const layers = fieldMapData.layers;
    this.add.image(400, 300, 'map').setScale(scaleFactor);
    // Implement additional logic for FieldScene
  }

  update() {
    // Implement any other update logic if necessary
  }
}

const rpgConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene, FieldScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

export default rpgConfig;

