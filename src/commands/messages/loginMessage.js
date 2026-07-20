import { Keyboard } from "../../ui/keyboard.js";
import { setupEnv } from "../../utils/helpers.js";

setupEnv("../../../.env");

export async function loginMessage(ctx) {
  
  try {
    const formattedMessage = `Welcome to my bot!\nHere you can receive your notifications from <a href="${process.env.BASE_URL}">this website.</a>\nTo do that you would need to login and send me your cookies :)\n*Here should have been a tutorial how to do it, but since i am doing this simply for myself and dont have in plans to deply it, just imagine that it is here.*`;

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