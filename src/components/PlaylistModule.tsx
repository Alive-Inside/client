import { ActionIcon, Button, Center, Container, Image, Loader, Paper, ScrollArea, Skeleton, Text, TextInput } from "@mantine/core";
import { useClipboard, useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconDeviceFloppy, IconSearch, IconX } from "@tabler/icons";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer from "react-player/lazy";
import SpotifyIcon from '../../public/img/Spotify_Icon_RGB_Green.png';
import SpotifyLogo from '../../public/img/Spotify_Logo_RGB_Green.png';
import AddTracksToPlaylist from "../api/AddTrackToPlaylist";
import createPlaylist from "../api/CreatePlaylist";
import GetRecommendations from "../api/GetRecommendations";
import Search from "../api/Search";
import { LARGE_SCREEN, SPOTIFY_BLACK, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL } from "../constants";
import Artist, { LoadableArtist } from "../types/Artist";
import SpotifyUserData from "../types/SpotifyUserData";
import Track, { LoadableTrack } from "../types/Track";
import { showErrorNotification } from "../utils/notifications";
import AddedArtistRow from "./SpotifyResults/PlaylistAddedItemRow/AddedArtistRow";
import AddedTrackRow from "./SpotifyResults/PlaylistAddedItemRow/AddedTrackRow";
import ArtistResults from "./SpotifyResults/SearchResults/ArtistResults";
import TrackResults from "./SpotifyResults/SearchResults/TrackResults";
import SpotifyRow from "./SpotifyRow";

export type CurrentlyPlaying = { ringProgress: number, mp3PreviewUrl: string, trackId: string, state: 'playing' | 'not playing' | 'frame' | 'initial buffer' | 'buffering' };
const fakeTrack: LoadableTrack = {
    album: {
        id: '', largeImageUrl: '', name: 'Fake name', releaseYear: 1948,
        smallImageUrl: '', uri: '', url: ''
    }, artist: { id: '', name: 'Fake artist', url: '' }, id: ``, mp3PreviewUrl: '', title: 'Fake title', uri: '', url: '',
    loading: true,
    fake: true
}

const fakeArtist: LoadableArtist = {
    fake: true, id: '', largeImageUrl: '', name: 'Fake Artist', nextPaginationUrl: '', smallImageUrl: '', loading: true, url: ''
}

const searchLimit = 4;

