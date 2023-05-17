import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Switch} from "react-router-dom";

import Main from "./Pages/Main"
import Weather from "./Pages/Weather"
import BorrowReturn from "./Pages/BorrowReturn"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<Main/>}/>
          <Route path="/weather" element={<Weather/>}/>
          <Route path="/:username/borrowreturn" element={<BorrowReturn/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
