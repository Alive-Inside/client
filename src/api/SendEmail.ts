import getConfig from "next/config";
import Track from "../types/Track";
import { showErrorNotification } from "../utils/notifications";

export default async function SendEmail(
  emails: string[],
  formQuestionsAndAnswers: { question: string; answer: string }[],
  tracks: { title: string; artistName: string }[],
  sessionNotes: string
) {
  try {
    const jwt = localStorage.getItem("jwt");
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    const playlistUrlString = localStorage.getItem("exportedSpotifyPlaylist");
    let playlistUrl = "";
    if (playlistUrlString) {
      playlistUrl = JSON.parse(playlistUrlString);
    }
    await fetch(`${BACKEND_URL}/email`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "POST",
      body: JSON.stringify({
        emails,
        tracks,
        formQuestionsAndAnswers,
        sessionNotes,
        playlistUrl,
      }),
    });
  } catch (e) {
    showErrorNotification("Error sending email - Try submitting again");
  }
}
