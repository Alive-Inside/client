import getConfig from "next/config";
import Track from "../types/Track";
import { showErrorNotification } from "../utils/notifications";

export default async function SendEmail(
  emails: string[],
  formQuestionsAndAnswers: { question: string; answer: string }[],
  tracks: {title: string, artistName: string}[]
) {
  try {
    const jwt = localStorage.getItem("jwt");
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    await fetch(`${BACKEND_URL}/email`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "POST",
      body: JSON.stringify({ emails, tracks, formQuestionsAndAnswers }),
    });
  } catch (e) {
    showErrorNotification("Error sending email - Try submitting again");
  }
}
