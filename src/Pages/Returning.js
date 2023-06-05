import React, { useState, useEffect } from 'react';
import { db, auth, analytics, signInWithGoogle, signOutWithGoogle } from "../firebase.js";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { ref, set, update, child, get, onValue, getDatabase } from "firebase/database";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../Assets/logo_3.png"
import Card from "../Assets/card.svg"
import Map from "../Assets/map.png"
import Modal from '@mui/material/Modal';

const Returning = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [open, setOpen] = useState(false)
    const [umbrella, setUmbrella] = useState([[0,0], [0,0], [0,0]])
    const [token, setToken] = useState(0)
    const username = window.location.href.split("/")[window.location.href.split("/").length - 2]
    const [openModal, setOpenModal] = useState(false);
    const [elapsed, setElapsed] = useState(100)
    const [returnT, setReturnT] = useState(0)
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db)
        get(child(dbRef, 'umbrellas/')).then((snapshot) => {
            setUmbrella(Object.entries(snapshot.val()))
        })
        get(child(dbRef, 'users/' + username)).then((snapshot) => {
            setToken(snapshot.val()["total_token"])
            setElapsed(snapshot.val()["days_elapsed"])
        })
    }, [])

    useEffect(() => {
        if (elapsed <= 7) {
            setReturnT(50)
        }
        else {
            var penalty = 50 - ((elapsed - 7) * 10)
            if (penalty >= 0) {
                setReturnT(penalty)
            }
            else {
                setReturnT(0)
            }
        }
    }, [elapsed])

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

    function handlereturn1() {
        const db = getDatabase();
        const dbRef = ref(db)
        let remaining_umbre = umbrella[1][1] + 1
        update(ref(db, 'users/' + username), {
            total_token: token + returnT
        });
        update(ref(db, 'umbrellas/'), {
            North: remaining_umbre
        });
        window.location.href = "/" + username + "/returninst1"
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
            <div style={{textAlign: "center"}}>
                <img src = {Map} alt="" style={{height: "65vh", paddingTop: "8vh", opacity: "0.4"}}/>
                <div style={{position: "absolute", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
                    backgroundColor: "#2B04BE", width: "5vh", height: "5vh", top: "40%", left: "46%", transform: "translate(-50%, -50%)", color: "white",
                    fontFamily: "Pretendard", fontWeight: "700", fontSize: "2.5vh", cursor: "pointer", boxShadow: "5px 5px 10px grey", zIndex: "2"}}
                    onClick={() => handleOpen()}>
                    {umbrella[1][1]}
                </div>
                <Modal open={openModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <div style={{textAlign: "center", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40vw", height: "40vh", boxShadow: "24", backgroundColor: "white", outline: "none", border: "2px solid black"}}>
                        <div style={{fontFamily: "Pretendard", fontWeight: "700", fontSize: "5vh", paddingTop: "4vh", paddingBottom: "4vh"}}>토큰 반환 안내</div>
                        <div style={{fontFamily: "Pretendard", fontWeight: "400", fontSize: "2.5vh"}}>우산을 {elapsed}일 동안 대여하여 {returnT} 토큰이 반환됩니다. </div>
                        <div style={{paddingTop: "3vh", fontFamily: "Pretendard", fontSize: "2.5vh"}}><b>현재 토큰</b>: {token}</div>
                        <div style={{fontFamily: "Pretendard", fontSize: "2.5vh", paddingTop: "0.5vh"}}><b>잔여 토큰</b>: {token + returnT} </div>
                        <div style={{cursor: "pointer", height: "5.5vh", width: "13vw", backgroundColor: "#2B04BE", marginTop: "4vh", borderRadius: "10px", color: "white", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10", float: "left", marginLeft: "5vw"}}
                            onClick={() => handlereturn1()}>
                            <div style={{fontFamily: "Pretendard", fontSize: "2.5vh", verticalAlign: "middle", fontWeight: "500", cursor: "pointer"}}>확인</div>
                        </div>
                        <div style={{cursor: "pointer", height: "5.5vh", width: "13vw", backgroundColor: "white", marginTop: "4vh", borderRadius: "10px", color: "#2B04BE", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10", float: "right", marginRight: "5vw", border: "1px solid #2B04BE"}}
                            onClick={() => handleClose()}>
                            <div style={{fontFamily: "Pretendard", fontSize: "2.5vh", verticalAlign: "middle", fontWeight: "500", cursor: "pointer"}} >취소</div>
                        </div>
                    </div>
                </Modal>
                <div style={{position: "absolute", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
                    backgroundColor: "grey", width: "5vh", height: "5vh", top: "64.5%", left: "42.5%", transform: "translate(-50%, -50%)", color: "white",
                    fontFamily: "Pretendard", fontWeight: "700", fontSize: "2.5vh", boxShadow: "5px 5px 10px grey",}}>
                    {umbrella[2][1]}
                </div>
                <div style={{position: "absolute", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
                    backgroundColor: "grey", width: "5vh", height: "5vh", top: "61%", left: "52%", transform: "translate(-50%, -50%)", color: "white",
                    fontFamily: "Pretendard", fontWeight: "700", fontSize: "2.5vh", boxShadow: "5px 5px 10px grey",}}>
                    {umbrella[0][1]}
                </div>
                <div style={{fontFamily: "Pretendard", fontSize: "5vh", fontWeight: "700", paddingTop: "2vh"}}>반납 장소를 선택해주세요</div>
            </div>
        </div>
    )
}

export default Returning