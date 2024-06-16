// import React, { useEffect } from 'react';
// // import flappyConfig from '../flappyBird'; // FlappyBird 게임 설정을 가져옴
// import { k } from '../rpgGame';
import Iframe from 'react-iframe'


const PhaserGame = () => {
  // useEffect(() => {


  //   const game = k;

  //   return () => {
  //     if (game) {
  //       game.destroy(true);
  //     }
  //   };


  // }, []);

  return (

    <div style={{ marginTop: '45px' }}> {/* marginTop 값을 조정하여 위치를 아래로 내립니다 */}
      <Iframe 
        url="https://loveyourenemy.netlify.app/"
        width="1500px"  // width와 height 값을 적절하게 조정하세요
        height="620px"
        id=""
        className=""
        display="block"
        position="relative"
      />
    </div>
  );
};

export default PhaserGame;