export default function PlaylistModule({ startAgain, isLoadingTracks, formValues, spotifyUserData, searchType, generatedPlaylistTracks: generatedTracks, isFinalPlaylist, addTrack, addArtist, removeTrack, removeArtist, initialItems, children, }: { isLoadingTracks?: false, initialItems: (Track | Artist)[], formValues?: any, removeTrack?: Function, removeArtist?: Function, addTrack?: Function, addArtist?: Function, children?: any, isFinalPlaylist?: boolean, generatedPlaylistTracks?: Track[], spotifyUserData: SpotifyUserData, searchType: { item: 'track' | 'artist', multiple: boolean }, startAgain?: Function }) {
    const [tracks, setTracks] = useState<(Track & { loading?: boolean })[]>(generatedTracks ?? [fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack, fakeTrack,]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [spotifyPlaylist, setSpotifyPlaylist] = useState<{ id: string, url: string }>(null)
    const [loadingSpotifyPlaylist, setLoadingSpotifyPlaylist] = useState(true);
    const [trackSearchResults, setTrackSearchResults] = useState<Track[]>([]);
    const [artistSearchResults, setArtistSearchResults] = useState<Artist[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedQuery] = useDebouncedValue(searchQuery, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL);
    const [showCopiedText, setShowCopiedText] = useState(false);
    const [fiveTracksLoading, setFiveTracksLoading] = useState<Map<string, boolean>>(new Map());
    const [isLoadingSearchQuery, setIsLoadingSearch] = useState(false);
    const [isSavingToSpotify, setIsSavingToSpotify] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const clipboard = useClipboard();
    const viewport = useRef<HTMLDivElement>(null);
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>(null);

    useEffect(() => {
        if (searchType.item === 'track') {
            setTracks(initialItems as Track[])
        } else {
            setArtists(initialItems as Artist[])
        }
        const playlistLocalStorageItem = localStorage.getItem('exportedSpotifyPlaylist');
        if (playlistLocalStorageItem !== null) {
            const { id, url } = JSON.parse(playlistLocalStorageItem);
            setSpotifyPlaylist({ id, url })
        }
        setLoadingSpotifyPlaylist(false);
    }, [])

    useEffect(() => {
        search(searchQuery);
        setCurrentlyPlaying({ ringProgress: 0, mp3PreviewUrl: currentlyPlaying?.mp3PreviewUrl, state: 'not playing', trackId: currentlyPlaying?.trackId })
    }, [debouncedQuery, tracks])

    useEffect(() => {
        if (searchQuery.length === 0) {
            setCurrentlyPlaying({ ringProgress: 0, mp3PreviewUrl: currentlyPlaying?.mp3PreviewUrl, state: 'not playing', trackId: currentlyPlaying?.trackId })
        }
    }, [searchQuery])


    const onAddFive = useCallback(async (trackId: string) => {
        try {
            setFiveTracksLoading(new Map(fiveTracksLoading.set(trackId, true)))
            const insertIndex = tracks.indexOf(tracks.find(t => t.id === trackId)) + 1;
            const newTracks = [...tracks];

            const fakeTracks = [];
            for (let i = 0; i < 5; i++) {
                fakeTracks.push({ ...fakeTrack });
            }
            newTracks.splice(insertIndex, 0, ...fakeTracks)
            setTracks(newTracks)

            const { album: { releaseYear } } = tracks.find(t => t.id === trackId);
            const recommendedTracks = await GetRecommendations(5, spotifyUserData.countryCode, { targetYear: releaseYear, trackIDs: [trackId], onlyIncludeFromArtistID: tracks.find(t => t.id === trackId).artist.id, duplicateTrackIDsToAvoid: tracks.map(lT => lT.id) });
            if (recommendedTracks === undefined) return;

            newTracks.splice(insertIndex, 5, ...recommendedTracks);
            setTracks(newTracks);

            if (spotifyPlaylist !== null) await AddTracksToPlaylist(spotifyPlaylist.id, recommendedTracks.map(t => t.uri), spotifyUserData.accessToken, insertIndex);
            localStorage.setItem('previouslyGeneratedTracks', JSON.stringify(newTracks));
            setFiveTracksLoading(new Map(fiveTracksLoading.set(trackId, false)))
        } catch (e) {
            showErrorNotification('Error loading recommendations')
        }
    }, [tracks, fiveTracksLoading])

    const onRemoveTrack = useCallback((trackId: string) => {
        const newLocalTracks = tracks.filter(t => t.id !== trackId);
        setTracks(newLocalTracks);
        if (!isFinalPlaylist) {
            removeTrack(trackId);
        }
        localStorage.setItem('previouslyGeneratedTracks', JSON.stringify(newLocalTracks))
    }, [tracks]);

    const onAddTrack = useCallback(async (track: Track) => {
        if (isFinalPlaylist) {
            if (spotifyPlaylist !== null) {
                AddTracksToPlaylist(spotifyPlaylist.id, [track.uri], spotifyUserData.accessToken);
            }
        } else {
            addTrack(track);
        }
        setTracks([...tracks, track]);
        setSearchQuery('');
        setTrackSearchResults([]);
    }, [tracks])

    const onAddArtist = useCallback((artist: Artist) => {
        addArtist(artist);
        setSearchQuery('');
        setArtistSearchResults([]);
        setArtists([...artists, artist])
    }, [artists])

    const onRemoveArtist = useCallback((artistId: string) => {
        const newLocalArtists = artists.filter(a => a.id !== artistId);
        setArtists(newLocalArtists);
        removeArtist(artistId);
    }, [artists])

    async function exportPlaylist() {
        setIsSavingToSpotify(true);
        const { url, id } = await createPlaylist(formValues.eldersFirstName, formValues.eldersBirthYear, formValues.musicalPreference);
        setSpotifyPlaylist({ url, id })
        localStorage.setItem('exportedSpotifyPlaylist', JSON.stringify({ url, id }))
        await AddTracksToPlaylist(id, tracks.map(pT => pT.uri), spotifyUserData.accessToken);
        setIsSavingToSpotify(false)
    }

    useEffect(() => {
        if (searchQuery === '') {
            setTrackSearchResults([])
            setArtistSearchResults([])
            setIsSearching(false);
        } else {
            setIsSearching(true);
        }
    }, [searchQuery])

    const onTogglePlaying = useCallback((trackId: string, mp3PreviewUrl: string) => {
        if (currentlyPlaying?.trackId === trackId) {
            if (currentlyPlaying.state !== 'not playing') {
            }
            setCurrentlyPlaying({ ringProgress: 0, trackId, mp3PreviewUrl, state: currentlyPlaying?.state !== 'not playing' ? 'not playing' : 'initial buffer' })
        } else {
            setCurrentlyPlaying({ ringProgress: 0, trackId, mp3PreviewUrl, state: 'initial buffer' });
        }
    }, [currentlyPlaying])


    const onEnd = useCallback(() => {
        onTogglePlaying(currentlyPlaying.trackId, currentlyPlaying.mp3PreviewUrl);
    }, [currentlyPlaying]);

    const onProgress = (progress: OnProgressProps) => {
        const ringProgress = 100 * (progress.playedSeconds / progress.loadedSeconds)
        if (currentlyPlaying.state === 'initial buffer') {
            setCurrentlyPlaying({ ...currentlyPlaying, ringProgress, state: 'buffering', })
        } else if (currentlyPlaying.state === 'buffering') {
            setCurrentlyPlaying({ ...currentlyPlaying, ringProgress, state: 'playing', })
        } else {
            setCurrentlyPlaying({ ...currentlyPlaying, ringProgress })
        }
    }

    return (
        <div style={{ padding: '1em' }}>
            {currentlyPlaying &&
                <ReactPlayer progressInterval={10} onProgress={onProgress} style={{ display: 'none' }} onEnded={onEnd} url={currentlyPlaying?.mp3PreviewUrl} playing={currentlyPlaying?.state !== 'not playing'} />
            }
            <div>
                <Container mb={'md'} style={{ lineHeight: '1', justifyContent: 'center', display: 'flex', alignItems: 'center', height: '3.5rem', color: '#fff' }}>
                    {isFinalPlaylist && <Button onClick={() => startAgain()} radius="xl" variant="white"><IconArrowLeft /> Start again</Button>}
                    <TextInput
                        autoFocus={true} size='md' style={{ margin: `${!isFinalPlaylist ? "0 auto" : "0 0 0 1rem"}` }} value={searchQuery} className='searchBar' autoComplete="off" onChange={(e) => { setSearchQuery(e.currentTarget.value); }} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }} icon={
                            isLoadingSearchQuery ? <Loader size={17} color="black" style={{ marginBottom: '3px' }} /> : <ActionIcon variant="transparent" style={{ marginLeft: '0.25rem', marginBottom: '0' }}>
                                <IconSearch color='black' className="searchIcon" />
                            </ActionIcon>
                        } placeholder={`Search for ${searchType.item === 'artist' ? 'an artist' : 'a song'}`} rightSection={searchQuery &&
                            <div className='searchIcons' style={{ display: 'flex', alignItems: 'center', alignContent: 'center', userSelect: 'none', }}>
                                <IconX style={{ marginRight: '0.25rem' }} size={32} onClick={() => { setSearchQuery(''); setIsSearching(false); setIsLoadingSearch(false); setArtistSearchResults([]); setTrackSearchResults([]) }} color='black' className="cancelSearchIcon" />
                            </div>} />

                    {isFinalPlaylist &&
                        <div style={{ display: 'flex', flexDirection: 'row', margin: '1rem' }}>
                            {!isSavingToSpotify ? <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <a target="_blank" rel="noreferrer" href={spotifyPlaylist?.url}>
                                    <Skeleton visible={loadingSpotifyPlaylist} radius={'xl'}>
                                        <Button color='green' onClick={() => !spotifyPlaylist && exportPlaylist()} radius={'xl'} variant="outline" style={{ marginRight: '1rem' }}>{spotifyPlaylist ? <><Image style={{ height: '21px', width: '21px', marginRight: '0.5rem' }} src={SpotifyIcon.src} /> Open Playlist </> : <>Save to <Image src={SpotifyLogo.src} style={{ height: '70px', width: '70px', marginLeft: '0.3rem', marginTop: '49px' }} /> </>}</Button>
                                    </Skeleton>

                                </a>

                            </div> : <Loader style={{ marginLeft: '0.5em', marginRight: '1rem', marginTop: '0.75rem' }} variant="dots" color='green' />}
                            <Link href='/memory-bank'><Button color='blue' radius={'xl'} variant="outline" style={{}}><IconDeviceFloppy style={{ marginRight: '0.5rem' }} />Save to Memory Bank</Button> </Link>
                            <div style={{ marginLeft: '1rem' }}>
                                {children}
                            </div>
                        </div>

                    }
                </Container>

                <Center style={{ width: '100%' }}>
                    {(noResultsFound || trackSearchResults.length || artistSearchResults.length || tracks.filter(x => !x.fake).length > 0 || artists.filter(x => !x.fake).length > 0) && <Paper shadow="xs" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px', backgroundColor: SPOTIFY_BLACK }} w="100vw">
                        <ScrollArea.Autosize maxHeight={"45vh"} viewportRef={viewport}>
                            <div>
                                {noResultsFound && !isLoadingSearchQuery && [...trackSearchResults, ...artistSearchResults].length === 0 &&
                                    <SpotifyRow onTogglePlaying={onTogglePlaying}>
                                        <Text style={{ fontWeight: 'bold', wordWrap: 'break-word', width: '100%' }}>No results found for &quot;{debouncedQuery}&quot;</Text>
                                    </SpotifyRow>}
                                {searchType.item === 'track' &&
                                    !(noResultsFound && !isLoadingSearchQuery && [...trackSearchResults, ...artistSearchResults].length === 0) &&
                                    ((searchQuery.length === 0 || trackSearchResults.length === 0) && !isLoadingSearchQuery) && tracks.map((track, i) => {
                                        return <AddedTrackRow onTogglePlaying={onTogglePlaying} currentlyPlaying={currentlyPlaying} key={i} fiveTracksLoading={fiveTracksLoading.get(track.id)} onAddFive={onAddFive} isFinalPlaylist={isFinalPlaylist} track={track} onRemoveTrack={onRemoveTrack} />
                                    })
                                }
                                {searchType.item === 'artist' &&
                                    ((searchQuery.length === 0 || artistSearchResults.length === 0) && !isLoadingSearchQuery) && artists.map((artist, i) => {
                                        return <AddedArtistRow key={'added ' + artist.id} artist={artist} onRemoveArtist={onRemoveArtist} />
                                    })
                                }
                                <TrackResults onTogglePlaying={onTogglePlaying} currentlyPlaying={currentlyPlaying} existingTrackIDs={tracks.map(t => t.id)} onAddTrack={onAddTrack} searchResults={trackSearchResults} />
                                <ArtistResults onAddArtist={onAddArtist} existingArtistIDs={artists.map(a => a.id)} searchResults={artistSearchResults} />
                            </div>
                        </ScrollArea.Autosize>
                        <Center>
                            <Image mb='15px' style={{ width: '90px' }} src={SpotifyLogo.src}></Image>
                        </Center>
                    </Paper>}
                </Center>
            </div >
        </div >

    )

    async function search(query: string) {
        try {
            if (query.length > 0) {
                if (searchType.item === 'track') {
                    let fakeTrackResults = [];
                    for (let i = 0; i < searchLimit; i++) {
                        fakeTrackResults.push({ ...fakeTrack, id: i });
                    }
                    setTrackSearchResults(fakeTrackResults);
                } else {
                    let fakeArtistResults = [];
                    for (let i = 0; i < searchLimit; i++) {
                        fakeArtistResults.push({ ...fakeArtist, id: i });
                    }
                    setArtistSearchResults(fakeArtistResults)
                }
                const results: any = await Search(query, spotifyUserData.countryCode, spotifyUserData.accessToken, { type: searchType.item === 'artist' ? 'artists' : 'tracks', limit: searchLimit });
                if (results === undefined) {
                    showErrorNotification('Error searching')
                    setArtistSearchResults([]);
                    setTrackSearchResults([]);
                } else {
                    if (results.length === 0) {
                        setNoResultsFound(true);
                        setArtistSearchResults([]);
                        setTrackSearchResults([]);
                    } else {
                        setNoResultsFound(false);
                        if (searchType.item === 'track') {
                            setTrackSearchResults(results as Track[]);
                        } else {
                            setArtistSearchResults(results as Artist[]);
                        }
                    }
                }
            } else {
                if (searchType.item === 'track') {
                    setTrackSearchResults([]);
                } else {
                    setArtistSearchResults([]);
                }
            }
            setIsSearching(false);
            setIsLoadingSearch(false);
        } catch (e) {
            showErrorNotification('Error searching');
        }
    }
}
