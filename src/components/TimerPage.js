import React, { useMemo,useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TimerPage.css';
import axios from 'axios';



const TimerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { minutes, index } = location.state || {};
  const [time, setTime] = useState(minutes * 60);
  const [circleText, setCircleText] = useState('');
  const [circle, setCircle] = useState([]);
  const [thinksGroup, setThinksGroup] = useState([]);

  const serverIdea = useMemo(()=>{
    return 
  },[])



  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/.netlify/functions/get_ideas',
     
      );
  
      const thinksGroup = result.data.thinks;
   
      const circles = thinksGroup[index];
       setThinksGroup(thinksGroup);
       setCircleText(circles.text)
       setCircle(circles);

      if (thinksGroup) {
        setCircle(thinksGroup[index]);
      }
    };
    fetchData();

},[index]);

  useEffect(() => {
let circles = circle;


    if (time === 0) {
  
      const newRecord = {
        timerDuration: minutes,
        startTime: Date.now(),
        success: true,
      };

   
       // 클릭 수를 증가시킴
       circles.clicks = (circles.clicks || 0) + 10;
      
       circles.remainingTime = 100;

      circles.timerRecords.push(newRecord);
      // thinksGroup.push(circles)
     thinksGroup[index] = circles;
     console.log(thinksGroup)

      const updateData = async () => {
        const result = await axios.post('/.netlify/functions/update_ideas',
          JSON.stringify({updatedCircles:thinksGroup})
        );
        console.log(result)
    
        // const thinks = [result.data];
        // setCircles(thinks);
      };
      updateData();
      // console.log("wwwwwww",circles)
      // console.log("ttttt",think)
    //   serverIdea.mutation(api.thinks.replaceIdea,{updatedCircles:think}).then((update)=>{
    //     const savedCircles = update;
    //  console.log(savedCircles)
    //   });

      // localStorage.setItem('circles', JSON.stringify(circles));
      playSound();
      navigate(-1); // 타이머가 0이 되면 이전 페이지로 돌아가기
      return;
    }

    const timerId = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, navigate, minutes, index, serverIdea]);




  
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
