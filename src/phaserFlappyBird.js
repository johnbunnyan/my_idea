import Phaser from 'phaser';

class FlappyBird extends Phaser.Scene {
  constructor() {
    super({ key: 'FlappyBird' });
  }

  preload() {
    this.load.image('sky', '../assets/flappy/background-day.png');
    this.load.image('bird', '../assets/flappy/yellowbird-downflap.png');
    this.load.image('pipe', '../assets/flappy/pipe-green.png');
  }

  create() {
   // 화면 전체를 채우는 배경 이미지 설정
   this.add.tileSprite(200, 300, 2500, 700, 'sky');
    this.bird = this.physics.add.sprite(100, 245, 'bird');
    this.bird.setGravityY(1000);
    
    this.pipes = this.physics.add.group();
    
    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addRowOfPipes,
      callbackScope: this,
      loop: true,
    });

    this.input.on('pointerdown', this.jump, this);
    this.physics.add.collider(this.bird, this.pipes, this.hitPipe, null, this);
  }

  update() {
    if (this.bird.y < 0 || this.bird.y > 600) {
      this.restartGame();
    }
  }

  jump() {
    if (this.bird.alive === false) {
      return;
    }
    this.bird.setVelocityY(-350);
  }

  restartGame() {
    this.scene.restart();
  }

  hitPipe() {
    if (this.bird.alive === false) {
      return;
    }
    this.bird.alive = false;
    this.physics.pause();
    this.bird.setTint(0xff0000);
    
    this.time.addEvent({
      delay: 1000,
      callback: this.restartGame,
      callbackScope: this,
    });
  }

  addOnePipe(x, y) {
    const pipe = this.pipes.create(x, y, 'pipe');
    pipe.setVelocityX(-200);
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  }

  addRowOfPipes() {
    const pipeGap = 150; // 새가 지나갈 수 있는 간격
    const holePosition = Math.floor(Math.random() * (600 - pipeGap - 100)) + 50; // 랜덤한 구멍 위치
    
    // 위쪽 파이프 추가
    this.addOnePipe(800, holePosition - pipeGap / 2 - 320); // 파이프의 높이가 320임
    // 아래쪽 파이프 추가
    this.addOnePipe(800, holePosition + pipeGap / 2);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: FlappyBird
};


export default config;
