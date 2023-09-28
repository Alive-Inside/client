import { Button, Card, Center, Flex, FocusTrap, Grid, Group, List, LoadingOverlay, Modal, NumberInput, Select, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useDebouncedValue, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { capitalize, chunk, flatMap, fromPairs, shuffle } from "lodash";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_ARTISTS_VALUE, DEFAULT_TRACKS_VALUE, DEFAULT_TRACK_VALUE, LARGE_SCREEN, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL as SEARCH_DEBOUNCE_INTERVAL, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL } from "../constants";
import musicalPreferences from "../../public/musicalPreferences";
import GetRecommendations from "../api/GetRecommendations";
import Artist from "../types/Artist";
import SpotifyUserData from "../types/SpotifyUserData";
import Track from "../types/Track";
import PlaylistModule from "./PlaylistModule";
import QuestionnaireFormValues from "../types/QuestionnaireFormValues";
import useStyles from "../styles";
import SpotifyLoginButton from "./SpotifyLoginButton";
import MetadataLink from "./MetadataLink";
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons";

const testFinalPage = false;
const FINAL_PROMPT_INDEX = 13

export default function Questions({ isLoggedIn }) {
    const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
    const [generatedPlaylistTracks, setGeneratedPlaylistTracks] = useState<Track[]>([]);
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    const { classes } = useStyles();
    const [promptIndex, setPromptIndex] = useState(process.env.NODE_ENV === 'production' ? 0 : testFinalPage ? FINAL_PROMPT_INDEX : 0);
    const [hasAnyQuestionBeenAnswered, setHasAnyQuestionBeenAnswered] = useState(false);
    const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);
    const [isSessionNotesModalOpened, setIsSessionNotesModalOpened] = useState(false);
    const [editingSessionNotes, setEditingSessionNotes] = useState("");
    const [sessionNotes, setSessionNotes] = useState("");

    useEffect(() => {
        setSpotifyUserData(JSON.parse(localStorage.getItem('spotifyUserData')));
        const previouslyGeneratedTracks = JSON.parse(localStorage.getItem('previouslyGeneratedTracks'))
        const savedSessionNotes = localStorage.getItem('sessionNotes')
        if (savedSessionNotes) {
            setSessionNotes(savedSessionNotes)
            setEditingSessionNotes(savedSessionNotes)
        }
        if (previouslyGeneratedTracks) {
            setGeneratedPlaylistTracks(previouslyGeneratedTracks);
            setPromptIndex(prompts.length - 1);
        }
    }, [])

    const PromptText = ({ children }) => {
        return (
            <Text style={{ whiteSpace: 'normal', marginBottom: '1rem' }} size={largeScreen ? 'lg' : 'md'}>{children}</Text>
        )
    }

    const getCurrentFormValue = formValue => form.values[formValue] as (Track | Artist)[];

    const form = useForm<QuestionnaireFormValues>({
        initialValues: {
            eldersFirstName: '',
            eldersBirthYear: 1950,
            musicalPreference: 'classical',
            earliestMusicLoved: DEFAULT_TRACK_VALUE,
            musiciansFromHeritage: DEFAULT_ARTISTS_VALUE,
            musiciansParentsListenedTo: DEFAULT_ARTISTS_VALUE,
            eldersFavoriteArtistsAsTeenager: DEFAULT_ARTISTS_VALUE,
            songsThatMakeYouCry: DEFAULT_TRACKS_VALUE,
            mostEmotionalMusicMemory: '',
            songsThatNobodyKnows: DEFAULT_TRACKS_VALUE,
            songsWithEmotionalMemories: DEFAULT_TRACKS_VALUE,
            canYouRecallEarliestMusicLoved: false,
            specialSongs: DEFAULT_TRACKS_VALUE,
            isEthnicMusicImportant: false
        },
        validate: {
            eldersFirstName: (val) => (val.length < 2 ? 'Name must have at least 2 letters' : null),
            eldersBirthYear: (val) => { return (val < 1900 ? "Year can't be older than 1900" : val > 2000 ? "Year can't be later than 2000" : null) },
            musicalPreference: (val) => musicalPreferences.find(mP => mP.value === val) === undefined ? "Preference isn't in the list" : null,
        },

    });

    const prompts: { isUnskippable?: boolean, searchType?: 'track' | 'artist', question?: string, formType: 'none' | 'multiSelect' | 'yesOrNo' | 'numberInput' | 'shortAnswer' | 'searchInput' | 'readonly', backTwice?: boolean, formValue?: keyof QuestionnaireFormValues, element: JSX.Element, }[] = [
        {
            isUnskippable: true, formType: 'readonly', element:
                <div className='welcome' style={{ textAlign: 'left' }}>
                    <PromptText>Nice to meet you, <b>{spotifyUserData?.name}</b>! </PromptText><br /><PromptText>{"Let's use music to give your elder their Memories."}</PromptText><br />
                    <PromptText>{"Your elder's answers to these questions will generate a Playlist. The real magic happens at the end where you can edit the Playlist for your elder."}
                    </PromptText>
                    <br />
                    <PromptText>Note: Before you sit down with your elder, check out our printable list of genres & artists to help you find their music. <b>
                        <MetadataLink href="https://drive.google.com/file/d/1Ox9EmFbrA3-wF0lcy_tAa7fPHmrQnxUE/view">(Link here!)</MetadataLink>
                    </b>
                    </PromptText>
                    <PromptText>When you are done save your Playlist to the Alive Inside Memory Bank, and share it with your family!</PromptText>
                </div>
        },
        {
            isUnskippable: true, question: "What is your Elders' first name?", formType: 'shortAnswer', formValue: 'eldersFirstName', element: <>
                <PromptText>{"What is your Elders' first name?"}</PromptText>
                <TextInput onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} autoComplete="off" autoFocus={true} variant="filled" size="lg" {...form.getInputProps('eldersFirstName')} />
            </>
        },
        {
            isUnskippable: true, question: "What year were they born?", formType: 'numberInput', formValue: 'eldersBirthYear', element: <>
                <PromptText>What year were they born?</PromptText>
                <NumberInput onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} variant="filled" size="lg" autoFocus={true} onKeyDownCapture={handleNext} min={1900} max={2000} {...form.getInputProps('eldersBirthYear')} />
            </>
        },
        {
            isUnskippable: true, question: "What kind of Music do they like?", formType: 'multiSelect', formValue: 'musicalPreference', element: <><PromptText>What kind of Music do they like?</PromptText>
                <Select autoFocus={true} variant="filled" size="lg" onKeyDown={e => e.preventDefault()} onKeyDownCapture={handleNext} data={musicalPreferences} {...form.getInputProps('musicalPreference')} />
            </>
        },
        {
            question: "Can you recall the earliest music you loved?", formType: 'yesOrNo', formValue: 'canYouRecallEarliestMusicLoved', element: <div key={'earliestMusicLovedYesOrNo'}>
                <PromptText>Time for the music! Ask your elder:</PromptText>
                <PromptText>Can you recall the earliest music you loved?</PromptText>
                <YesOrNoButtons />
            </div>,
        },
        {
            searchType: 'artist', question: "Name 3 musicians you loved when you were young.", formValue: 'earliestMusicLoved', formType: 'searchInput', element: <div key="earliestMusicLoved"><PromptText>Name 3 musicians you loved when you were young.</PromptText><PlaylistModule initialItems={getCurrentFormValue('earliestMusicLoved')} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: "artist", multiple: false }} spotifyUserData={spotifyUserData} />
            </div>
        },
        // {
        //     searchType: 'artist', question: "Who were your favorite musicians as a child?", backTwice: true, formType: 'searchInput', formValue: 'favoriteArtistsAsChild', element: <div key='favoriteArtistsAsAChild'> <PromptText>Who were your favorite musicians as a child?</PromptText><PlaylistModule initialItems={getCurrentFormValue('favoriteArtistsAsChild')} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} /></div>
        // },
        {
            backTwice: true, question: "Is your Ethnic Music important to you?", formType: 'yesOrNo', formValue: "isEthnicMusicImportant", element: <><PromptText>Is your Ethnic Music important to you?</PromptText><YesOrNoButtons /></>
        },
        {
            searchType: 'artist', question: "Name Ethnic Musicians you loved", formType: 'searchInput', formValue: "musiciansFromHeritage", element: <>
                <PromptText>Name Ethnic Musicians you loved</PromptText>
                <PlaylistModule initialItems={getCurrentFormValue('musiciansFromHeritage')} key={'musiciansFromHeritage'} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </>
        },
        {
            backTwice: true, formType: 'searchInput', formValue: 'songsThatMakeYouCry', element: <>
                <PromptText>{`Which songs can make you cry?`} </PromptText><PlaylistModule initialItems={getCurrentFormValue('songsThatMakeYouCry')} key={'songsThatMakeYouCry'} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} removeTrack={onRemoveTrack} addTrack={onAddTrack} />
            </>
        },
        {
            searchType: 'artist', question: "Were there any musicians your parents, older siblings, or mentors exposed you to that you loved?", formType: 'searchInput', formValue: 'musiciansParentsListenedTo', element: <>
                <PromptText>Were there any musicians your parents, older siblings, or mentors exposed you to that you loved</PromptText>
                <PlaylistModule key={'musiciansParentsListenedTo'} initialItems={getCurrentFormValue('musiciansParentsListenedTo')} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </>
        },
        {
            searchType: 'artist', question: "Name 3 of your favorite artists when you were young. Maybe you attended their concert or bought their albums?", formType: 'searchInput', formValue: 'eldersFavoriteArtistsAsTeenager', element: <div key='eldersFavoriteArtistsAsTeenager'>
                <PromptText>{`${form.values.eldersFirstName}, name 3 of your favorite artists when you were young.`} <br /> {`Maybe you attended their concert or bought their albums.`}</PromptText><PlaylistModule initialItems={getCurrentFormValue('eldersFavoriteArtistsAsTeenager')} key={'eldersFavoriteArtistsAsTeenager'} removeArtist={onRemoveArtist} addArtist={onAddArtist} searchType={{ item: 'artist', multiple: true }} spotifyUserData={spotifyUserData} />
            </div>
        },
        {
            question: "Do any special songs come to mind when you think about weddings, parties or even funerals or church services?", formType: 'searchInput', element: <div key='specialSongs'><PromptText>Do any special songs come to mind when you think about weddings, parties or even funerals or church services?</PromptText><PlaylistModule initialItems={getCurrentFormValue('specialSongs')} removeTrack={onRemoveTrack} addTrack={onAddTrack} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} /></div>, formValue: 'specialSongs'
        },
        {
            question: "Which songs do you love that no one knows that you love?", backTwice: true, formType: 'searchInput', element: <div key='songsThatNobodyKnows'>
                <PromptText>Which songs do you love that no one knows that you love?</PromptText>
                <PlaylistModule initialItems={getCurrentFormValue('songsThatNobodyKnows')} removeTrack={onRemoveTrack} addTrack={onAddTrack} searchType={{ item: 'track', multiple: true }} spotifyUserData={spotifyUserData} />
            </div>, formValue: 'songsThatNobodyKnows'
        },
        {
            searchType: 'track', question: 'Which songs fill you with emotions?', formType: 'searchInput', element: <div key={'songsWithEmotionalMemories'}><PromptText>Which songs fill you with emotions?</PromptText><PlaylistModule initialItems={getCurrentFormValue('songsWithEmotionalMemories')} removeTrack={onRemoveTrack} addTrack={onAddTrack} spotifyUserData={spotifyUserData} searchType={{ item: 'track', multiple: true }} /></div>, formValue: 'songsWithEmotionalMemories'
        },
        {
            isUnskippable: true, formType: 'readonly', element: <>
                <PromptText>{"Congratulations!! You are almost done! Your Playlist will be created from your choices. Now, you can edit, discard, and add more songs on the next screen. Press"} <b>Next</b> {`to generate ${form.values.eldersFirstName}'s Playlist`}</PromptText>
            </>
        },
        {
            formType: 'none', element: <>
                <Center>
                    <Grid mt='3rem' >
                        <Grid.Col span={9}>
                            <List size={largeScreen ? 'md' : 'xs'} style={{ textAlign: 'left', float: 'right' }} type="ordered">
                                <Text style={{ textAlign: 'left', height: '100%' }} size={'md'}><b>OK, now the fun starts!<br />{`Let's make your Playlist better!`}</b> </Text>
                                <br />
                                <List.Item>Listen to the songs with your Elder- notice how they react!</List.Item>
                                <List.Item>{`Remove any songs they don't like!`}</List.Item>
                                <List.Item>If they like a song, add more by the same artist by using the +5 button</List.Item>
                                <List.Item>If a new song comes to mind, find and add it using the search bar</List.Item>
                                <List.Item>When you are all done, send the list to family members and The Alive Inside Memory Bank to save forever! </List.Item>
                            </List>
                        </Grid.Col>
                        <Center>
                            <Grid.Col span={10}>
                                {generatedPlaylistTracks.length > 0 && <PlaylistModule startAgain={startAgain} initialItems={generatedPlaylistTracks} formValues={form.values} isFinalPlaylist={true} searchType={{ item: 'track', multiple: true }} generatedPlaylistTracks={generatedPlaylistTracks} spotifyUserData={spotifyUserData}>
                                    <Button onClick={handleOpenModal} variant="white" radius='xl'><IconPencil style={{ marginRight: '0.5rem' }} />Edit Session Notes</Button>
                                </PlaylistModule>
                                }
                            </Grid.Col>
                        </Center>
                    </Grid>
                </Center>
            </>
        }
    ]

    // Export Questions
    // console.log(prompts.map(p => p.question).join('\n'))

    function startAgain() {
        form.reset();
        localStorage.removeItem('previouslyGeneratedTracks')
        localStorage.removeItem('sessionNotes')
        localStorage.removeItem('formQuestionsAndAnswers')
        localStorage.removeItem('exportedSpotifyPlaylist')
        setGeneratedPlaylistTracks([]);
        setPromptIndex(0)
        setHasAnyQuestionBeenAnswered(false);
    }

    function onRemoveTrack(trackID: string) {
        const { formValue } = prompts[promptIndex];
        //@ts-ignore
        const oldFormValue: Track[] = form.values[formValue];
        form.setFieldValue(formValue, oldFormValue.filter(t => t.id !== trackID));
    }

    function onRemoveArtist(artistID: string) {
        const { formValue } = prompts[promptIndex];
        //@ts-ignore
        const oldFormValue: Artist[] = form.values[formValue];
        form.setFieldValue(formValue, oldFormValue.filter(a => a.id !== artistID));
    }

    function onAddArtist(artist: Artist) {
        const { formValue } = prompts[promptIndex];
        //@ts-ignore
        const oldFormValue: Artist[] = form.values[formValue];
        form.setFieldValue(formValue, [...oldFormValue ?? [], artist]);
    }

    function onAddTrack(track: Track) {
        const { formValue } = prompts[promptIndex];
        //@ts-ignore
        const oldFormValue: Track[] = form.values[formValue];
        form.setFieldValue(formValue, [...oldFormValue ?? [], track]);
    }

    function handleNext(e) {
        if (prompts[promptIndex].formType === 'searchInput') setHasAnyQuestionBeenAnswered(true)
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

    function handleSkip(e) {
        if (prompts[promptIndex].formType === 'yesOrNo') return setPromptIndex(promptIndex + 2);

        let buttonClickedOrEnterButtonPressed = [undefined, 13].includes(e.keyCode);
        if (buttonClickedOrEnterButtonPressed) {
            const currentPrompt = prompts[promptIndex];
            if (currentPrompt.formType === 'readonly' || !form.validateField(currentPrompt.formValue).error) {
                setPromptIndex(promptIndex + 1);
            }
        }
    }

    function YesOrNoButtons() {
        return <div style={{ marginBottom: '4rem' }}>
            <Button size="xl" radius='xl' variant="white" style={{ marginTop: '1rem' }} onClick={() => handleYesOrNoPrompt(false)}>No</Button>
            <Button size='xl' radius='xl' variant='white' style={{ marginLeft: '3rem' }} onClick={() => handleYesOrNoPrompt(true)}>Yes</Button>
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
        const { songsThatNobodyKnows, songsWithEmotionalMemories, eldersBirthYear, musicalPreference, musiciansFromHeritage, musiciansParentsListenedTo, eldersFavoriteArtistsAsTeenager, specialSongs, earliestMusicLoved, songsThatMakeYouCry } = form.values;

        const seedTracks = flatMap([songsThatNobodyKnows, songsWithEmotionalMemories, specialSongs, songsThatMakeYouCry]).map(s => { return { type: 'track', ...s } });
        const seedArtists = flatMap([musiciansFromHeritage, musiciansParentsListenedTo, eldersFavoriteArtistsAsTeenager, earliestMusicLoved]).map(a => { return { type: 'artist', ...a } });
        const mixedOrderedSeeds = shuffle([...seedArtists, ...seedTracks]);
        //@ts-ignore
        const chunkedSeeds: ((Artist | Track) & { type: 'track' | 'artist' })[][] = chunk(mixedOrderedSeeds, 5);

        const cumulativeRecommendedTracks: Track[] = [];
        const targetYear =
            seedTracks.map((t) => t.album.releaseYear).reduce((a, b) => a + b) /
            seedTracks.length;

        let chunkSize = 5;
        const chunks = chunkedSeeds.length
        while (chunks * chunkSize <= 100) {
            chunkSize++;
        }
        for (const chunk of chunkedSeeds) {
            const trackIDs = chunk.filter((item: any) => item.type === 'track').map(t => (t as any).id);
            const artistIDs = chunk.filter((item: any) => item.type === 'artist').map(a => (a as any).id);
            const recommendations = await GetRecommendations(chunkSize as 100, spotifyUserData.countryCode, { targetYear, duplicateTrackIDsToAvoid: cumulativeRecommendedTracks.map(crt => crt.id), trackIDs, artistIDs });
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
            if (currentPrompt.formType === 'searchInput' && answer === 'artist') {
                if (!form.values[formValue]) {
                    console.log(formValue)
                } else {
                    if ((form.values[formValue] as Artist[]).some(x => x?.name === undefined || x?.name === null)) { }
                }
            }
            switch (currentPrompt.formType) {
                case 'searchInput': answer = currentPrompt.searchType === 'artist' ? (form.values[formValue] as Artist[]).map(a => a.name).join(', ') : (form.values[formValue] as Track[]).map(t => `${t.title} - ${t.artist.name}`).join(', ')
                    break;
                case 'yesOrNo': answer = form.values[formValue] ? 'Yes' : 'No';
                    break;
                case 'multiSelect': answer = musicalPreferences.find(mP => mP.value === (form.values[formValue])).label;
                    break;
                //@ts-ignore
                default: answer = form.values[formValue];
            }
            return { question: p.question, answer }
        }).filter((p) => p.question !== undefined && ![undefined, ''].includes(p.answer));
        localStorage.setItem("formQuestionsAndAnswers", JSON.stringify(formQuestionsAndAnswers));
        setIsGeneratingPlaylist(false);
    }

    function handleOpenModal() {
        setIsSessionNotesModalOpened(true);
    }

    function handleSaveModal() {
        setIsSessionNotesModalOpened(false)
        setSessionNotes(editingSessionNotes)
        localStorage.setItem('sessionNotes', editingSessionNotes);
    }

    function handleCancelModal() {
        setEditingSessionNotes(sessionNotes);
        setIsSessionNotesModalOpened(false);
    }

    return (
        <>
            {
                <div style={{ maxWidth: "50rem", textAlign: 'center', padding: '10px' }} className="question">
                    <Modal
                        overlayOpacity={0.55}
                        overlayBlur={3}
                        title='Edit Session Notes' centered onClose={handleCancelModal} opened={isSessionNotesModalOpened}>
                        <Textarea data-autoFocus value={editingSessionNotes} onInput={e => setEditingSessionNotes(e.currentTarget.value)} maxLength={3000} maxRows={20} minRows={12}></Textarea>
                        <Button onClick={handleCancelModal} mt='sm' color='red' radius='xl'><IconX />Cancel</Button>
                        <Button onClick={handleSaveModal} mt='sm' style={{ float: 'right' }} color='green' radius='xl'><IconDeviceFloppy /> Save</Button>
                    </Modal>
                    {
                        !isLoggedIn ?
                            <Center>
                                <Card>
                                    <Text>To use the app, please log in</Text><br />
                                    <SpotifyLoginButton />
                                </Card>
                            </Center> :
                            <form>
                                {prompts[promptIndex].element}
                                <Group position="center" mt="md">
                                    {promptIndex >= 1 && promptIndex < prompts.length - 2 && <Button variant="white" size='lg' radius={'xl'} onClick={handleBack}><IconChevronLeft />Back</Button>}
                                    {(['readonly', 'multiSelect'].includes(prompts[promptIndex].formType) || (prompts[promptIndex].formType === 'searchInput' && form.values[prompts[promptIndex].
                                        //@ts-ignore
                                        formValue].length > 0) || (prompts[promptIndex].formType === 'shortAnswer' && form.values[prompts[promptIndex].formValue]?.length > 0) || (prompts[promptIndex].formType === 'numberInput' && !isNaN(form.values[prompts[promptIndex].formValue]))) && <Button radius={'xl'} size="lg" onClick={handleNext}>{promptIndex === 0 ? 'Begin' : 'Next'}<IconChevronRight /></Button>}{!prompts[promptIndex].isUnskippable && (prompts[promptIndex].formType === 'yesOrNo' || ((prompts[promptIndex].formType === 'searchInput' && [undefined, 0].includes(form.values[prompts[promptIndex].formValue]?.length)))) && ((promptIndex !== FINAL_PROMPT_INDEX || hasAnyQuestionBeenAnswered && promptIndex === FINAL_PROMPT_INDEX)) && <Button radius='xl' size='lg' onClick={handleSkip}>Skip<IconChevronsRight /></Button>}
                                </Group>
                            </form>
                    }
                </div>
            }
        </>
    )
}