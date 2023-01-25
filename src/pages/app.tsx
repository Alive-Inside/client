import _ from "lodash";
import SpotifyUserData from "../types/SpotifyUserData";
import Questions from "../components/Questions";
import { InferGetServerSidePropsType } from "next";
import { cookies } from 'next/headers';
import GetCurrentUser from "../api/GetCurrentUser";
import { Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";

export default function QuestionsPage({ spotifyUserData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function init() {
            const user = localStorage.getItem('spotifyUserData')
            setIsLoading(false);
            setIsLoggedIn(user !== undefined);
        }
        init();
    }, [])

    return (
        <Skeleton visible={isLoading}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Questions isLoggedIn={isLoggedIn} />
            </div>
        </Skeleton>
    )
}