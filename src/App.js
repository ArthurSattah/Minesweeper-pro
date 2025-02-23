import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './components/home/Home';
import Game from './components/game/Game';
import NoMatch from './components/noMatch/NoMatch';

function App (props) {
  return (

    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="start" element={<Game/>} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
