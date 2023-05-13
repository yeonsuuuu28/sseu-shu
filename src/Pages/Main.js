import React, { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, TextField }  from '@mui/material';
import { db, auth, analytics } from "../firebase.js";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import Logo from "../Assets/logo_3.png"

const Main = () => {
    return (
        <div style={{fontFamily: "Pretendard", textAlign: "left"}}>
            <div style={{backgroundColor: "#2B04BE", height: "10vh"}}>
                <div style={{fontSize: "17pt", fontWeight: "500", color: "white", 
                    lineHeight: "3.0vh", height: "3.0vh", letterSpacing: "0.75px", 
                    paddingTop: "1vh", paddingLeft: "1vw"}}>
                    <img src = {Logo} alt="" style={{height: "8vh"}}/>
                </div>
            </div>
        </div>
    )
}

export default Main