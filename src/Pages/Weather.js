import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, TextField }  from '@mui/material';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Weather_Image from "../Assets/weather.svg"
import axios from 'axios'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const Weather = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const [weather, setWeather] = useState("");

    useEffect(() => {
        getRedirectResult(auth).then((result) => {
            const user = result.user;
            console.log(user)
            setUserInfo(user)
        })
      }, []);

    useEffect(() => {
    return auth.onAuthStateChanged(user => {
        setUserInfo(user);
    })
    }, []);

    const APIkey = "aa365dfe119a948f085de294f20abf9d"
    const lat = "36.370495"
    const lon = "127.362599"
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=kr&appid=${APIkey}`

    useEffect(() => {
        axios.get(url).then((responseData) => {
            const data = responseData.data;
            setWeather({
              id: data.weather[0].id,
              temperature: data.main.temp - 273.15,
              feels_like: data.main.feels_like,
              humidity: data.main.humidity,
              main: data.weather[0].main,
              description: data.weather[0].description,
            });
          });
        }, []);

    return (
        
        <div style={{fontFamily: "Pretendard", textAlign: "left"}}>
            <div style={{backgroundColor: "#2B04BE", height: "10vh", lineHeight: "10vh"}}>
                {userInfo === null ? 
                    <div style={{float: "right", color: "white", paddingRight: "2vw", fontWeight: "700", verticalAlign: "middle", fontSize: "13pt", cursor: "pointer"}}
                        onClick={signInWithGoogle} href="# ">
                        로그인하기
                    </div>
                    :
                    <div style={{display:"flex", flexwrap: "wrap", alignItems: "center", float: "right", color: "white", paddingRight: "2vw", fontWeight: "700", verticalAlign: "middle", fontSize: "13pt", cursor: "pointer"}}
                        onClick={() => {setOpen(!open)}} href="# ">
                            {/* () => {signOutWithGoogle(); setUserInfo(null); window.location.reload();} */}
                        {userInfo.displayName}<ArrowDropDownIcon/>
                    </div>
                }
                <div style={{fontSize: "17pt", fontWeight: "500", color: "white", 
                    lineHeight: "3.0vh", height: "3.0vh", letterSpacing: "0.75px", 
                    paddingTop: "1vh", paddingLeft: "1vw"}}>
                    <img src = {Logo} alt="" style={{height: "8vh"}}/>
                </div>
            </div>
            {open ? 
                    <div style={{float: "right", paddingRight: "3vw", paddingLeft: "3vw", paddingTop: "2vh", paddingBottom: "2vh", lineHeight: "2.5", fontFamily: "Pretendard", fontWeight: "600", textAlign: "center", borderLeft: "1px solid black", borderBottom: "1px solid black", backgroundColor: "white"}}>
                        <a style={{textDecoration: "none", color: "black"}} href="/">내 페이지</a><br/>
                        <a style={{textDecoration: "none", color: "black"}} onClick={() => {signOutWithGoogle(); window.location.reload();}} href="# ">로그아웃하기</a>
                    </div> 
            : <div></div>}
            <div style={{fontFamily: "Pretendard", fontSize: "25pt", display: "flex", flexwrap: "wrap", fontWeight: "700", alignItems: "center", verticalAlign: "middle", textAlign: "center", width: "100%", margin: "0 auto", justifyContent: "center", paddingTop: "15vh"}}>
                오늘의 날씨는 {weather.description}입니다&nbsp; <SentimentSatisfiedAltIcon fontSize="large"/>
            </div>
            <div style={{textAlign: "center", paddingTop: "8vh"}}>
                <img src = {Weather_Image} alt="" style={{height: "35vh", zIndex: "-1"}}/>
            </div>
        </div>
    )
}

export default Weather