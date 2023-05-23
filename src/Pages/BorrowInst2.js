import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, TextField }  from '@mui/material';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Umb from "../Assets/umbrella.svg"
import Map from "../Assets/map.png"
import Modal from '@mui/material/Modal';

const BorrowInst2 = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [umbrella, setUmbrella] = useState([[0,0], [0,0], [0,0]])
    const [token, setToken] = useState(0)
    const username = window.location.href.split("/")[window.location.href.split("/").length - 2]
    const [openModal, setOpenModal] = useState(false);
    const [umb, setUmb] = useState("대기 중...")
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    // setInterval(checkTagged, 1000);

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db)
        get(child(dbRef, 'umbrellas/')).then((snapshot) => {
            setUmbrella(Object.entries(snapshot.val()))
        })
        get(child(dbRef, 'users/' + username)).then((snapshot) => {
            setToken(snapshot.val()["total_token"])
        })
    }, [])


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

    // function checkTagged() {
    //     const db = getDatabase();
    //     const dbRef = ref(db)
    //     var tagged_rfid = ""
    //     var my_rfid = ""
    //     get(child(dbRef, 'controls/')).then((snapshot) => {
    //         tagged_rfid = snapshot.val()["RFID_user"]
    //         get(child(dbRef, 'users/' + username)).then((snapshot) => {
    //             my_rfid = snapshot.val()["RFID_user"]
    //             if (tagged_rfid === my_rfid) {
    //                 setTag("태그가 확인되었습니다.")
    //                 setTimeout(function() {
                        
    //                 }, 1000);
    //             }
    //         })
    //     })
    // }

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
            {page === 1 ? 
                <div style={{textAlign: "center", fontFamily: "Pretendard"}}>
                    <div style={{fontSize: "5vh", fontWeight: "700", paddingTop: "15vh", lineHeight: "1.5"}}>보관함이 개방되었습니다. <br/> 우산을 하나 꺼낸 후 문을 닫아주세요.</div> <br/>
                    <img src = {Umb} alt="" style={{height: "35vh", paddingTop: "2vh"}}/> <br/>
                    <div style={{fontSize: "3vh", fontWeight: "500", paddingTop: "8vh"}}>{umb}</div>
                </div>
            : <div></div>}
        </div>
    )
}

export default BorrowInst2