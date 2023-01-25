import { useRouter } from "next/router";
import { useEffect } from "react";
import DecodeToken from "../api/DecodeToken";

export default function Redirect() {
    const router = useRouter();
    useEffect(() => {
        async function decode() {
            const jwt = window.location.href.split('jwt=')[1];
            const spotifyUserData = await DecodeToken(jwt)
            localStorage.setItem('spotifyUserData', JSON.stringify(spotifyUserData))
            console.log(spotifyUserData)
            router.replace('/');
        };
        try {
            decode();
        } catch {
            router.replace('/');
        }
    }, []);
}
