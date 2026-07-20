import { optionsMessage } from "../messages/optionsMessage.js";

export async function loginAction(bot) {

    bot.on(message("web_app_data"), async (ctx) => loginAction(ctx));

  try {
    const data = JSON.parse(dataString);

    // check if event was a success
    if (data.event === "login_success") {
      await ctx.reply(
        "You logged in successdully! 🎉 Now you can set up your notifications.",
      );
      optionsMessage(ctx);
    }
  } catch (err) {
    console.error("Error occured while parsing mini-app:", err);
    await ctx.reply("Sorry, there was a data processing error.");
  }
}
