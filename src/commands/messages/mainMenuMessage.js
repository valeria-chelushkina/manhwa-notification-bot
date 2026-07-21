import { Keyboard } from "../../ui/keyboard.js";

export async function mainMenuMessage(botOrCtx, chatId) {
  try {
    const formattedMessage = `You are in the main menu now❗️\nA short list what this bot can do: it will send out notifications of your following titles every time a new chapter comes out.
- Start the schedule for notifications to start sending.
- Look at the list of unread notifications on your profile right now.`;

    console.log("Bot sent out a main menu message.");

    // Detect if the first argument is Telegraf's ctx or the bot/telegram instance
    if (botOrCtx.reply) {
      // It's a Telegraf ctx
      await botOrCtx.reply(formattedMessage, {
        parse_mode: "HTML",
        ...Keyboard.mainMenu(),
      });
    } else {
      // It's bot.telegram or bot instance, called manually with chatId
      const targetChatId = chatId || botOrCtx.chat?.id;
      const client = botOrCtx.telegram || botOrCtx; // handles both `bot` and `bot.telegram`

      await client.sendMessage(targetChatId, formattedMessage, {
        parse_mode: "HTML",
        ...Keyboard.mainMenu(),
      });
    }
  } catch (error) {
    console.error("Error in bot main menu message:", error);
    const errMessage =
      "Sorry, something went wrong while sending a main menu message";
    if (botOrCtx.reply) {
      await botOrCtx.reply(errMessage, {
        parse_mode: "HTML",
      });
    } else {
      const targetChatId = chatId || botOrCtx.chat?.id;
      const client = botOrCtx.telegram || botOrCtx;

      await client.sendMessage(targetChatId, errMessage, {
        parse_mode: "HTML",
      });
    }
  }
}
