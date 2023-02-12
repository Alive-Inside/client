import { useTheme } from "@emotion/react";
import { ActionIcon, Button, Center, Container, Loader, ScrollArea, Skeleton, Stack, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useClipboard, useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconBrandSpotify, IconDeviceFloppy, IconSearch, IconX } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SpotifyWebPlayer from "react-spotify-web-playback/lib";
import AddTracksToPlaylist from "../api/AddTrackToPlaylist";
import createPlaylist from "../api/CreatePlaylist";
import GetRecommendations from "../api/GetRecommendations";
import GetTrack from "../api/GetTrack";
import Search from "../api/Search";
import { LARGE_SCREEN, SPOTIFY_SEARCH_DEBOUNCE_INTERVAL } from "../constants";
import Artist, { LoadableArtist } from "../types/Artist";
import SpotifyUserData from "../types/SpotifyUserData";
import Track, { LoadableTrack } from "../types/Track";
import { showErrorNotification } from "../utils/notifications";
import AddedArtistRow from "./PlaylistAddedItemRow/AddedArtistRow";
import AddedTrackRow from "./PlaylistAddedItemRow/AddedTrackRow";
import ArtistResults from "./SearchResults/ArtistResults";
import TrackResults from "./SearchResults/TrackResults";
import SpotifyRow from "./SpotifyRow";

export type CurrentlyPlaying = {trackId: string,  state: 'playing'| 'not playing'};
const fakeTrack: LoadableTrack = {
    album: {
        id: '', largeImageUrl: '', name: 'Fake name', releaseYear: 1948,
        smallImageUrl: '',
    }, artist: { id: '', name: 'Fake artist', url: '' }, id: '', mp3PreviewUrl: '', title: 'Fake title', uri: '', url: '',
    loading: true
}

const fakeArtist: LoadableArtist = {
    id: '', largeImageUrl: '', name: '', nextPaginationUrl: '', smallImageUrl: '', loading: true
}


