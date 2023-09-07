import { Card, Center, Text } from "@mantine/core";
import SpotifyLoginButton from "../components/SpotifyLoginButton";

export default function Login({ }) {
    return (
        <Center>
            <Card>
                <Text>To use the app, please log in</Text><br />
                <SpotifyLoginButton />
            </Card>
        </Center>
    )
}