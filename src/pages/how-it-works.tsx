import { Card, Center, Container, Image, Text, Title } from "@mantine/core";
import useStyles from "../styles";
import SpotifyLogo from '../../public/img/Spotify_Logo_RGB_Green.png';

export default function HowItWorksPage() {
    const { classes } = useStyles();
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            <Container w='130%' size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card >
                    <Title mt={2}>
                        INTERVIEW YOUR ELDER
                    </Title>
                    <Text mt={'xs'}>Sit down with your elder and do your simple interview. Record their answers and let the app do the rest! Use this time to learn about yourself and your elder!</Text>
                </Card>
            </Container>
            <Container w='130%' size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card>
                    <Title mt={2}>
                        REVIEW THE SONG-LIST
                    </Title>
                    <Text mt={'xs'}>{"Your answers magically create a list of songs from your elder's life. You can listen to the songs and edit the list, and share the list with family."}</Text>
                </Card>
            </Container>
            <Container w='150%' size={"lg"} className={classes.textContainer} mt={'xs'}>
                <Card>
                    <Title style={{ display: 'flex', alignItems: 'center' }} mt={2}>
                        SAVE TO <Image style={{ paddingLeft: '10px', width: '160px', }} src={SpotifyLogo.src} />
                    </Title>
                    <Text style={{ display: 'flex', alignItems: 'center' }} mt={'xs'}><Text w='225px'>
                        You can save your playlist to</Text> <Image mr='5px' style={{ width: '95px' }} src={SpotifyLogo.src} /> <Text style={{ display: 'flex', alignContent: 'center' }} w='350px'>for easy access and editing. With a Premium </Text><Image style={{ width: '95px', }} mr='5px' src={SpotifyLogo.src} /> <Text w='400px' style={{ display: 'flex', alignContent: 'center' }}>account, you can access the music offline.</Text></Text>
                </Card>
            </Container >
        </Container >
    )
}