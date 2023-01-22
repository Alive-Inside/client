import { showNotification } from "@mantine/notifications";

function showErrorNotification(message: string) {
  showNotification({
    message,
    color: "red",
  });
}

export { showErrorNotification };
