import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetailPage.css'; // DetailPage.css 파일 import
import axios from 'axios';
const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

function DetailPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation();
  const { index } = location.state || {};
  const [circle, setCircle] = useState(null);
  // const [clicks, setClicks] = useState(0); // 클릭 횟수 상태 추가


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${PROXY}/.netlify/functions/get_ideas`,
     
      );
  
      const thinks = result.data.thinks;
      if (thinks) {
        setCircle(thinks[index]);
      }
    };
    fetchData();

   
  },[index, circle]);

  if (!circle) return <div>Loading...</div>;


  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleButtonClick = (minutes) => {
    navigate(`/timer`, { state: { minutes, index } });
  };

  return (
    <div className="detail-container">
      {circle ? (
        <div>
          <h2 className="title">상세 소망 정보</h2>
          <p className="text">텍스트: {circle.text}</p>
          <p className="text">레벨: {circle.clicks}</p>
          {/* 기타 정보 표시 */}
        </div>
      ) : (
        <p className="loading">원 정보를 불러오는 중...</p> 
      )}

<div className="detail-container">
      <h1 className="detail-title">상상하기</h1>
      <div className="button-container">
        <button onClick={() => handleButtonClick(1)}>1분</button>
        <button onClick={() => handleButtonClick(3)}>3분</button>
        <button onClick={() => handleButtonClick(5)}>5분</button>
      </div>
    
      <div className="record-list">
            {circle.timerRecords && circle.timerRecords.length > 0 ? (
              circle.timerRecords.map((record, i) => (
                <div key={i} className="record">
                  <p>타이머 시간: {record.timerDuration}분</p>
                  <p>시작 시간: {new Date(record.startTime).toLocaleString()}</p>
                  <p>성공</p>
                </div>
              ))
            ) : (
              <p>타이머 기록이 없습니다.</p>
            )}
          </div>
    </div>

      <button className="back-button" onClick={handleGoBack}>뒤로가기</button>
    
    </div>
    
  );
}
export default DetailPage;
