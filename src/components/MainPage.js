import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import connectToDatabase from '../util/mongodb'
import './MainPage.css'; // CSS 파일 import
const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

function MainPage() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false); // 텍스트 입력 중인지 여부를 관리
  const [circles, setCircles] = useState([]); // 원 정보를 저장할 JSON 배열
  const [pageHeight, setPageHeight] = useState(window.innerHeight); // 페이지 높이 상태 추가

  
  const navigate = useNavigate();
  const containerRef = useRef(null); // 스크롤 조정을 위해 ref 추가

  // 효과음 관련 상태
 
 // const serverIdea = new ConvexHttpClient(process.env["REACT_APP_CONVEX_URL"]);
 
 useEffect(() => {
  const fetchData = async () => {
    const result = await axios.get(`${PROXY}/.netlify/functions/get_ideas`,
   
    );

    if(result.data === null){
      setCircles([])
    }else{
      const thinks = result.data.thinks;
      setCircles(thinks);
    }
 
  };
  fetchData();
}, []);



  useEffect(() => {
    const intervalId = setInterval(() => {
  
      // NOTE hourCheck();

    //   const fetchData = async () => {
    //     const result = await axios.get(`${PROXY}/.netlify/functions/get_ideas`,);
    
       
    //       if(result.data === null){
    //         setCircles([])
    //         }
    //       else{
    //         const thinks = result.data.thinks;
    //         setCircles(thinks);
    //         }
    // };

    // fetchData();
     
      
      const updatedCircles = circles.map(circle => {
        const now = Date.now();
   
        const age = now - circle.createdAt;
    // const minutes = age / (1000 * 60);
    const hours = age / (1000 * 60 * 60);

    if ( circle.remainingTime <= 0) {
      return null; // 원을 삭제
    }

    if (hours >= 12) {
      return null; // 원을 삭제
    }

       // const opacity = Math.max(0, 1 - (hours / 12));
        //const newColor = hexToRgb(circle.color, opacity);
        let remainingTime = (1 - hours / 12) * 100;



        return {
          ...circle,
          color: remainingTime <= 3 ? 'red' : circle.color,
          remainingTime: remainingTime
        };
      }).filter(Boolean);

      console.log("초단위",updatedCircles)
      setCircles(updatedCircles);
  

      const updateData = async () => {
        const result = await axios.post(`${PROXY}/.netlify/functions/update_ideas`,
          JSON.stringify({updatedCircles:updatedCircles})
        );
        if(result.acknowledged) return
    
        // const thinks = [result.data];
        // setCircles(thinks);
      };
      updateData();
  //     serverIdea.mutation(api.thinks.replaceIdea,{updatedCircles:updatedCircles}).then((update)=>{
  //       //const savedCircles = update;

   
  // });


      // localStorage.setItem('circles', JSON.stringify(updatedCircles));
    }, 1000); // 10초마다 업데이트

    
    return () => clearInterval(intervalId);
  }, [circles]);

  // const hexToRgb = (hex, opacity) => {
  //   const bigint = parseInt(hex.slice(1), 16);
  //   const r = (bigint >> 16) & 255;
  //   const g = (bigint >> 8) & 255;
  //   const b = bigint & 255;
  //   return `rgba(${r},${g},${b},${opacity})`;
  // };

   
  // NOTE
  //  const hourCheck = () => {
  //   const now = new Date();
  //     const currentHour = now.getHours();
      
  //     if (currentHour >= 0 && currentHour < 9) {
  //       // 자정 00시부터 아침 9시까지는 remainingTime을 업데이트하지 않음
  //       return;
  //     }
  //  };

  // const getDecreaseRate = (clicks) => {
  //   if (clicks < 10) {
  //     return 2; // 기본 감소 속도
  //   } else if (clicks >= 10 && clicks < 25) {
  //     return 0.8; // 클릭 수가 20 이상 50 미만일 때 감소 속도 절반
  //   } 
  //   else if (clicks >= 25 && clicks < 50) {
  //     return 0.3; // 클릭 수가 20 이상 50 미만일 때 감소 속도 절반
  //   } 
  //   else if (clicks >= 50 && clicks < 100) {
  //     return 0.1; // 클릭 수가 50 이상 100 미만일 때 감소 속도 1/4
  //   } else {
  //     return 0.01; // 클릭 수가 100 이상일 때 감소 속도 1/10
  //   }
  // };

  

  const saveCirclesToDB = async(circles) => {
    console.log("저장한다",circles)
   await axios.post(`${PROXY}/.netlify/functions/update_ideas`,
      JSON.stringify({updatedCircles:circles})
    );
  //   serverIdea.mutation(api.thinks.replaceIdea,{updatedCircles:circles}).then((update)=>{
  //     const savedCircles = update;
  //  console.log(savedCircles)
  //   });
    // localStorage.setItem('circles', JSON.stringify(circles)); // 원 정보를 로컬 스토리지에 저장
  };

  

  
  const handleInputChange = (e) => {
    // 한글 입력 상태인지 확인
    const isKoreanInput = e.nativeEvent.isComposing || e.nativeEvent.inputType === 'insertCompositionText';
    if (!isKoreanInput) {
      setInputText(e.target.value);
    }else{
      setIsTyping(false)
      setInputText(e.target.value);
    }
  };
  const playSound = () => {
    const audio = new Audio('/sounds/sound.mp3'); // Path to your sound file
    audio.play();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      playSound();
      handleButtonClick();
    }
  };

