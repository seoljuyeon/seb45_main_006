import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoggedInAtom, isSignPageAtom } from "@feature/Global";
import { defaultPostionAtom, defaultStackAtom } from "@feature/Global";
import { useGetDefaultPostion, useGetDefaultStack } from "@api/default/hook";

import { useGetMyDetail } from "@api/member/hook";

import Header from "@component/Header";
import Navigation from "@component/Navigation";
import ChatBot from "@container/chat/ChatBot";

import { isExistToken } from "@util/token-helper";
import { setItemToStorage } from "@util/localstorage-helper";

const HEIGHT = {
    SIGN_HEADER: 60,
    MAIN_HEADER: 110,
} as const;

function Layout() {
    const headerRef = useRef(null);
    const { pathname } = useLocation();

    const [isSignPage, setIsSignPage] = useRecoilState(isSignPageAtom);
    const [isLoggined, setIsLoggined] = useRecoilState(isLoggedInAtom);
    const setDefaultStack = useSetRecoilState(defaultStackAtom);
    const setDefaultPosition = useSetRecoilState(defaultPostionAtom);

    const [marginTop, setMarginTop] = useState<number>(HEIGHT.MAIN_HEADER);

    useEffect(() => {
        if (pathname.includes("/signup") || pathname.includes("/login") || pathname.includes("/setpro")) {
            setIsSignPage(true);
        } else {
            setIsSignPage(false);
            if (isExistToken()) {
                setIsLoggined(true);
            } else {
                setIsLoggined(false);
            }
        }
        if (isSignPage) {
            setMarginTop(HEIGHT.SIGN_HEADER);
        } else {
            setMarginTop(HEIGHT.MAIN_HEADER);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignPage, pathname]);

    const { data: position } = useGetDefaultPostion();

    useEffect(() => {
        if (position) {
            setDefaultPosition(position);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    const { data: stack } = useGetDefaultStack();

    useEffect(() => {
        if (stack) {
            setDefaultStack(stack);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stack]);

    const { data: myInfo } = useGetMyDetail();

    useEffect(() => {
        if (myInfo) {
            setItemToStorage("nickname", myInfo.nickname);
            setItemToStorage("profilePicture", myInfo.profilePicture);
        }
    }, [myInfo]);

    return (
        <>
            <div className="fixed z-10 flex w-full max-w-screen-xl flex-col bg-white" ref={headerRef}>
                <Header />
                {!isSignPage && <Navigation />}
            </div>
            <main
                className={`w-full max-w-screen-xl`}
                style={{ minHeight: `calc(100vh - ${marginTop}px)`, marginTop: `${marginTop}px` }}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
                {!isSignPage && isLoggined && <ChatBot />}
            </main>
        </>
    );
}

export default Layout;
