import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './components/home/Home';
import Game from './components/game/Game';

function App (props) {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="start" element={<Game/>} />
    </Routes>
  );
}

export default App;
