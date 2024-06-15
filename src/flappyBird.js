import Phaser from 'phaser';

class FlappyBird extends Phaser.Scene {
  constructor() {
    super({ key: 'FlappyBird' });
    this.gameStarted = false;
    this.memoPoint = 0; // 메모 포인트 초기화
    this.passedPipes = 0; // 지나간 파이프 초기화
  }

  preload() {
    this.load.image('sky', '../assets/flappy/background-day.png');
    this.load.image('bird', '../assets/flappy/yellowbird-midflap.png');
    this.load.image('birdUp', '../assets/flappy/yellowbird-upflap.png');
    this.load.image('birdDown', '../assets/flappy/yellowbird-downflap.png');
    this.load.image('pipe', '../assets/flappy/pipe-green.png');
  }

  create() {
    // 화면 전체를 채우는 배경 이미지 설정
    this.add.tileSprite(400, 300, 800, 600, 'sky');

     
    // 애니메이션 생성
    this.anims.create({
      key: 'fly',
      frames: [
        { key: 'bird' },
        { key: 'birdUp' },
        { key: 'bird' },
        { key: 'birdDown' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.bird = this.physics.add.sprite(100, 245, 'bird').play('fly');
    this.bird.setGravityY(0); // 초기에는 중력을 0으로 설정
    
    this.pipes = this.physics.add.group();
    
    this.input.on('pointerdown', this.jump, this);
    this.physics.add.collider(this.bird, this.pipes, this.hitPipe, null, this);
    
    this.startText = this.add.text(50, 50, 'Click to Start', { fontSize: '32px', fill: '#000' });

    this.startButton = this.add.text(50, 100, 'Start', { fontSize: '32px', fill: '#0f0' })
      .setInteractive()
      .on('pointerdown', () => this.startGame());

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addRowOfPipes,
      callbackScope: this,
      loop: true,
      paused: true // 타이머를 멈춘 상태로 시작
    });

     // 메모 포인트를 표시할 텍스트 추가
     this.memoPointText = this.add.text(10, 10, 'Memo Points: 0', { fontSize: '20px', fill: '#fff' })
  }

  update() {
    if (this.bird.y < 0 || this.bird.y > 600) {
      this.saveMemoPoint(); // 게임 종료 시 메모 포인트 저장
      this.memoPoint = 0; 
      this.restartGame();
    }
  }

  jump() {
    if (!this.gameStarted || this.bird.alive === false) {
      return;
    }
    this.bird.setVelocityY(-350);
  }

  startGame() {
    this.bird.setGravityY(1000);
    this.timer.paused = false;
    this.gameStarted = true;
    this.startButton.setVisible(false);
    this.startText.setVisible(false);
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
    
    this.saveMemoPoint(); // 게임 종료 시 메모 포인트 저장
    this.memoPoint = 0; 

    this.time.addEvent({
      delay: 1000,
      callback: this.restartGame,
      callbackScope: this,
    });
  }

  addOnePipe(x, y, flipped) {
    const pipe = this.pipes.create(x, y, 'pipe');
    pipe.setVelocityX(-200);
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

    if (flipped) {
        pipe.setFlipY(true); // y축 반전
    } else {
        pipe.body.setSize(pipe.width, pipe.height, false); // 충돌 영역 설정
    }

    // 디버그 모드에서 충돌 영역을 시각적으로 표시
    this.physics.world.enable(pipe, Phaser.Physics.Arcade.DEBUG_BODY);
}


  addRowOfPipes() {
    const gapSize = 200; // Gap between pipes
    const holePosition = Phaser.Math.Between(150, 450 - gapSize);

    // 위쪽 파이프 추가
    this.addOnePipe(800, holePosition - gapSize / 2 - 180, true); // 파이프의 높이가 320임

    // 아래쪽 파이프 추가
    this.addOnePipe(800, holePosition + gapSize / 2 + 180, false);
 
     // 파이프를 지나갈 때마다 메모 포인트 증가
     this.passPipe();

     // 메모 포인트 표시 업데이트
     this.memoPointText.setText(`Memo Points: ${this.memoPoint}`);
 
     // 새가 파이프를 5번 지나칠 때마다 메모 포인트를 1 올림
     if (this.passedPipes >= 5) {
       this.passedPipes = 0; // passedPipes 초기화
       this.memoPoint++; // memoPoint 1 증가
       // 메모 포인트 표시 업데이트
       this.memoPointText.setText(`Memo Points: ${this.memoPoint}`);
     }
  }

  passPipe() {
    // 파이프를 지나칠 때 호출되는 함수
    this.passedPipes++;
  }

  saveMemoPoint() {
    // 로컬 스토리지에 메모 포인트 저장
    const existingMemoPoint = localStorage.getItem('memoPoint');
    if (existingMemoPoint) {
   // 오류를 피하기 위해 기존의 memoPoint가 숫자 형식인지 확인
      const parsedMemoPoint = parseInt(existingMemoPoint);
      if (!isNaN(parsedMemoPoint)) {
        // 기존 memoPoint와 현재 memoPoint를 합산하여 다시 저장
        const updatedMemoPoint = parsedMemoPoint + this.memoPoint;
        localStorage.setItem('memoPoint', updatedMemoPoint);
      } else {
        // 기존 memoPoint가 숫자 형식이 아니면 현재 memoPoint를 저장
        localStorage.setItem('memoPoint', this.memoPoint);
      }
    } else {
      // 로컬 스토리지에 memoPoint가 없으면 현재 memoPoint 저장
      localStorage.setItem('memoPoint', this.memoPoint);
    }
  }

}


const flappyConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug:false
    }
  },
  scene: FlappyBird
};

export default flappyConfig;
