import { Keyboard } from "../../ui/keyboard.js";

export async function mainMenuMessage(bot, chatId) {
  try {
    const formattedMessage = `A short list what this bot can do: it will send out notifications of your following titles every time a new chapter comes out.
- Start the schedule for notifications to start sending.
- Look at the list of unread notifications on your profile right now.`;

    console.log("Bot sent out an options message.");
    bot.telegram.sendMessage(chatId, formattedMessage, {
      parse_mode: "HTML",
      ...Keyboard.mainMenu(),
    });
  } catch (error) {
    console.error("Error in bot options message:", error);
    bot.telegram.sendMessage(
      chatId,
      "Sorry, something went wrong while sending an options message",
      { parse_mode: "HTML" },
    );
  }
}
