import { Card, Center, Container, Text, Title } from "@mantine/core";
import useStyles from "../styles";

export default function HowItWorksPage() {
    const { classes } = useStyles();
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            <Container size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card>
                    <Title mt={2}>
                        INTERVIEW YOUR ELDER
                    </Title>
                    <Text mt={'xs'}>Sit down with your elder and do your simple interview. Record their answers and let the app do the rest! Use this time to learn about yourself and your elder!</Text>
                </Card>
            </Container>
            <Container size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card>
                    <Title mt={2}>
                        REVIEW THE SONG-LIST
                    </Title>
                    <Text mt={'xs'}>{"Your answers magically create a list of songs from your elder's life. You can listen to the songs and edit the list, and share the list with family."}</Text>
                </Card>
            </Container>
            <Container size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card>
                    <Title mt={2}>
                        SAVE TO SPOTIFY
                    </Title>
                    <Text mt={'xs'}>You can save your playlist to Spotify for easy access and editing. With a Premium Spotify account, you can access the music offline.</Text>
                </Card>
            </Container>
        </Container>
    )
}