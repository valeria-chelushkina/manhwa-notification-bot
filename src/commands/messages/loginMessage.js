import { Keyboard } from "../../ui/keyboard.js";
import { setupEnv } from "../../utils/helpers.js";

setupEnv("../../../.env");

export async function loginMessage(ctx) {
  try {
    const formattedMessage = `Welcome to my bot!\nHere you can receive your notifications from <a href="${process.env.BASE_URL}">this website.</a>\nYou need to login first!`;

    console.log("Bot sent out a start message.");
    return ctx.reply(formattedMessage, {
      parse_mode: "HTML",
      ...Keyboard.loginMenu(process.env.MINI_APP_URL),
    });
  } catch (error) {
    console.error("Error in bot start command:", error);
    return ctx.reply(
      "Sorry, something went wrong while sending a start message",
    );
  }
}