// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // 스타일을 추가하기 위한 CSS 파일

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Main Page</Link></li>
        <li><Link to="/game">Game Page</Link></li>
        <li><Link to="/memo">Memo Page</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
