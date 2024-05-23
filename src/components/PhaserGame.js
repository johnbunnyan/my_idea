import React, { useEffect } from 'react';
import Phaser from 'phaser';
import config from '../phaserFlappyBird'; // FlappyBird 게임 설정을 가져옴

const PhaserGame = () => {
  useEffect(() => {


    const game = new Phaser.Game(config);

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return (
    <div id="phaser-game" style={{ width: '800px', height: '50px', margin: '0 auto' }}></div>
  );
};

export default PhaserGame;
