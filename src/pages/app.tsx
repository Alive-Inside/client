import _ from "lodash";
import SpotifyUserData from "../types/SpotifyUserData";
import Questions from "../components/Questions";
import { InferGetServerSidePropsType } from "next";

export default function QuestionsPage({ spotifyUserData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Questions spotifyUserData={spotifyUserData} />
        </div>
    )
}

export function getServerSideProps(context) {
    try {
        console.log('cookies:',context.req.cookies)
        const { accessToken, refreshToken, countryCode, avatar, name, expiresAt, userId, email, isPremium } = JSON.parse(context.req?.cookies?.spotifyUserData);
        const spotifyUserData: SpotifyUserData = { countryCode, avatar, accessToken, refreshToken, expiresAt, name, userId, email, isPremium };
        console.log(spotifyUserData)
        return { props: { spotifyUserData } }
    } catch (e) {
        console.error(e)
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
}
