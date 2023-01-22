import getConfig from "next/config";
import { showErrorNotification } from "../utils/notifications";

export default async function SendEmail(
  emails: string[],
  formQuestionsAndAnswers: { question: string; answer: string }[]
) {
  try {
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    await fetch(`${BACKEND_URL}/email`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ emails, formQuestionsAndAnswers }),
    });
  } catch (e) {
    showErrorNotification("Error sending email - Reload and try again");
  }
}
