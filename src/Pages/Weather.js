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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
            let description_kr = ""
            if (data.weather[0].description === "온흐림") {
                description_kr = "흐림"
            }
            else {
                description_kr = data.weather[0].description
            }
            console.log(description_kr)
            setWeather({
              id: data.weather[0].id,
              temperature: data.main.temp - 273.15,
              feels_like: data.main.feels_like - 273.15,
              max: data.main.temp_max - 273.15,
              min: data.main.temp_min - 273.15,
              humidity: data.main.humidity,
              main: data.weather[0].main,
              description: description_kr,
            });
          });
        },
    []);

    function createData(temp, feels_like, max, min, humidity) {
        return { temp, feels_like, max, min, humidity };
    }
          
    const rows = [createData(weather.temperature, weather.feels_like, weather.max, weather.min, weather.humidity)];
    

    return (
        <div style={{fontFamily: "Pretendard", textAlign: "left"}}>
            {console.log(weather)}
            <div style={{backgroundColor: "#2B04BE", height: "10vh", lineHeight: "10vh"}}>
                {userInfo === null ? 
                    <div style={{float: "right", color: "white", paddingRight: "2vw", fontWeight: "700", verticalAlign: "middle", fontSize: "13pt", cursor: "pointer"}}
                        onClick={signInWithGoogle} href="# ">
                        로그인하기
                    </div>
                    :
                    <div style={{display:"flex", flexwrap: "wrap", alignItems: "center", float: "right", color: "white", paddingRight: "2vw", fontWeight: "700", verticalAlign: "middle", fontSize: "13pt", cursor: "pointer"}}
                        onClick={() => {setOpen(!open)}} href="# ">
                        {userInfo.displayName}<ArrowDropDownIcon/>
                    </div>
                }
                <div style={{fontSize: "17pt", fontWeight: "500", color: "white", 
                    lineHeight: "3.0vh", height: "3.0vh", letterSpacing: "0.75px", 
                    paddingTop: "1vh", paddingLeft: "1vw"}}>
                    <img src = {Logo} alt="" style={{height: "8vh", cursor: "pointer"}} onClick={() => {window.location.href = "/main"}}/>
                </div>
            </div>
            {open ? 
                    <div style={{float: "right", paddingRight: "3vw", paddingLeft: "3vw", paddingTop: "2vh", paddingBottom: "2vh", lineHeight: "2.5", fontFamily: "Pretendard", fontWeight: "600", textAlign: "center", borderLeft: "1px solid black", borderBottom: "1px solid black", backgroundColor: "white"}}>
                        <a style={{textDecoration: "none", color: "black"}} href="/">내 페이지</a><br/>
                        <a style={{textDecoration: "none", color: "black"}} onClick={() => {signOutWithGoogle(); window.location.reload();}} href="# ">로그아웃하기</a>
                    </div> 
            : <div></div>}
            <div style={{fontFamily: "Pretendard", fontSize: "25pt", display: "flex", flexwrap: "wrap", fontWeight: "700", alignItems: "center", verticalAlign: "middle", textAlign: "center", width: "100%", margin: "0 auto", justifyContent: "center", paddingTop: "13vh"}}>
                오늘의 날씨는 {weather.description}입니다&nbsp; <SentimentSatisfiedAltIcon fontSize="large"/>
            </div>
            <div style={{textAlign: "center", paddingTop: "8vh"}}>
                <img src = {Weather_Image} alt="" style={{height: "34vh", zIndex: "-1"}}/>
            </div>
            <div style={{width: "100%", paddingTop: "8vh"}}>
            <TableContainer>
                <Table sx={{width: "60vw", margin: "auto"}} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{width: "10vw", fontFamily: "Pretendard", fontSize: "14pt", fontWeight: "600"}}>현재 온도</TableCell>
                        <TableCell align="center" sx={{width: "10vw", fontFamily: "Pretendard", fontSize: "14pt", fontWeight: "600"}}>체감 온도</TableCell>
                        <TableCell align="center" sx={{width: "10vw", fontFamily: "Pretendard", fontSize: "14pt", fontWeight: "600"}}>최고 온도</TableCell>
                        <TableCell align="center" sx={{width: "10vw", fontFamily: "Pretendard", fontSize: "14pt", fontWeight: "600"}}>최저 온도</TableCell>
                        <TableCell align="center" sx={{width: "10vw", fontFamily: "Pretendard", fontSize: "14pt", fontWeight: "600"}}>습도</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="1" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center" sx={{fontfamily: "Pretendard", fontSize: "12pt", fontWeight: "400", paddingTop: "2vh"}}>{weather.temperature?.toFixed(2)}</TableCell>
                        <TableCell align="center" sx={{fontfamily: "Pretendard", fontSize: "12pt", fontWeight: "400", paddingTop: "2vh"}}>{weather.feels_like?.toFixed(2)}</TableCell>
                        <TableCell align="center" sx={{fontfamily: "Pretendard", fontSize: "12pt", fontWeight: "400", paddingTop: "2vh"}}>{weather.max?.toFixed(2)}</TableCell>
                        <TableCell align="center" sx={{fontfamily: "Pretendard", fontSize: "12pt", fontWeight: "400", paddingTop: "2vh"}}>{weather.min?.toFixed(2)}</TableCell>
                        <TableCell align="center" sx={{fontfamily: "Pretendard", fontSize: "12pt", fontWeight: "400", paddingTop: "2vh"}}>{weather.humidity}%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
                </div>
        </div>
    )
}

export default Weather