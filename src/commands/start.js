import { getNotificationsList } from "../services/parser.js";
import { cleanHtml } from "../utils/helpers.js";
import "dotenv/config";

export function startupBot(bot) {
  bot.start(async (ctx) => {
    try {
      const unreadList = await getNotificationsList();
      let notificationContent = "";

      if (!Array.isArray(unreadList) || unreadList.length === 0) {
        notificationContent = `There are no new notifications on your account!`;
      } else {
        const formattedList = unreadList.map((item, i) => {
          const cleanedItem = Object.assign({}, item, cleanHtml(item));
          return `<a href='${cleanedItem.url}'>${i + 1}. ${cleanedItem.title} - Chapter ${cleanedItem.chapter}.</a>`;
        });

        notificationContent = `Here is the list of new notifications on your account:
${formattedList.join("\n")}`;
      }

      const formattedMessage = `Welcome to the manhwa notifications sender bot.
It will send you notifications when new chapters of your manhwas come out.


${notificationContent}`;

      await ctx.reply(formattedMessage, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Error in bot start command:", error);
      await ctx.reply(
        "Sorry, something went wrong while fetching your notifications.",
      );
    }
  });
}
