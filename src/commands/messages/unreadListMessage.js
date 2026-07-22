import { getNotificationsList } from "../../services/parser.js";
import { cleanHtml } from "../../utils/helpers.js";
import { checkError, cleanTitle } from "../../utils/helpers.js";

export async function unreadListMessage(ctx) {
  try {
    const chatId = ctx.chat.id;
    let unreadList = await getNotificationsList(chatId, ctx);

    let notificationContent = "";

    if (!Array.isArray(unreadList) || unreadList.length === 0) {
      notificationContent = `There are no new notifications on your account!
Go and read anything else :)`;
    } else {
      unreadList = await notIncludeMute(unreadList, chatId, ctx);
      if(!unreadList) unreadList = [];
      const formattedList = unreadList.map((item, i) => {
        const cleanedItem = Object.assign({}, item, cleanHtml(item));
        return `<a href='${cleanedItem.url}'>${i + 1}. ${cleanedItem.title} - Chapter ${cleanedItem.chapter}.</a>`;
      });

      notificationContent = `Here is the list of new notifications on your account:
${formattedList.join("\n")}`;
    }

    console.log("Bot sent out an unread list.");
    return ctx.reply(notificationContent, { parse_mode: "HTML" });
  } catch (err) {
    const errMsg = "Error in bot unread list command: ";
    const ctxMsg =
      "Sorry, something went wrong while fetching your notifications.";
    return await checkError(err, ctx, errMsg, ctxMsg);
  }
}

async function notIncludeMute(readingList, chatId, ctx) {
  const mutedList = await ctx.db.userRepo.getMutedListById(chatId);
  const lookupSet = new Set(mutedList);
  readingList.forEach((item, index) => {
    item.title = cleanTitle(item.title);
    if (lookupSet.has(item.title)) {
      readingList.splice(index, 1);
    }
  });
  return readingList;
}
