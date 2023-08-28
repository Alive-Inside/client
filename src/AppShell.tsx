import { ActionIcon, Anchor, AppShell as MantineAppShell, Aside, Burger, Button, Center, Container, createStyles, Flex, Footer, Group, Header, MediaQuery, Navbar, Paper, ScrollArea, Skeleton, Text, Title, Tooltip, Transition, useMantineTheme } from "@mantine/core";
import { IconCurrencyDollar, IconFileDollar, IconHomeDollar, IconLogout } from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AliveInsideLogo from '../public/alive-inside-logo-half.png';
import NavbarLinkItem from "./components/NavbarLink";
import SpotifyLoginButton from "./components/SpotifyLoginButton";
import SpotifyUserData from "./types/SpotifyUserData";
import NO_SPOTIFY_AVATAR_IMAGE from '../public/no_spotify_avatar.png';
import getConfig from "next/config";
import GetCurrentUser from "./api/GetCurrentUser";
import { Router, useRouter } from "next/router";
import e from "cors";
import DecodeToken from "./api/DecodeToken";
import { useDisclosure } from "@mantine/hooks";

export const HEADER_HEIGHT = 60;

interface LinkProps {
    label: string;
    link: string;
}

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    burger: {
        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 1,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',

        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
    },

    aliveInsideLogo: {
        [theme.fn.smallerThan('md')]: {
            display: 'none'
        }
    },

    headerContainer: {
        [theme.fn.smallerThan('md')]: {
            marginLeft: '0'
        },
        marginLeft: 'auto'
    },

    links: {
        paddingTop: theme.spacing.lg,
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    mainLinks: {
        marginRight: -theme.spacing.sm,
    },

    mainLink: {
        textTransform: 'uppercase',
        fontSize: 13,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        padding: `7px ${theme.spacing.sm}px`,
        fontWeight: 700,
        borderBottom: '2px solid transparent',
        transition: 'border-color 100ms ease, color 100ms ease',

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            textDecoration: 'none',
        },
    },

    secondaryLink: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        fontSize: theme.fontSizes.xs,
        textTransform: 'uppercase',
        transition: 'color 100ms ease',

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            textDecoration: 'none',
        },
    },

    mainLinkActive: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottomColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6],
    },
}));

