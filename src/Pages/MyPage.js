import React, { useState, useEffect } from 'react';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Profile from "../Assets/profile.png"

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const [token, setToken] = useState("")
    const [borrow, setBorrow] = useState("")
    const [place, setPlace] = useState("")
    const [date, setDate] = useState("")
    const [elapsed, setElapsed] = useState("")
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
        let timenow = 0
        const date = new Date();
        const date2 = date.getDate();
        const db = getDatabase();
        const dbRef = ref(db)
        get(child(dbRef, 'users/' + username)).then((snapshot) => {
            if (snapshot.val()["borrow_date"] !== "none") {
                update(ref(db, 'users/' + username), {
                    days_elapsed: parseInt(parseInt(date - new Date(snapshot.val()["borrow_date"])) / (1000*60*60*24))
                });
                //need to decrease token
                setToken(snapshot.val()["total_token"])
                setBorrow(snapshot.val()["borrow"])
                setPlace(snapshot.val()["borrow_place"])
                setDate(snapshot.val()["borrow_date"])
                setElapsed(parseInt(parseInt(date - new Date(snapshot.val()["borrow_date"])) / (1000*60*60*24)))
            }
            else {
                //need to decrease token
                setToken(snapshot.val()["total_token"])
                setBorrow(snapshot.val()["borrow"])
                setPlace("N/A")
                setDate("N/A")
                setElapsed("N/A")
            }
        })
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
            {userInfo !== null ? 
                <div style={{textAlign: "center"}}>
                    <div style={{fontFamily: "Pretendard", fontSize: "7vh", fontWeight: "700", paddingTop: "12vh"}}></div>
                    <img src = {Profile} alt="" style={{width: "24vw", border: "1px solid black", marginTop: "8vh", float: "left", marginLeft: "22vw"}} onClick={() => {window.location.href = "/main"}}/>
                    <div style={{width: "24vw", marginTop: "8vh", height: "30vh", float: "right", marginRight: "22vw"}}>
                        <div style={{fontFamily: "Pretendard", fontWeight: "700", fontSize: "5.5vh", paddingBottom: "1vh", paddingTop: "2vh"}}><b>{userInfo.displayName}</b></div> <br/>
                        <div style={{float: "left", fontFamily: "Pretendard", lineHeight: "2", textAlign: "right", fontSize: "2.7vh"}}>
                            <b>이메일 주소</b>:<br/><b>보유 토큰</b>:<br/><b>대여 여부</b>:<br/><b>대여 장소</b>:<br/><b>대여 일자</b>:<br/><b>대여 기간</b>:<br/>
                        </div>
                        <div style={{float: "right", fontFamily: "Pretendard", lineHeight: "2", textAlign: "left", paddingRight: "0.3vw", fontSize: "2.7vh"}}>
                            {console.log(token)}
                            {userInfo.email} <br/>
                            {token} 토큰 <br/>
                            {borrow === true ? <>예</> : <>아니오</>} <br/>
                            {place === "N/A" ? <>N/A</> : <>카이마루</>} <br/>
                            {date === "N/A" ? <>N/A</> : date} <br/>
                            {elapsed === "N/A" ? <>N/A</> : <>{elapsed} 일</>} {elapsed > 7 ? <><b style={{color: "#b90e0a"}}>(+{elapsed - 7}일 초과)</b></> : <></>} <br/>
                        </div>
                    </div>
                </div>
            : <div></div>}
        </div>
    )
}

export default MyPage