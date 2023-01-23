import _ from "lodash";
import SpotifyUserData from "../types/SpotifyUserData";
import Questions from "../components/Questions";

export default function QuestionsPage({ spotifyUserData }: { spotifyUserData: SpotifyUserData }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Questions spotifyUserData={spotifyUserData} />
        </div>
    )
}

export function getServerSideProps(context) {
    try {
        const { accessToken, refreshToken, countryCode, avatar, name, expiresAt, userId, email, isPremium } = JSON.parse(context.req?.cookies?.spotifyUserData);
        const spotifyUserData: SpotifyUserData = { countryCode, avatar, accessToken, refreshToken, expiresAt, name, userId, email, isPremium };
        return { props: { spotifyUserData } }
    } catch (e) {
        context.res.writeHead(302, { location: "/" });
        context.res.end();
        return { props: {} }
    }
}
