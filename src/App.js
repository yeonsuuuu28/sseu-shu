import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Switch} from "react-router-dom";

import Main from "./Pages/Main"
import Weather from "./Pages/Weather"
import BorrowReturn from "./Pages/BorrowReturn"
import MyPage from "./Pages/MyPage"
import Borrowing from "./Pages/Borrowing"
import Returning from "./Pages/Returning"
import BorrowInst1 from "./Pages/BorrowInst1"
import BorrowInst2 from "./Pages/BorrowInst2"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<Main/>}/>
          <Route path="/weather" element={<Weather/>}/>
          <Route path="/:username/borrowreturn" element={<BorrowReturn/>}/>
          <Route path="/:username/borrow" element={<Borrowing/>}/>
          <Route path="/:username/borrowinst1" element={<BorrowInst1/>}/>
          <Route path="/:username/borrowinst2" element={<BorrowInst2/>}/>
          <Route path="/:username/return" element={<Returning/>}/>
          <Route path="/:username/mypage" element={<MyPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
