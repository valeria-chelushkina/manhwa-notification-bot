import { getNotificationsList } from "../../services/parser.js";
import { cleanHtml } from "../../utils/helpers.js";
import { Database } from "../../db/db.js";

const database = new Database().userRepo;

export async function unreadListMessage(ctx) {
  try {
    const chatId = ctx.chat.id;
    let unreadList = await getNotificationsList(chatId);
    let notificationContent = "";

    if (!Array.isArray(unreadList) || unreadList.length === 0) {
      notificationContent = `There are no new notifications on your account!
Go and read anything else :)`;
    } else {
      unreadList = notIncludeMute(unreadList, chatId);
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

async function notIncludeMute(readingList, chatId) {
  const mutedList = await database.getMutedListById(chatId);
  const lookupSet = new Set(mutedList);
  readingList.forEach((item, index) => {
    if (lookupSet.has(item.title)) {
      readingList.splice(index, 1);
    }
  });
  return readingList;
}
