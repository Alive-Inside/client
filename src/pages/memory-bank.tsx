import { Button, Container, Grid, Group, Header, ScrollArea, SimpleGrid, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconX } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SendEmail from "../api/SendEmail";
import Track from "../types/Track";
import useStyles from "../styles";
import SpotifyUserData from "../types/SpotifyUserData";
import EmailList from "../components/EmailList.tsx/EmailList";

export default function MemoryBankPage() {
    const tracks = useRef<Track[]>([]);
    const formQuestionsAndAnswers = useRef<{ question: string, answer: string }[]>([])
    const [emailsSent, setEmailsSent] = useState(false);
    const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);

    const [emails, setEmails] = useState<string[]>([]);

    function redirectToQuestions() {
        window.location.href = '/app';
    }

    useEffect(() => {
        try {
            setSpotifyUserData(JSON.parse(localStorage.getItem('spotifyUserData')));
            const formAnswers = JSON.parse(localStorage.getItem('formQuestionsAndAnswers'));
            formQuestionsAndAnswers.current = formAnswers;

            const previouslyGeneratedTracks = JSON.parse(localStorage.getItem('previouslyGeneratedTracks')) as Track[]
            tracks.current = previouslyGeneratedTracks;

            const emailsSent = JSON.parse(localStorage.getItem('emailsSent'));
            setEmailsSent(emailsSent);

            if ([formQuestionsAndAnswers, previouslyGeneratedTracks].includes(null)) redirectToQuestions();
        } catch (e) {
            redirectToQuestions();
        }

    }, []);

    async function onSubmit(emails: string[]) {
        try {
            const sessionNotes = localStorage.getItem('sessionNotes');
            await SendEmail(emails, formQuestionsAndAnswers.current, tracks.current.map(t => { return { title: t.title, artistName: t.artist.name } }), sessionNotes);
            setEmailsSent(true);
            localStorage.setItem('emailsSent', "true");
        } catch (e) {
            setEmailsSent(false);
            localStorage.setItem('emailsSent', "false");
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
            {!emailsSent ? <>
                {spotifyUserData &&
                    <>
                        <Title
                            p={'md'}
                            order={2}
                            size="h1"
                            weight={900}
                            align="center"
                        >
                            {"Save your Elder's memories"}
                        </Title>
                        <Text pb={5}>
                            {"Pick the emails to save your Elder's memories to"}
                        </Text>
                        <Text pb={5}>
                            {"We've already added the one you logged in with"}
                        </Text>
                        <Text>
                            Use the X button to remove an email
                        </Text>
                        <Container mt={"sm"}>
                            <EmailList initialEmails={[spotifyUserData?.email]} onSubmit={onSubmit} />
                        </Container>
                    </>
                }
            </> : <div>
                <Title
                    size="h2">
                    {"Your Elder's memories are stored!"}<br /> Click <Link href={'/app'}>here</Link> to use the app again.
                </Title>
            </div>
            }
        </div>
    )
}