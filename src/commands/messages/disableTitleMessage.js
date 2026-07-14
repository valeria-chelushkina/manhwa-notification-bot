import { Keyboard } from "../../ui/keyboard.js";

export async function disableTitleMessage(ctx) {
  try {
    await ctx.answerCbQuery();
    const message = `You can disable notifications from a specific title here and not hear from it ever again.
1. Choose a title to mute.
2. Look at the list of muted titles.
If changed your mind - you can unmute your title here.`;

    return ctx.reply(message, {
      parse_mode: "HTML",
      ...Keyboard.disableNotifMenu(),
    });
  } catch (err) {
    console.error(
      "Couldn't send out a disable title notifications message: ",
      err,
    );
    return ctx.reply(
      "Sorry, something went wrong while sending out a message.",
    );
  }
}
