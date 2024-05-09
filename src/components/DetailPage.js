import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetailPage.css'; // DetailPage.css 파일 import

function DetailPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation();
  const { state } = location; 
  const index = state.index; 
  const [circle, setCircle] = useState(null);
  // const [clicks, setClicks] = useState(0); // 클릭 횟수 상태 추가

  useEffect(() => {
    // 해당 인덱스에 해당하는 원의 정보를 가져옴
    const savedCircles = JSON.parse(localStorage.getItem('circles'));
    const savedClicks = JSON.parse(localStorage.getItem(`circle_${index}_clicks`)); // 클릭 횟수 가져오기
    setCircle(savedCircles[index]);
    // setClicks(savedClicks || 0); // 클릭 횟수 설정
  }, [index]);

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="detail-container">
      {circle ? (
        <div>
          <h2 className="title">원 정보</h2>
          <p className="text">텍스트: {circle.text}</p>
          <p className="text">색상: {circle.color}</p>
          <p className="text">클릭 횟수: {circle.clicks}</p>
          {/* 기타 정보 표시 */}
        </div>
      ) : (
        <p className="loading">원 정보를 불러오는 중...</p> 
      )}
      <button className="back-button" onClick={handleGoBack}>뒤로가기</button>
    </div>
  );
}
export default DetailPage;
