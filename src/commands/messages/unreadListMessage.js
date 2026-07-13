import { getNotificationsList } from "../../services/parser.js";
import { cleanHtml } from "../../utils/helpers.js";

export async function unreadListMessage(ctx) {
  try {
    const unreadList = await getNotificationsList();
    let notificationContent = "";

    if (!Array.isArray(unreadList) || unreadList.length === 0) {
      notificationContent = `There are no new notifications on your account!
Go and read anything else :)`;
    } else {
      const formattedList = unreadList.map((item, i) => {
        const cleanedItem = Object.assign({}, item, cleanHtml(item));
        return `<a href='${cleanedItem.url}'>${i + 1}. ${cleanedItem.title} - Chapter ${cleanedItem.chapter}.</a>`;
      });

      notificationContent = `Here is the list of new notifications on your account:
${formattedList.join("\n")}`;
    }

    console.log("Bot sent out an unread list.");
    return ctx.reply(notificationContent, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Error in bot unread list command:", error);
    return ctx.reply(
      "Sorry, something went wrong while fetching your notifications.",
    );
  }
}
