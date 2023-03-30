import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import TopModalComponent from './wrap/TopModalComponent';
import HeaderComponent from './wrap/HeaderComponent';
import MainComponent from './wrap/MainComponent';
import FooterComponent from './wrap/FooterComponent';
import IntroModalComponent from './wrap/IntroModalComponent';
import QuickMenuComponent from './wrap/QuickMenuComponent';
import GoTopComponent from './wrap/GoTopComponent';
import Main1Component from './wrap/sub_page/Main1Component';
import SignUpComponent from './wrap/sub_page/SignUpComponent';

export default function WrapComponent(){

    const [state,setState] = React.useState({
        setId: 0,
        seconds: 59,
        minutes: 2,
        countPlay: false
    });

    // 카운트 플레이 세터함수 호출하면 변경 => 하위컴포넌트에서 호출실행한다.
    const setCountPlay=()=>{
        setState({
            ...state,
            countPlay: true
        })
    }

    // 카운트 중지함수

    


    // 카운트 다운 함수
    const hpCountDown=()=>{
        let setId = 0;
        let seconds = 59;
        let minutes = 2;

        setId = setInterval(function(){
            seconds--;
            if(seconds<0){
                seconds=59;
                minutes--;
                if(minutes<0){
                    
                    alert(`유효 시간이 만료되었습니다. 다시 시도해 주세요.`);    
                    clearInterval( setId );  // 타이머 중지                
                    seconds=0;
                    minutes=0;
                }
            }

            // 초, 분
            setState({
                setId: setId,
                seconds: seconds,
                minutes: minutes
            })
        },1000);
    }
    // 리액트 훅 사용(유즈이펙트)
    React.useEffect(()=>{
        state.countPlay && hpCountDown();  // state.countPlay true 이면 실행
    },[state.countPlay]); // [] 로딩시 1회만 실행 그러나 [state.countPlay] 상태값이 바뀌면 다시 실행 한다.

    return (
        <div id="wrap">
            <TopModalComponent />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HeaderComponent />}> 
                        <Route index element={<MainComponent />}/>
                        <Route path='신상품' element={<Main1Component />}/>
                        <Route path='회원가입' element={<SignUpComponent  setCountPlay={setCountPlay}  setId={state.setId}  seconds={state.seconds}  minutes={state.minutes} />}/>
                    </Route>
                </Routes>
            </BrowserRouter>

            <FooterComponent />
            <IntroModalComponent />
            <QuickMenuComponent />
            <GoTopComponent />           
        </div>
    )
}
