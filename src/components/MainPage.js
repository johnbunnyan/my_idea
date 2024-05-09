import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // CSS 파일 import

function MainPage() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false); // 텍스트 입력 중인지 여부를 관리
  const [circles, setCircles] = useState([]); // 원 정보를 저장할 JSON 배열
  // const [clickCounts, setClickCounts] = useState({}); // 클릭 횟수를 상태로 관리
  // const [backgroundImage, setBackgroundImage] = useState('');

  
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지가 로드될 때 저장된 원 정보 가져오기
    const savedCircles = JSON.parse(localStorage.getItem('circles'));
    if (savedCircles) {
      setCircles(savedCircles);
    }
    
  }, []);

  const saveCirclesToLocalStorage = (circles) => {
    localStorage.setItem('circles', JSON.stringify(circles)); // 원 정보를 로컬 스토리지에 저장
  };

  // const containsHangul = (text) => {
  //   const hangulRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
  //   return hangulRegex.test(text);
  // };
  

  
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

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      handleButtonClick();
    }
  };

//   // 중복된 텍스트 판별을 위한 함수
// const isDuplicateText = (text) => {
//   return circles.some(circle => circle.text === text);
// };



  const handleButtonClick = () => {
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
      circle.text === inputText ? { ...circle, clicks: circle.clicks + 1 } : circle
    );
    setCircles(updatedCircles);

    // 로컬 스토리지에 업데이트된 원 정보 저장
    saveCirclesToLocalStorage(updatedCircles);
  } else {
    // 중복된 텍스트가 아닐 경우 새로운 원 추가
    const newCircle = {
      text: inputText,
      color: randomColor(),
      position: randomPosition(),
      clicks: 0 // 클릭 횟수 초기화
    }

    const newCircles = [...circles, newCircle];
    setCircles(newCircles);
    // 로컬 스토리지에 업데이트된 원 정보 저장
    saveCirclesToLocalStorage(newCircles);
    };


    setInputText('');
    setIsTyping(false); // 입력이 완료됨을 표시
  };

  const handleComponentClick = (index) => {
    // 클릭한 원의 클릭 횟수 증가
    const updatedCircles = [...circles];
    updatedCircles[index].clicks += 1;
    setCircles(updatedCircles);

    // 로컬 스토리지에 업데이트된 원 정보 저장
    saveCirclesToLocalStorage(updatedCircles);
  };

  // 상세페이지로 이동하는 함수
  const handleMoveToDetail = (index) => {
    navigate(`/detail/${index}`, { state: { index: index } });
  };

  const handleResetButtonClick = () => {
    setCircles([]); // 생성된 원들 초기화
    localStorage.removeItem('circles'); // 로컬 스토리지에서 데이터 제거
  };

  const randomPosition = () => {
    // 랜덤한 위치 생성
    return {
      left: `${Math.random() * 70 + 15}%`,
      top: `${Math.random() * 60 + 5}%` // 더 멀리 떨어뜨리기 위해 범위 수정
    };
  };

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


  return (
    <div className="main-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="input-container">
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
      {circles.map((circle, index) => (
        <div
        key={index}
        className="circle"
        style={{
          left: circle.position.left,
          top: circle.position.top,
          backgroundColor: circle.color,
          transform: `scale(${1 + Math.floor(circle.clicks / 10) * 0.1})` // 10번 클릭마다 크기 조정
        }}
        onClick={() => handleComponentClick(index)}
      >
        <span className="circle-text">{circle.text}</span>
        <span className="circle-text">클릭 횟수: {circle.clicks || 0}</span>
        <button onClick={() => handleMoveToDetail(index)} className="detail-button">→</button> {/* 화살표 이모티콘으로 변경 */}
      </div>
      ))}
    </div>
  );
}

export default MainPage;
