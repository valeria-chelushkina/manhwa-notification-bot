import apiClient from "../config/api.js";

async function getNotificationsList() {
  let UnreadCount = [];

  try {
    const rawUnreadCount = await apiClient.get(
      "https://comix.to/api/v1/user/notifications/unread-count",
    );
    UnreadCount = rawUnreadCount.data;
  } catch (err) {
    console.error("Couldn't retrieve the data: ", err);
    UnreadCount = "";
  }
  return UnreadCount;
}

console.log(await getNotificationsList());