export default function PlaylistModule({ isLoadingTracks, formValues, spotifyUserData, searchType, generatedPlaylistTracks: generatedTracks, isFinalPlaylist, addTrack, addArtist, removeTrack, removeArtist, initialItems }: { isLoadingTracks?: false, initialItems: (Track | Artist)[], formValues?: any, removeTrack?: Function, removeArtist?: Function, addTrack?: Function, addArtist?: Function, isFinalPlaylist?: boolean, generatedPlaylistTracks?: Track[], spotifyUserData: SpotifyUserData, searchType: { item: 'track' | 'artist', multiple: boolean } }) {
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
    const [currentPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>(null);

    const theme = useMantineTheme();

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
    }, [debouncedQuery])

    const onAddFive = async (trackId: string) => {
        try {
            setFiveTracksLoading(new Map(fiveTracksLoading.set(trackId, true)))
            const insertIndex = tracks.indexOf(tracks.find(t => t.id === trackId)) + 1;
            const newTracks = [...tracks];

            const fakeTracks = [];
            for (let i = 0; i < 5; i++) {
                fakeTracks.push({ ...fakeTrack });
            }
            //@ts-ignore
            newTracks.splice(insertIndex, 0, ...fakeTracks)
            setTracks(newTracks)

            const { album: { releaseYear } } = tracks.find(t => t.id === trackId);
            const recommendedTracks = await GetRecommendations(5, spotifyUserData.countryCode, { targetYear: releaseYear, trackIDs: [trackId], onlyIncludeFromArtistID: tracks.find(t => t.id === trackId).artist.id, duplicateTrackIDsToAvoid: tracks.map(lT => lT.id) });
            if (recommendedTracks === undefined) return;

            newTracks.splice(insertIndex, 5, ...recommendedTracks);
            setTracks(newTracks)

            if (spotifyPlaylist !== null) await AddTracksToPlaylist(spotifyPlaylist.id, recommendedTracks.map(t => t.uri), spotifyUserData.accessToken, insertIndex);
            localStorage.setItem('previouslyGeneratedTracks', JSON.stringify(newTracks));
            setFiveTracksLoading(new Map(fiveTracksLoading.set(trackId, false)))
        } catch (e) {
            showErrorNotification('Error loading recommendations')
        }
    }

    const onRemoveTrack = (trackId: string) => {
        const newLocalTracks = tracks.filter(t => t.id !== trackId);
        setTracks(newLocalTracks);
        if (!isFinalPlaylist) {
            removeTrack(trackId);
        }
    }

    const onAddTrack = async (track: Track) => {
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
    }

    function onAddArtist(artist: Artist) {
        addArtist(artist);
        setSearchQuery('');
        setArtistSearchResults([]);
        setArtists([...artists, artist])
    }

    function onRemoveArtist(artistId: string) {
        const newLocalArtists = artists.filter(a => a.id !== artistId);
        setArtists(newLocalArtists);
        removeArtist(artistId);
    }

    async function exportPlaylist() {
        setIsSavingToSpotify(true);
        const { url, id } = await createPlaylist(formValues.eldersBirthYear, formValues.musicalPreference, spotifyUserData);
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

    function onTogglePlaying(trackId: string) {
        console.log('onTogglePlaying')
        if (currentPlaying?.trackId === trackId) {
            setCurrentlyPlaying({trackId,state: currentPlaying?.state === 'playing' ? 'not playing' : 'playing'})
            console.log('stopping or pausing', trackId)
        } else {
            console.log('playing', trackId)
            setCurrentlyPlaying({trackId, state: 'playing'});
        }
    }

    return (
        <div style={{ padding: '1em' }}>
            <div style={{ width: '', }}>
                <Container mb={'md'} style={{ lineHeight: '1', display: 'flex', alignItems: 'center', height: '3.5rem', width: "100%", color: '#fff', backgroundImage: 'linear-gradient(rgba(0,0,0,0.6) 0px, border-box', backgroundColor: '#121212' }}>
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
                                        <Button color='green' onClick={() => !spotifyPlaylist && exportPlaylist()} radius={'xl'} variant="outline" style={{ marginRight: '1rem' }}><IconBrandSpotify style={{ marginRight: '0.25rem' }} />{spotifyPlaylist ? "Open Playlist" : "Save to Spotify"}</Button>
                                    </Skeleton>
                                </a>
                            </div> : <Loader style={{ marginLeft: '0.5em', marginRight: '1rem', marginTop: '0.75rem' }} variant="dots" color='green' />}
                            <Link href='/memory-bank'><Button color='blue' radius={'xl'} variant="outline" style={{}}><IconDeviceFloppy style={{ marginRight: '0.25rem' }} />Save to Memory Bank</Button> </Link>
                        </div>
                    }
                </Container>
                <ScrollArea.Autosize maxHeight={"60vh"} style={{ width: '50vh' }} viewportRef={viewport}>
                    {noResultsFound &&
                        <SpotifyRow>
                            <Text style={{ marginLeft: '2em', width: '50vw' }}>No results found for &quot;{debouncedQuery}&quot;</Text>
                        </SpotifyRow>}
                    {searchType.item === 'track' &&
                        ((searchQuery.length === 0 || trackSearchResults.length === 0) && !(!isSearching && trackSearchResults.length === 0 && searchQuery.length > 0 && trackSearchResults.length === 0)) && tracks.map((track, i) => {
                            return <AddedTrackRow onTogglePlaying={(id) => {console.log('added track row');onTogglePlaying(id)}} currentlyPlaying={currentPlaying} key={i} fiveTracksLoading={fiveTracksLoading.get(track.id)} onAddFive={onAddFive} isFinalPlaylist={isFinalPlaylist} track={track} onRemoveTrack={onRemoveTrack} />
                        })
                    }
                    {searchType.item === 'artist' &&
                        ((searchQuery.length === 0 || artistSearchResults.length === 0) && !(!isSearching && artistSearchResults.length === 0 && searchQuery.length > 0 && artistSearchResults.length === 0)) && artists.map((artist, i) => {
                            return <AddedArtistRow key={i} artist={artist} onRemoveArtist={onRemoveArtist} />
                        })
                    }
                    <TrackResults onTogglePlaying={id => {console.log('hit');onTogglePlaying}} currentlyPlaying={currentPlaying} existingTrackIDs={tracks.map(t => t.id)} onAddTrack={onAddTrack} searchResults={trackSearchResults} />
                    <ArtistResults  onAddArtist={onAddArtist} existingArtistIDs={artists.map(a => a.id)} searchResults={artistSearchResults} />
                </ScrollArea.Autosize>
            </div >
            {/* {spotifyUserData.isPremium && <SpotifyPlayer token={spotifyUserData.accessToken} uris={playlistUri} />} */}
            <br/>
            {currentPlaying && <Container mt={60}>
                <SpotifyWebPlayer styles={{bgColor:  theme.globalStyles(theme).backgroundColor as string}} token={spotifyUserData.accessToken} uris={tracks.find(t => t.id=== currentPlaying?.trackId)?.uri} play={currentPlaying?.state==='playing'} callback={e => {if((currentPlaying !== null && (e.isPlaying && currentPlaying.state==='not playing') || (!e.isPlaying && currentPlaying.state==='playing'))) {onTogglePlaying(currentPlaying.trackId)}}} />
                </Container>}
        </div >
    )

    async function search(query: string) {
        try {
            if (query.length > 0) {
                if (searchType.item === 'track') {
                    let fakeTrackResults = [];
                    for (let i = 0; i < 5; i++) {
                        fakeTrackResults.push({ ...fakeTrack, id: i });
                    }
                    setTrackSearchResults(fakeTrackResults);
                } else {
                    let fakeArtistResults = [];
                    for (let i = 0; i < 5; i++) {
                        fakeArtistResults.push({ ...fakeArtist, id: i });
                    }
                    setArtistSearchResults(fakeArtistResults)
                }
                const results: any = await Search(query, spotifyUserData.countryCode, spotifyUserData.accessToken, { type: searchType.item === 'artist' ? 'artists' : 'tracks', limit: 5 });
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
