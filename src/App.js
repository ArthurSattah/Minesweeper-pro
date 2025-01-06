import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './components/home/Home';
import Game from './components/game/Game';

function App (props) {
  return (
    <Routes>
      <Route path="https://arthursattah.github.io/Minesweeper-pro/" element={<Home/>} />
      <Route path="https://arthursattah.github.io/Minesweeper-pro/start" element={<Game/>} />
    </Routes>
  );
}

export default App;
