// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import DetailPage from './components/DetailPage';
import TimerPage from './components/TimerPage';
import PhaserGame from './components/PhaserGame';
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
        <Route path="/game" element={<PhaserGame />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
