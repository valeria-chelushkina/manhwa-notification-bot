import { Keyboard } from "../../ui/keyboard.js";

export async function startMessage(ctx) {
  try {
    const formattedMessage = `Welcome to my bot!
A short list what this bot can do: it will send out notifications of your following titles every time a new chapter comes out.
- Start the schedule for notifications to start sending.
- Look at the list of unread notifications on your profile right now.`;

    console.log("Bot sent out a start message.");
    return ctx.reply(formattedMessage, {
      parse_mode: "HTML",
      ...Keyboard.mainMenu(),
    });
  } catch (error) {
    console.error("Error in bot start command:", error);
    return ctx.reply(
      "Sorry, something went wrong while sending a start message",
    );
  }
}
