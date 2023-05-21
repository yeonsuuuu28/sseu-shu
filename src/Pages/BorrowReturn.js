import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, TextField }  from '@mui/material';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Rain from "../Assets/raining.svg"
import Return from "../Assets/return.svg"
import Borrow from "../Assets/borrow.svg"
import Map from "../Assets/map.png"
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';

const BorrowReturn = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const [umbrella, setUmbrella] = useState("")
    const username = window.location.href.split("/")[window.location.href.split("/").length - 2]

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

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db)
        get(child(dbRef, 'umbrellas/')).then((snapshot) => {
            setUmbrella(Object.entries(snapshot.val()))
        })
    })

    function handleborrow() {
        let timenow = 0
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const date2 = date.getDate();
        const dateStr = year + "-" + month + "-" + date2
        timenow = dateStr

        const db = getDatabase();
        const dbRef = ref(db)
        update(ref(db, 'users/' + username), {
            borrow_date: timenow,
            borrow: true,
            days_elapsed: 0
        });
        window.location.href = "/" + username + "/return";
    }

    function handlereturn() {
        let timenow = 0
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const date2 = date.getDate();
        const dateStr = year + "-" + month + "-" + date2
        timenow = dateStr

        const db = getDatabase();
        const dbRef = ref(db)
        update(ref(db, 'users/' + username), {
            borrow_date: "none",
            borrow: false,
            days_elapsed: 0
        });
    }

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
                        <a style={{textDecoration: "none", color: "black"}} href={"/" + userInfo.email.split("@")[0] + "/mypage"}>내 페이지</a><br/>
                        <a style={{textDecoration: "none", color: "black"}} onClick={() => {signOutWithGoogle(); window.location.href = "/main";}} href="# ">로그아웃하기</a>
                    </div>
            : <div></div>}
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "72vh"}}>
                <table style={{marginLeft: "auto", marginRight: "auto", borderSpacing: "0", paddingTop: "13vh"}}>
                    <tr>
                        <td style={{borderRight: "0px solid black", textAlign: "center"}}>
                            <div className="zoom" onClick={() => handleborrow()} style={{border: "5px solid black", marginRight: "8vw", padding: "2vw", borderRadius: "25px", fontFamily: "Pretendard", fontSize: "3vw", fontWeight: "700", boxShadow: "10px 10px 20px grey", cursor: "pointer"}}>
                                <ArrowCircleDownRoundedIcon style={{fontSize: "18vw"}}/>
                                <div style={{paddingTop: "3vh"}}></div>
                                대여하기
                            </div>
                        </td>
                        <td style={{borderLeft: "0.5px solid black", textAlign: "center"}}>
                            <div className="zoom" style={{border: "5px solid black", marginLeft: "8vw", padding: "2vw", borderRadius: "25px", fontFamily: "Pretendard", fontSize: "3vw", fontWeight: "700", boxShadow: "10px 10px 20px grey", cursor: "pointer"}}>
                                <ArrowCircleUpRoundedIcon style={{fontSize: "18vw"}}/>
                                <div style={{paddingTop: "3vh"}}></div>
                                반납하기
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default BorrowReturn