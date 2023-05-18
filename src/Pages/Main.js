import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, TextField }  from '@mui/material';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Rain from "../Assets/raining.svg"

const Main = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)

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

    function handleclick() {
        const db = getDatabase();
        const dbRef = ref(db)
        if (userInfo === null) {
            alert("우산 대여/반납을 위해서는 로그인 해주세요.")
        } 
        else {
            get(child(dbRef, 'users/')).then((snapshot) => {
                if (snapshot.exists()) {
                    // window.location.href = "/" + userInfo.email.split("@")[0] + "/borrowreturn";
                    if (Object.keys(snapshot.val()).includes(userInfo.email.split("@")[0])) {
                        window.location.href = "/" + userInfo.email.split("@")[0] + "/borrowreturn";
                    }
                    else {
                        set(ref(db, 'users/' + userInfo.email.split('@')[0]), {
                            RFID_user: "11 AA 11 AA",
                            RFID_umbrella: "none",
                            borrow: false,
                            return: false,
                            borrow_place: "none",
                            borrow_date: "none",
                            days_elapsed: "none",
                            weight_before: 1000,
                            weight_after: "none",
                            total_token: 100,
                        });
                        window.location.href = "/" + userInfo.email.split("@")[0] + "/borrowreturn";
                    }
                }
                else {
                    set(ref(db, 'users/' + userInfo.email.split('@')[0]), {
                        RFID_user: "11 AA 11 AA",
                        RFID_umbrella: "none",
                        borrow: false,
                        return: false,
                        borrow_place: "none",
                        borrow_date: "none",
                        days_elapsed: "none",
                        weight_before: 1000,
                        weight_after: "none",
                        total_token: 100,
                    });
                    set(ref(db, 'umbrellas/'), {
                        North: 3,
                        East: 0,
                        West: 0,
                    })
                    window.location.href = "/" + userInfo.email.split("@")[0] + "/borrowreturn";
                }
            })
        }
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
                        <a style={{textDecoration: "none", color: "black"}} onClick={() => {signOutWithGoogle(); window.location.reload();}} href="# ">로그아웃하기</a>
                    </div> 
            : <div></div>}
            <div style={{textAlign: "right", position: "absolute", paddingLeft: "52vw", paddingTop: "20vh", zIndex: "-1"}}>
                <img src = {Rain} alt="" style={{height: "55vh", zIndex: "-1"}}></img>
            </div>
            <div style={{textAlign: "left", paddingTop: "25vh", paddingLeft: "10vw", fontFamily: "Pretendard", lineHeight: "1.5"}}>
                <div style={{fontSize: "23pt"}}>카이스트 공유 우산 시스템 <br/></div>
                <div style={{fontSize: "65pt", fontWeight: "900"}}>쓰슈</div>
                <div style={{cursor: "pointer", height: "45px", width: "150px", backgroundColor: "#2B04BE", marginTop: "7vh", borderRadius: "10px", color: "white", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10", float: "left"}}
                    onClick={() => handleclick()}>
                    <div style={{verticalAlign: "middle", fontWeight: "500", cursor: "pointer"}}>대여/반납</div>
                </div>
                <div style={{cursor: "pointer", height: "45px", width: "150px", backgroundColor: "white", marginTop: "7vh", borderRadius: "10px", color: "#2B04BE", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10", float: "left", marginLeft: "10px", border: "1px solid #2B04BE"}}
                    onClick={() => {window.location.href = "/weather"}}>
                    <div style={{verticalAlign: "middle", fontWeight: "500", cursor: "pointer"}}>오늘의 날씨</div>
                </div>
            </div>
        </div>
    )
}

export default Main