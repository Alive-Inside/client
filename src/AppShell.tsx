import { ActionIcon, AppShell as MantineAppShell, Aside, Burger, Button, Center, Container, Flex, Footer, Header, MediaQuery, Navbar, ScrollArea, Skeleton, Text, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { IconCurrencyDollar, IconFileDollar, IconHomeDollar, IconLogout } from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AliveInsideLogo from '../public/alive-inside-logo.png';
import NavbarLinkItem from "./components/NavbarLink";
import SpotifyLoginButton from "./components/SpotifyLoginButton";
import useStyles from "./styles";
import SpotifyUserData from "./types/SpotifyUserData";
import NO_SPOTIFY_AVATAR_IMAGE from '../public/no_spotify_avatar.png';
import getConfig from "next/config";


export default function AppShell({ children }: { children: any }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string, avatar: string }>();
    const {
        publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();

    useEffect(() => {
        console.log('publicRuntime:', getConfig())
        console.log(fetch(window.location.protocol + window.location.hostname + '/api/spotify/getCurrentUser'));

        async function GetCurrentUser() {
            try {
                const response = await (await fetch(`${BACKEND_URL}/api/spotify/getCurrentUser`, { credentials: 'include' })).json();
                if (response !== undefined) {
                    const { name, avatar } = response;
                    setUser({ name, avatar });
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
                setIsLoading(false);
            } catch (e) {
                setIsLoggedIn(false);
                setIsLoading(false);
            }
        }
        GetCurrentUser();
    }, [])

    return (
        <MantineAppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.globalStyles(theme).backgroundColor : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
                    <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                        <NavbarLinkItem href="/how-it-works">
                            <Text>How It Works</Text>
                        </NavbarLinkItem>
                        <NavbarLinkItem href="/app">
                            <Text>App</Text>
                        </NavbarLinkItem>
                        <NavbarLinkItem href="http://www.aliveinside.us/donate">
                            <>
                                {/* <ActionIcon className={classes.navbarIcon} mr={10} autoFocus={true} radius={'sm'} color="green">
                                    <IconCurrencyDollar />
                                </ActionIcon> */}
                                <Text>Donate</Text>
                            </>
                        </NavbarLinkItem>
                        <NavbarLinkItem href="http://aliveinside.org">
                            <>
                                <Text>AliveInside.org</Text>
                            </>
                        </NavbarLinkItem>
                    </Navbar.Section>
                    <Navbar.Section>
                        <Skeleton visible={isLoading}>
                            {user ?
                                <Flex>
                                    <Center>
                                        <Image style={{ borderRadius: '100px' }} width={40} height={40} src={user.avatar ?? NO_SPOTIFY_AVATAR_IMAGE} alt="Avatar" />
                                        <Text size="sm" ml={'xs'}><b>{user.name}</b></Text>
                                        <Tooltip radius={'xl'} label='Logout'>
                                            <Link href={`${BACKEND_URL}/logout`}>
                                                <ActionIcon color={'dark'} ml={"sm"}><IconLogout /></ActionIcon>
                                            </Link>
                                        </Tooltip>
                                    </Center>
                                </Flex>
                                :
                                <SpotifyLoginButton />
                            }
                        </Skeleton>
                    </Navbar.Section>
                </ Navbar>
            }
            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={'/'}>
                            <Title>Alive Inside</Title>
                        </Link>
                        {/* <Image style={{ transform: "scale(50%)", display: 'flex', justifyContent: 'start' }} src={AliveInsideLogo} alt="Alive Inside Logo" /> */}
                    </div>
                </Header>
            }
        >
            {children}
        </MantineAppShell>
    )
}
