import Questions from "../components/Questions";
import { BackgroundImage, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import backgroundImage from '../../public/img/darkened_grandma.jpg';

export default function QuestionsPage({ spotifyUserData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function init() {
            const user = localStorage.getItem('spotifyUserData');
            setIsLoading(false);
            setIsLoggedIn(user !== null);
        }
        init();
    }, []);

    return (
        <BackgroundImage src={backgroundImage.src} style={{ height: '93.5vh' }}>
            <Skeleton visible={isLoading}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                        <Questions isLoggedIn={isLoggedIn} />
                </div>
            </Skeleton>
        </BackgroundImage>
    );
}