export default function AppShell({ children }: { children: any }) {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const { classes, cx } = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string, avatar: string }>();
    const {
        publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();

    const router = useRouter();
    const mainLinks: LinkProps[] = [{ label: 'Home', link: '/' }, { label: 'App', link: '/app' }, { label: 'How It Works', link: '/how-it-works' }, { label: 'Donate', link: 'https://aliveinside.org/posts/124120/donate' }, { label: 'Aliveinside.org', link: 'http://aliveinside.org' }]
    const [active, setActive] = useState(-1);

    useEffect(() => {
        const activeIndex = mainLinks.findIndex(x => x.link === router.pathname);
        setActive(activeIndex);
    }, [router.pathname])

    const mainItems = mainLinks.map((item, index) => (
        <Anchor<'a'>
            href={item.link}
            key={item.label}
            className={cx(classes.mainLink, { [classes.mainLinkActive]: index === active })}
            onClick={(event) => {
                event.preventDefault();
                setActive(index);
                router.push(item.link)
            }}
        >
            {item.label}
        </Anchor>
    ));

    useEffect(() => {
        async function decodeJWT(jwt: string) {
            return await DecodeToken(jwt)
        };
        async function LoginCheck() {
            setIsLoading(true);
            if (router.query.logout) {
                localStorage.removeItem('spotifyUserData')
                setIsLoggedIn(false);
                router.replace('/');
            } else {
                if (router.query.jwt) {
                    const spotifyUserData: any = await decodeJWT(router.query.jwt as string);
                    localStorage.setItem('jwt', router.query.jwt as string)
                    localStorage.setItem('spotifyUserData', JSON.stringify(spotifyUserData))
                    setUser({ avatar: spotifyUserData.avatar.url, name: spotifyUserData.name });
                    router.replace('/app');
                } else {
                    try {
                        const spotifyUserDataItem = localStorage.getItem('spotifyUserData');
                        if (spotifyUserDataItem) {
                            const { name, avatar } = JSON.parse(spotifyUserDataItem);
                            setUser({ name, avatar: avatar?.url ?? null });
                        }
                        setIsLoading(false);
                    } catch (e) {
                        setIsLoggedIn(false);
                    }
                }
            }
            setIsLoading(false);
        }
        LoginCheck();
    }, [])

    return (
        <Header height={HEADER_HEIGHT} mb={120}>
            <Link href='/'>
                <Image className={classes.aliveInsideLogo} style={{ position: 'absolute', left: '20px', marginTop: '9px' }} src={AliveInsideLogo} alt="Alive Inside Logo" />
            </Link>
            <Flex>
                <Container className={classes.headerContainer}>
                    <div className={classes.links}>
                        <Group spacing={0} position="right" className={classes.mainLinks}>
                            {mainItems.slice(1)}
                        </Group>
                    </div>
                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="md" />

                    <Transition transition="pop-top-right" duration={200} mounted={opened}>
                        {(styles) => (
                            <Paper className={classes.dropdown} withBorder style={styles}>
                                {mainItems}
                            </Paper>
                        )}
                    </Transition>
                </Container>
                <Flex style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '10px',
                    right: '10px'
                }}>
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
                </Flex>
            </Flex>
            {children}
        </Header>



        // <MantineAppShell
        //     styles={{
        //         main: {
        //             background: theme.colorScheme === 'dark' ? theme.globalStyles(theme).backgroundColor : theme.colors.gray[0],
        //         },
        //     }}
        //     navbarOffsetBreakpoint="sm"
        //     asideOffsetBreakpoint="sm"
        //     navbar={
        //         <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
        //             <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        //                 <NavbarLinkItem href="/how-it-works">
        //                     <Text>How It Works</Text>
        //                 </NavbarLinkItem>
        //                 <NavbarLinkItem href="/app">
        //                     <Text>App</Text>
        //                 </NavbarLinkItem>
        //                 <NavbarLinkItem href="https://www.aliveinside.org/donate_now">
        //                     <>
        //                         {/* <ActionIcon className={classes.navbarIcon} mr={10} autoFocus={true} radius={'sm'} color="green">
        //                             <IconCurrencyDollar />
        //                         </ActionIcon> */}
        //                         <Text>Donate</Text>
        //                     </>
        //                 </NavbarLinkItem>
        //                 <NavbarLinkItem href="http://aliveinside.org">
        //                     <>
        //                         <Text>AliveInside.org</Text>
        //                     </>
        //                 </NavbarLinkItem>
        //             </Navbar.Section>
        //             <Navbar.Section>
        //                 <Skeleton visible={isLoading}>
        //                     {user ?
        //                         <Flex>
        //                             <Center>
        //                                 <Image style={{ borderRadius: '100px' }} width={40} height={40} src={user.avatar ?? NO_SPOTIFY_AVATAR_IMAGE} alt="Avatar" />
        //                                 <Text size="sm" ml={'xs'}><b>{user.name}</b></Text>
        //                                 <Tooltip radius={'xl'} label='Logout'>
        //                                     <Link href={`${BACKEND_URL}/logout`}>
        //                                         <ActionIcon color={'dark'} ml={"sm"}><IconLogout /></ActionIcon>
        //                                     </Link>
        //                                 </Tooltip>
        //                             </Center>
        //                         </Flex>
        //                         :
        //                         <SpotifyLoginButton />
        //                     }
        //                 </Skeleton>
        //             </Navbar.Section>
        //         </ Navbar>
        //     }
        //     header={
        //         <Header height={{ base: 50, md: 70 }} p="md">
        //             <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        //                 <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        //                     <Burger
        //                         opened={opened}
        //                         onClick={() => setOpened((o) => !o)}
        //                         size="sm"
        //                         color={theme.colors.gray[6]}
        //                         mr="xl"
        //                     />
        //                 </MediaQuery>
        //                 <Link style={{ textDecoration: 'none', color: 'inherit' }} href={'/'}>
        //                     <Title>Alive Inside</Title>
        //                 </Link>
        //                 {/* <Image style={{ transform: "scale(50%)", display: 'flex', justifyContent: 'start' }} src={AliveInsideLogo} alt="Alive Inside Logo" /> */}
        //             </div>
        //         </Header>
        //     }
        // >
        //     {children}
        // </MantineAppShell>
    )
}
