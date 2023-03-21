import { BackgroundImage, Button, Card, Container, Group, Notification, Text, Title, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useStyles from "../styles";
import jwt from 'jsonwebtoken';
import DecodeToken from "../api/DecodeToken";
import { showErrorNotification } from "../utils/notifications";
import backgroundImage from '../../public/lady-with-headset.jpg'
import { HEADER_HEIGHT } from "../AppShell";

export default function IndexPage({ isLoggedIn, refreshToken, accessToken }) {

  const router = useRouter();
  const [showLoginNotification, setShowLoginNotification] = useState(true);
  const { classes } = useStyles();
  const { colors } = useMantineTheme();

  function hideNotification() {
    setShowLoginNotification(false);
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <BackgroundImage style={{ width: '100vw', height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflow: 'hidden' }} src={backgroundImage.src}>
        {router.query.redirect && showLoginNotification && <Notification onClick={hideNotification} icon={<IconX size={18} />} color="red">
          Please login
        </Notification>}
        <Group mt={10} position="center" style={{ color: 'rgb(230,230,230)', display: 'flex', flexDirection: 'column' }}>
          <Title>Welcome to the <b>Alive Inside App</b>!</Title>
          <Text size={'lg'}>Give your Elders their Memories back!</Text>
          <Container mt={50}>
            <Title>What is the Alive Inside App?</Title>
            <Text>{`The Alive Inside App is a free music tool to find your elder's deepest memory music.
              With the App and your caring energy, you can wake a mind and heart.`}</Text>
            <Title mt={'xl'}>Why Music?</Title>
            <Text>Music accesses multiple parts of the brain, and miraculously stays strong, almost to the end.
              Music and Human Connections can restore memory and identity!
            </Text>
          </Container>
          <Link href="/app">
            <Button mt={"md"} variant="white" radius="xl" size="md">Try the app</Button>
          </Link>
        </Group>
      </BackgroundImage>
    </div>
  );
}

export function getServerSideProps(context) {
  const isLoggedIn = !!context.req?.cookies?.spotifyUserData;
  return { props: { isLoggedIn, refreshToken: isLoggedIn ? JSON.parse(context.req.cookies.spotifyUserData).refreshToken : "undefined" } }
}
