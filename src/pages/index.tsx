import { Button, Card, Container, Group, Notification, Text, Title } from "@mantine/core";
import { IconX } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useStyles from "../styles";

export default function IndexPage({ isLoggedIn, refreshToken, accessToken }) {

  const router = useRouter();
  const [showLoginNotification, setShowLoginNotification] = useState(true);
  const { classes } = useStyles();

  function hideNotification() {
    setShowLoginNotification(false);
  }

  return (
    <div>
      {router.query.redirect && showLoginNotification && <Notification onClick={hideNotification} icon={<IconX size={18} />} color="red">
        Please login
      </Notification>}
      <Group mt={50} position="center" style={{ display: 'flex', flexDirection: 'column' }}>
        <Title>Welcome to the <b>ALIVE INSIDE APP</b>!</Title>
        <Text size={'lg'}>Give your Elders their Memories back!</Text>
        <br />
        <Container>
          <Card>
            <Title>What is the Alive Inside App?</Title>
            <Text>{`The Alive Inside App is a free music tool to find your elder's deepest memory music.
              With the App and your caring energy, you can wake a mind and heart.`}</Text>
            <Title mt={'xl'}>Why Music?</Title>
            <Text>Music accesses multiple parts of the brain, and miraculously stays strong, almost to the end.
              Music and Human Connections can restore memory and identity!
            </Text>
          </Card>
        </Container>
        <Link href="/app">
          <Button mt={"md"} variant="white" radius="xl" size="md">Try the app</Button>
        </Link>
      </Group>
    </div>
  );
}

export function getServerSideProps(context) {
  const isLoggedIn = !!context.req?.cookies?.spotifyUserData;
  return { props: { isLoggedIn, refreshToken: isLoggedIn ? JSON.parse(context.req.cookies.spotifyUserData).refreshToken : "undefined" } }
}