//   // 중복된 텍스트 판별을 위한 함수
// const isDuplicateText = (text) => {
//   return circles.some(circle => circle.text === text);
// };



  const handleButtonClick = () => {
    if (/^[\u3131-\uD79D]+$/.test(inputText.trim()) && inputText.trim().length === 1) {
      setInputText('');
      return; // 한글로 한 글자인 경우 무시
    }

    if (inputText.trim() === '') {
      return; // 입력된 텍스트가 없으면 처리하지 않음
    }
    console.log(inputText)

//     // 중복된 텍스트인지 확인
//  if (isDuplicateText(inputText)) {
//   alert('이미 입력된 텍스트입니다.'); // 중복된 텍스트일 경우 팝업 알람 표시
//   return;
// }

     // 중복된 텍스트인지 확인
  const existingCircle = circles.find(circle => circle.text === inputText);
  if (existingCircle) {
    // 중복된 텍스트일 경우 클릭 횟수 증가
    const updatedCircles = circles.map(circle =>
      circle.text === inputText
        ? { ...circle, color: randomColor(), clicks: circle.clicks + 1, createdAt: Date.now(), remainingTime: 100 }
        : circle
    );
    setCircles(updatedCircles);

    // 로컬 스토리지에 업데이트된 원 정보 저장
    saveCirclesToDB(updatedCircles);
    
  } else {
    // 중복된 텍스트가 아닐 경우 새로운 원 추가
    const newCircle = {
      id: `circle-${Date.now()}`, // 고유한 ID 생성
      text: inputText,
      color: randomColor(),
      position:randomNonOverlappingPosition(circles),
      clicks: 0, // 클릭 횟수 초기화
      createdAt: Date.now(),
      remainingTime: 100, // 처음에는 100%로 시작
      timerRecords: [] // 타이머 기록을 저장할 배열
    };

  

    const newCircles = [...circles, newCircle];
    setCircles(newCircles);
    // 로컬 스토리지에 업데이트된 원 정보 저장
    saveCirclesToDB(newCircles);
    };


    
    setInputText('');
    setIsTyping(false); // 입력이 완료됨을 표시
  };

  const handleComponentClick = (index) => {

    handleMoveToDetail(index);
  };

  // 상세페이지로 이동하는 함수
  const handleMoveToDetail = (index) => {
    const updatedCircles = circles.map((circle, i) => 
      i === index 
        ? { ...circle,
           clicks: circle.clicks + 1,
            //remainingTime: 100
           } 
        : circle
    );

    setCircles(updatedCircles);
    saveCirclesToDB(updatedCircles);
    
    navigate(`/detail/${index}`, { state: { index: index } });
  };

  const handleResetButtonClick =async () => {
    setCircles([]); // 생성된 원들 초기화
  //   serverIdea.mutation(api.thinks.replaceIdea,{updatedCircles:[]}).then((update)=>{
  //     const savedCircles = update;
  //  console.log(savedCircles)
  //   });
   await axios.post(`${PROXY}/.netlify/functions/delete_ideas`,
    JSON.stringify({updatedCircles:circles})
  );

    localStorage.removeItem('circles'); // 로컬 스토리지에서 데이터 제거
  };



  // const randomPosition = () => {
  //   // 랜덤한 위치 생성
  //   return {
  //     left: `${Math.random() * 70 + 15}%`,
  //     top: `${Math.random() * 60 + 5}%` // 더 멀리 떨어뜨리기 위해 범위 수정
  //   };
  // };


  const randomColor = () => {
    // 랜덤한 색상 생성
    const hash = Math.random().toString(16).slice(2, 8);
    return `#${hash}`;
  };

  // const adjustColorBrightness = (color, amount) => {
  //   // 색상의 밝기를 조절하여 반환
  //   return '#' + color.match(/[0-9a-f]{2}/g).map(channel => {
  //     const value = parseInt(channel, 16);
  //     const adjustedValue = Math.min(255, value + amount);
  //     return adjustedValue.toString(16).padStart(2, '0');
  //   }).join('');
  // };



 // 겹치지 않는 위치를 찾기 위한 함수
