import React, { useState, useEffect } from 'react';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Card from "../Assets/card.svg"

const ReturnInst1 = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const username = window.location.href.split("/")[window.location.href.split("/").length - 2]
    const [tag, setTag] = useState("대기 중...")

    setInterval(checkTagged, 1000);

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

    function checkTagged() {
        const db = getDatabase();
        const dbRef = ref(db)
        var tagged_rfid = ""
        var my_rfid = ""
        get(child(dbRef, 'controls/')).then((snapshot) => {
            tagged_rfid = snapshot.val()["RFID_user"]
            get(child(dbRef, 'users/' + username)).then((snapshot) => {
                my_rfid = snapshot.val()["RFID_user"]
                if (tagged_rfid === my_rfid) {
                    update(ref(db, 'controls/'), {
                        open: true,
                        RFID_user: "",
                    });
                    setTag("태그가 확인되었습니다.")
                    setTimeout(function() {
                        window.location.href = "/" + username + "/returninst2"
                    }, 1000);
                }
            })
        })
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
            <div style={{textAlign: "center", fontFamily: "Pretendard"}}>
                <div style={{fontSize: "5.5vh", fontWeight: "700", paddingTop: "17vh"}}>보관함에 ID 카드를 태그해주세요.</div> <br/>
                <img src = {Card} alt="" style={{height: "30vh", paddingTop: "5vh"}}/> <br/>
                <div style={{fontSize: "3vh", fontWeight: "500", paddingTop: "8vh"}}>{tag}</div>
            </div>
        </div>
    )
}

export default ReturnInst1