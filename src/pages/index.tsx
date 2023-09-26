import { BackgroundImage, Button, Container, Group, Notification, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { showErrorNotification } from "../utils/notifications";
import backgroundImage from '../../public/img/darkened_lady_with_headset.jpg'

export default function IndexPage({ isLoggedIn, refreshToken, accessToken }) {

  const router = useRouter();
  const [showLoginNotification, setShowLoginNotification] = useState(true);

  function hideNotification() {
    setShowLoginNotification(false);
  }

  return (
    <BackgroundImage src={backgroundImage.src} style={{ marginTop: '-1vh', height: '93.5vh' }}>
      {/* {router.query.redirect && showLoginNotification && <Notification onClick={hideNotification} icon={<IconX size={18} />} color="red">
        Please login
      </Notification>} */}
      <Group mt={10} position="center" style={{ color: 'rgb(230,230,230)', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <Title>Welcome to the <b>Alive Inside App</b>!</Title>
        <Text size={'lg'}>Give your Elders their Memories back!</Text>
        <Container mt={50}>
          <Title>What is the Alive Inside App?</Title>
          <Text>{`The Alive Inside App is a free music tool to help you wake your elders. With the App and a little love, you can change a life!`}</Text>
          <Title mt={'xl'}>Why Music?</Title>
          <Text>Music accesses the deepest parts of the brain and stays strong, almost to the end. Music and Human Connection restore memory and identity!</Text>
        </Container>
        <Link href="/app">
          <Button mt={"md"} variant="white" radius="xl" size="md">Try the app</Button>
        </Link>
      </Group>
    </BackgroundImage>
  );
}

export function getServerSideProps(context) {
  const isLoggedIn = !!context.req?.cookies?.spotifyUserData;
  return { props: { isLoggedIn, refreshToken: isLoggedIn ? JSON.parse(context.req.cookies.spotifyUserData).refreshToken : "undefined" } }
}
