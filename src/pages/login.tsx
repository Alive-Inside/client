import { Card, Center, Text } from "@mantine/core";
import SpotifyLoginButton from "../components/SpotifyLoginButton";

export default function Login({ }) {
    return (
        <Center>
            <Card>
                <Text>To use the app, please sign in with Spotify</Text><br />
                <SpotifyLoginButton />
            </Card>
        </Center>
    )
}