const randomNonOverlappingPosition = (existingCircles) => {
  const newPosition = () => {
    return {
      left: `${Math.random() * 70 + 15}%`,
      top: `${Math.random() * (pageHeight - buttonHeight)}px` // 버튼 영역을 제외한 높이 내에서 생성
    };
  };

  let position;
  let attempts = 0;

  do {
    position = newPosition();
    attempts++;
  } while (isOverlapping(position, existingCircles) && attempts < 100);

  if (attempts === 100) {
    // 겹치지 않는 위치를 찾을 수 없으면 페이지 높이 증가
    setPageHeight(prevHeight => prevHeight + 200);
    position = newPosition();
  }

  return position;
};

const buttonHeight = 100; // 버튼 영역의 높이 설정 (적절한 높이로 설정하기)
// 위치가 겹치는지 확인하는 함수
const isOverlapping = (position, existingCircles) => {
  const radius = 25; // 원의 반지름 25px
  const padding = 10; // 추가 패딩

  return existingCircles.some(circle => {
    const distance = calculateDistance(
      parseFloat(position.left),
      parseFloat(position.top),
      parseFloat(circle.position.left),
      parseFloat(circle.position.top)
    );
    return distance < (2 * radius + padding); // 원의 두 배 반지름 + 패딩을 기준으로 겹침 여부 판단
  });
};

// 페이지 높이가 변할 때 컨테이너의 높이를 조정하는 효과 추가
useEffect(() => {
  if (containerRef.current) {
    containerRef.current.style.height = `${pageHeight}px`;
  }
}, [pageHeight]); 

  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const getClickMessage = (clicks) => {
    if (clicks < 10) {
      return '씨앗심기🌱';
    } else if (clicks >= 10 && clicks < 25) {
      return '희망사항🍎';
    }
    else if (clicks >= 25 && clicks < 50) {
      return '성취🔥';
    }  else if (clicks >= 50 && clicks < 100) {
      return '산독기😈';
    } else {
      return '확정된 미래⭐️';
    }
  };


  
  return (
    <div className="main-container">
    <div className="circles-container" ref={containerRef}>
        {circles.map((circle, index) => (
          <div
            key={`test-${circle.id}`}
            className={`circle ${circle.isBouncing ? 'bounce' : ''}`}
            style={{
              left: circle.position.left,
              top: circle.position.top,
              backgroundColor: circle.color,
              transform: `scale(${1 + Math.floor(circle.clicks / 20) * 0.1})`
            }}
            onClick={() => handleComponentClick(index)}
          >
            <span className="circle-text">{circle.text}</span>
            <span className="circle-text">{getClickMessage(circle.clicks)} : {circle.clicks || 0}</span>
           
            <div className="time-bar-container">
              <div
                className="time-bar"
                style={{ width: `${circle.remainingTime}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="input-container" style={{ position: 'fixed', bottom: 0 }}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onKeyUp={() => setIsTyping(false)}
          className="text-input"
        />
        <button onClick={handleButtonClick} className="main-button">입력</button>
        <button onClick={handleResetButtonClick} className="main-button">초기화</button>
      </div>
    </div>
  );
}

export default MainPage;