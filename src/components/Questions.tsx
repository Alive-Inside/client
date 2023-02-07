import { Button, Card, Center, Flex, Grid, Group, List, LoadingOverlay, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { capitalize, chunk, flatMap, fromPairs, shuffle } from "lodash";
import { useEffect, useState } from "react";
import { DEFAULT_ARTISTS_VALUE, DEFAULT_TRACKS_VALUE, DEFAULT_TRACK_VALUE, LARGE_SCREEN, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL as SEARCH_DEBOUNCE_INTERVAL, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL } from "../constants";
import musicalPreferences from "../../public/musicalPreferences";
import GetRecommendations from "../api/GetRecommendations";
import Artist from "../types/Artist";
import SpotifyUserData from "../types/SpotifyUserData";
import Track from "../types/Track";
import PlaylistModule from "./PlaylistModule";
import QuestionnaireFormValues from "../types/QuestionnaireFormValues";
import useStyles from "../styles";
import { IconBrandSpotify } from "@tabler/icons";
import Link from "next/link";
import SpotifyLoginButton from "./SpotifyLoginButton";

export default function Questions({ isLoggedIn }) {
    const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
    const [generatedPlaylistTracks, setGeneratedPlaylistTracks] = useState<Track[]>([]);
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    const { classes } = useStyles();
    const [promptIndex, setPromptIndex] = useState(0);
    const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);

    useEffect(() => {
        setSpotifyUserData(JSON.parse(localStorage.getItem('spotifyUserData')));
        const previouslyGeneratedTracks = JSON.parse(localStorage.getItem('previouslyGeneratedTracks'))
        if (previouslyGeneratedTracks) {
            setGeneratedPlaylistTracks(previouslyGeneratedTracks);
            setPromptIndex(prompts.length - 1);
        }
    }, [])

    const PromptText = ({ children }) => { return (<Text style={{ marginBottom: '1rem' }} size='lg'>{children}</Text>) }

    const getCurrentFormValue = formValue => form.values[formValue] as (Track | Artist)[];

    const form = useForm<QuestionnaireFormValues>({
        initialValues: {
            eldersFirstName: '',
            eldersBirthYear: 1950,
            musicalPreference: 'classical',
            firstSongHeard: DEFAULT_TRACK_VALUE,
            favoriteArtistsAsChild: DEFAULT_ARTISTS_VALUE,
            musiciansFromHeritage: DEFAULT_ARTISTS_VALUE,
            musiciansParentsListenedTo: DEFAULT_ARTISTS_VALUE,
            eldersFavoriteArtistsAsTeenager: DEFAULT_ARTISTS_VALUE,
            songsThatMakeYouCry: DEFAULT_TRACKS_VALUE,
            mostEmotionalMusicMemory: '',
            songsWithConnectedLifeEvents: DEFAULT_TRACKS_VALUE,
            songsThatNobodyKnows: DEFAULT_TRACKS_VALUE,
            songsWithEmotionalMemories: DEFAULT_TRACKS_VALUE,
            canYouRecallFirstSongYouHeard: false,
            doYouHaveLifeEventsConnectedWithSongs: false,
            isEthnicMusicImportant: false
        },
        validate: {
            eldersFirstName: (val) => (val.length < 2 ? 'Name must have at least 2 letters' : null),
            eldersBirthYear: (val) => { return (val < 1900 ? "Year can't be older than 1900" : val > 2000 ? "Year can't be later than 2000" : null) },
            musicalPreference: (val) => musicalPreferences.find(mP => mP.value === val) === undefined ? "Preference isn't in the list" : null,
        },

    });

    const prompts: { searchType?: 'track' | 'artist', question?: string, formType: 'none' | 'multiSelect' | 'yesOrNo' | 'numberInput' | 'shortAnswer' | 'searchInput' | 'readonly', backTwice?: boolean, formValue?: string, element: JSX.Element, }[] = [
        {
            formType: 'readonly', element:
                <div className='welcome' style={{ textAlign: 'left' }}>
                    <PromptText>Nice to meet you, <b>{spotifyUserData?.name}</b>! Welcome to the Alive Inside Empathy Revolution!</PromptText><br /><PromptText>{"Now let's use music to Re-connect your elder with their Memories."}</PromptText><br /><PromptText>{"Your elder's answers will generate a Song-list"}</PromptText><br /><PromptText>Remember to save your Song-list to the Alive Inside Memory Bank, and share with your family!</PromptText>
                </div>
        },
        {
            question: "What is your Elders' first name?", formType: 'shortAnswer', formValue: 'eldersFirstName', element: <>
                <PromptText>{"What is your Elders' first name?"}</PromptText>
                <TextInput onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} autoComplete="off" autoFocus={true} variant="filled" size="lg" {...form.getInputProps('eldersFirstName')} />
            </>
        },
        {
            question: "What year were they born?", formType: 'numberInput', formValue: 'eldersBirthYear', element: <>
                <PromptText>What year were they born?</PromptText>
                <NumberInput onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} variant="filled" size="lg" autoFocus={true} onKeyDownCapture={handleNext} min={1900} max={2000} {...form.getInputProps('eldersBirthYear')} />
            </>
        },
        {
            question: "What kind of Music do they like?", formType: 'multiSelect', formValue: 'musicalPreference', element: <><PromptText>What kind of Music do they like?</PromptText>
                <Select autoFocus={true} variant="filled" size="lg" onKeyDown={e => e.preventDefault()} onKeyDownCapture={handleNext} data={musicalPreferences} {...form.getInputProps('musicalPreference')} />
            </>
        },
        {
            question: "Can you recall the first song you heard?", formType: 'yesOrNo', formValue: 'canYouRecallFirstSongYouHeard', element: <div key={'firstSongHeardYesOrNo'}>
                <PromptText>Time for the music! Ask your elder:</PromptText>
                <PromptText>Can you recall the first song you heard?</PromptText>
                <YesOrNoButtons />
            </div>,
        },
        {
            searchType: 'track', question: "What is the first song you heard?", formValue: 'firstSongHeard', formType: 'searchInput', element: <div key="firstSongHeard"><PromptText>What is the first song you heard?</PromptText><PlaylistModule initialItems={getCurrentFormValue('firstSongHeard')} removeTrack={onRemoveTrack} addTrack={onAddTrack} searchType={{ item: "track", multiple: false }} spotifyUserData={spotifyUserData} />
            </div>
        },
        {
            searchType: 'artist', question: "Who were your favorite musicians as a child?", backTwice: true, formType: 'searchInput', formValue: 'favoriteArtistsAsChild', element: <div key='favoriteArtistsAsAChild'> <PromptText>Who were your favorite musicians as a child?</PromptText><PlaylistModule initialItems={getCurrentFormValue('favoriteArtistsAsChild')} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} /></div>
        },
        {
            question: "Is your ethnic heritage music important to you?", formType: 'yesOrNo', formValue: "doYouHaveLifeEventsConnectedWithSongs", element: <><PromptText>Is your ethnic heritage music important to you?</PromptText><YesOrNoButtons /></>
        },
        {
            searchType: 'artist', question: "Name notable musicians from your heritage", formType: 'searchInput', formValue: "musiciansFromHeritage", element: <>
                <PromptText>Name notable musicians from your heritage</PromptText>
                <PlaylistModule initialItems={getCurrentFormValue('musiciansFromHeritage')} key={'musiciansFromHeritage'} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </>
        },
        {
            backTwice: true, formType: 'searchInput', formValue: 'songsThatMakeYouCry', element: <>
                <PromptText>{`What songs can make you cry?`} </PromptText><PlaylistModule initialItems={getCurrentFormValue('songsThatMakeYouCry')} key={'songsThatMakeYouCry'} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} removeTrack={onRemoveTrack} addTrack={onAddTrack} />
            </>
        },
        {
            searchType: 'artist', question: "Which musicians did your parents listen to when you were growing up?", formType: 'searchInput', formValue: 'musiciansParentsListenedTo', element: <>
                <PromptText>Which musicians did your parents listen to when you were growing up?</PromptText>
                <PlaylistModule key={'musiciansParentsListenedTo'} initialItems={getCurrentFormValue('musiciansParentsListenedTo')} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </>
        },
        {
            searchType: 'artist', question: "Who were your favorite artists as a teenager?", formType: 'searchInput', formValue: 'eldersFavoriteArtistsAsTeenager', element: <div key='eldersFavoriteArtistsAsTeenager'>
                <PromptText>Dear {form.values.eldersFirstName}, who were your favorite artists as a teenager?</PromptText><PlaylistModule initialItems={getCurrentFormValue('eldersFavoriteArtistsAsTeenager')} key={'eldersFavoriteArtistsAsTeenager'} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </div>
        },
        {
            question: "What is your most emotional music memory?", formType: 'shortAnswer', formValue: 'mostEmotionalMusicMemory', element: <>
                <PromptText>What is your most emotional music memory?</PromptText><TextInput autoFocus={true} placeholder="Share your memories" autoComplete="off" variant="filled" size="lg" onKeyDownCapture={handleNext} {...form.getInputProps('mostEmotionalMusicMemory')} />
            </>
        },
        {
            question: "Do you have any life events that are connected with songs?", formValue: "isEthnicMusicImportant", formType: 'yesOrNo', element: <><PromptText>Do you have any life events that are connected with songs?</PromptText><YesOrNoButtons /></>
        },
        {
            question: "Which songs do you have connected life events with?", formType: 'searchInput', element: <div key='songsConnectedWithLifeEvents'><PromptText>Which songs are connected to your life events?</PromptText><PlaylistModule initialItems={getCurrentFormValue('songsWithConnectedLifeEvents')} removeTrack={onRemoveTrack} addTrack={onAddTrack} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} /></div>, formValue: 'songsWithConnectedLifeEvents'
        },
        {
            question: "Which songs do you love that no one knows that you love?", backTwice: true, formType: 'searchInput', element: <div key='songsThatNobodyKnows'>
                <PromptText>Which songs do you love that no one knows that you love?</PromptText>
                <PlaylistModule initialItems={getCurrentFormValue('songsThatNobodyKnows')} removeTrack={onRemoveTrack} addTrack={onAddTrack} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} />
            </div>, formValue: 'songsThatNobodyKnows'
        },
        {
            searchType: 'track', question: 'Which songs do you have emotional memories with?', formType: 'searchInput', element: <div key={'songsWithEmotionalMemories'}><PromptText>Do you have any songs with emotional memories?</PromptText><PlaylistModule initialItems={getCurrentFormValue('songsWithEmotionalMemories')} removeTrack={onRemoveTrack} addTrack={onAddTrack} spotifyUserData={spotifyUserData} searchType={{ item: 'track', multiple: true }} /></div>, formValue: 'songsWithEmotionalMemories'
        },
        {
            formType: 'readonly', element: <>
                <PromptText>{"Congratulations!! You are done! Your Song-list will be created from the artists and songs you've added. You can add more later. Press"} <b>Next</b> {`to generate ${form.values.eldersFirstName}'s Song-list`}</PromptText>
            </>
        },
        {
            formType: 'none', element: <>
                <Center>
                    <Grid>
                        <Center>
                            <Grid.Col span={7}>
                                <Text style={{ textAlign: 'left' }} size={'lg'}><b>What happens now:</b> </Text>
                                <List size={largeScreen ? 'lg' : 'xs'} style={{ textAlign: 'left' }} type="ordered">
                                    <List.Item>Listen to the songs with your Elder</List.Item>
                                    <List.Item>Remove unwanted songs</List.Item>
                                    <List.Item>Add more songs using the +5 button</List.Item>
                                    <List.Item>Find new artists using the search bar</List.Item>
                                    <List.Item>{"Save the list to The Alive Inside Memory Bank for future use"}</List.Item>
                                </List>
                            </Grid.Col>
                            <Grid.Col span={10}>
                                {generatedPlaylistTracks.length > 0 && <PlaylistModule initialItems={generatedPlaylistTracks} formValues={form.values} isFinalPlaylist={true} searchType={{ item: 'track', multiple: true }} generatedPlaylistTracks={generatedPlaylistTracks} spotifyUserData={spotifyUserData} />}
                                <Button onClick={startAgain} radius="xl" variant="white">Start again</Button>
                            </Grid.Col>
                        </Center>
                    </Grid>
                </Center>
            </>
        }
    ]

    function startAgain() {
        localStorage.removeItem('previouslyGeneratedTracks')
        localStorage.removeItem('formQuestionsAndAnswers')
        setGeneratedPlaylistTracks([]);
        setPromptIndex(0)
    }

    function onRemoveTrack(trackID: string) {
        const { formValue } = prompts[promptIndex];
        const oldFormValue: Track[] = form.values[formValue];
        form.setFieldValue(formValue, oldFormValue.filter(t => t.id !== trackID));
    }

    function onRemoveArtist(artistID: string) {
        const { formValue } = prompts[promptIndex];
        const oldFormValue: Artist[] = form.values[formValue];
        form.setFieldValue(formValue, oldFormValue.filter(a => a.id !== artistID));
    }

    function onAddArtist(artist: Artist) {
        const { formValue } = prompts[promptIndex];
        const oldFormValue: Artist[] = form.values[formValue];
        form.setFieldValue(formValue, [...oldFormValue ?? [], artist]);
    }

    function onAddTrack(track: Track) {
        const { formValue } = prompts[promptIndex];
        const oldFormValue: Track[] = form.values[formValue];
        form.setFieldValue(formValue, [...oldFormValue ?? [], track]);
    }

    function handleNext(e) {
        if (promptIndex === 0) {
            localStorage.removeItem('previouslyGeneratedTracks');
            localStorage.removeItem('formQuestionsAndAnswers');
            localStorage.removeItem('emailsSent');
        }
        let buttonClickedOrEnterButtonPressed = [undefined, 13].includes(e.keyCode);
        if (promptIndex === prompts.length - 2) {
            generatePlaylistTracks();
        } else {
            if (buttonClickedOrEnterButtonPressed) {
                const currentPrompt = prompts[promptIndex];
                if (currentPrompt.formType === 'readonly' || !form.validateField(currentPrompt.formValue).error) {
                    setPromptIndex(promptIndex + 1);
                }
            }
        }
    }

    function YesOrNoButtons() {
        return <div style={{ marginBottom: '4rem' }}>
            <Button size='xl' radius='xl' variant="white" onClick={() => handleYesOrNoPrompt(true)}>Yes</Button><Button size="xl" radius='xl' variant='white' style={{ marginLeft: '3rem', marginTop: '1rem' }} onClick={() => handleYesOrNoPrompt(false)}>No</Button>
        </div>
    }

    function handleYesOrNoPrompt(answerIsYes: boolean) {
        const indexIncrementAmount = promptIndex + (answerIsYes ? 1 : 2);
        form.setFieldValue(prompts[promptIndex].formValue, answerIsYes);
        setPromptIndex(indexIncrementAmount);
    }

    function handleBack() {
        if (promptIndex > 0) {
            setPromptIndex(promptIndex - (prompts[promptIndex].backTwice ? 2 : 1));
        }
    }

    async function generatePlaylistTracks() {
        setPromptIndex(promptIndex + 1);
        setIsGeneratingPlaylist(true);
        const { songsThatNobodyKnows, songsWithConnectedLifeEvents, songsWithEmotionalMemories, eldersBirthYear, musicalPreference, musiciansFromHeritage, musiciansParentsListenedTo, favoriteArtistsAsChild, eldersFavoriteArtistsAsTeenager } = form.values;

        const seedTracks = flatMap([songsThatNobodyKnows, songsWithConnectedLifeEvents, songsWithEmotionalMemories]).map(s => { return { type: 'track', ...s } });
        const seedArtists = flatMap([musiciansFromHeritage, musiciansParentsListenedTo, favoriteArtistsAsChild, eldersFavoriteArtistsAsTeenager]).map(a => { return { type: 'artist', ...a } });
        const mixedOrderedSeeds = shuffle([...seedArtists, ...seedTracks]);
        //@ts-ignore
        const chunkedSeeds: ((Artist | Track) & { type: 'track' | 'artist' })[][] = chunk(mixedOrderedSeeds, 5);

        const cumulativeRecommendedTracks: Track[] = [];
        const targetYear =
            seedTracks.map((t) => t.album.releaseYear).reduce((a, b) => a + b) /
            seedTracks.length;

        for (const chunk of chunkedSeeds) {
            const trackIDs = chunk.filter((item: any) => item.type === 'track').map(t => (t as any).id);
            const artistIDs = chunk.filter((item: any) => item.type === 'artist').map(a => (a as any).id);
            const recommendations = await GetRecommendations(5, spotifyUserData.countryCode, { targetYear, duplicateTrackIDsToAvoid: cumulativeRecommendedTracks.map(crt => crt.id), trackIDs, artistIDs });
            if (recommendations === undefined) return;
            cumulativeRecommendedTracks.push(...recommendations);
        }

        const playlistTracks = shuffle([...seedTracks, ...cumulativeRecommendedTracks]);
        setGeneratedPlaylistTracks(playlistTracks);
        localStorage.setItem("previouslyGeneratedTracks", JSON.stringify(playlistTracks));
        const formQuestionsAndAnswers = prompts.map((p, i) => {
            const currentPrompt = prompts[i];
            const { formValue } = currentPrompt;
            let answer: string;
            switch (currentPrompt.formType) {
                case 'searchInput': answer = currentPrompt.searchType === 'artist' ? (form.values[formValue] as Artist[]).map(a => a.name).join(', ') : (form.values[formValue] as Track[]).map(t => `${t.title} - ${t.artist.name}`).join(', ')
                    break;
                case 'yesOrNo': answer = form.values[formValue] ? 'Yes' : 'No';
                    break;
                case 'multiSelect': answer = musicalPreferences.find(mP => mP.value === (form.values[formValue])).label;
                    break;
                default: answer = form.values[formValue];
            }
            return { question: p.question, answer }
        }).filter((p) => p.question !== undefined && ![undefined, ''].includes(p.answer));
        localStorage.setItem("formQuestionsAndAnswers", JSON.stringify(formQuestionsAndAnswers));
        setIsGeneratingPlaylist(false);
    }

    return (
        <>
            {
                <div style={{ maxWidth: "40rem", textAlign: 'center', padding: '10px' }} className="question">
                    {
                        !isLoggedIn ?
                            <Center>
                                <Card>
                                    <Text>To use the app, please sign in with Spotify</Text><br />
                                    <SpotifyLoginButton redirectToApp={true} />
                                </Card>
                            </Center> :
                            <form>
                                {prompts[promptIndex].element}
                                <Group position="center" mt="md">
                                    {promptIndex >= 1 && promptIndex < prompts.length - 2 && <Button variant="white" size='xl' radius={'xl'} onClick={handleBack}>Back</Button>}
                                    {(['readonly', 'multiSelect'].includes(prompts[promptIndex].formType) || (prompts[promptIndex].formType === 'searchInput' && form.values[prompts[promptIndex].formValue].length > 0) || (prompts[promptIndex].formType === 'shortAnswer' && form.values[prompts[promptIndex].formValue]?.length > 0) || (prompts[promptIndex].formType === 'numberInput' && !isNaN(form.values[prompts[promptIndex].formValue]))) && <Button variant="white" radius={'xl'} size="xl" onClick={handleNext}>{promptIndex === 0 ? 'Begin' : 'Next'}</Button>}
                                </Group>
                            </form>
                    }
                </div>
            }
        </>
    )
}

