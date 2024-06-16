// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import DetailPage from './components/DetailPage';
import TimerPage from './components/TimerPage';
import GamePage from './components/GamePage';
import MemoPage from './components/MemoPage';
import Navbar from './components/Navbar';
import './App.css'; // 스타일 파일을 임포트

function App() {
  return (
    <Router>
      <div>
      <Navbar />
        
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/memo" element={<MemoPage />} />
        <Route path="/game" element={<GamePage />} />
     </Routes>
      </div>
    </Router>
  );
}

export default App;
