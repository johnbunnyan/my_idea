import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TimerPage.css';

const TimerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { minutes, index } = location.state || {};
  const [time, setTime] = useState(minutes * 60);
  const [circleText, setCircleText] = useState('');
  
  useEffect(() => {
    const circles = JSON.parse(localStorage.getItem('circles')) || [];
    const circle = circles[index];
    if (circle) {
      setCircleText(circle.text);
    }

    if (time === 0) {
      const newRecord = {
        timerDuration: minutes,
        startTime: Date.now(),
        success: true,
      };

   
       // 클릭 수를 증가시킴
       circles[index].clicks = (circles[index].clicks || 0) + 10;
       circles[index].remainingTime = 100;

      circles[index].timerRecords.push(newRecord);
      localStorage.setItem('circles', JSON.stringify(circles));
      playSound();
      navigate(-1); // 타이머가 0이 되면 이전 페이지로 돌아가기
      return;
    }

    const timerId = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [time, navigate, minutes, index]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const handleGiveUp = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const playSound = () => {
    const audio = new Audio('/sounds/ding.mp3'); // Path to your sound file
    audio.play();
  };

  const opacity = time / (minutes * 60);

  return (
    <div className="timer-container">
       <h2 className="time-circle-text" style={{ opacity }}>{circleText}</h2>
      <h1 className="timer">{formatTime(time)}</h1>
      <button className="give-up-button" onClick={handleGiveUp}>포기하기</button>
    </div>
  );
};

export default TimerPage;
