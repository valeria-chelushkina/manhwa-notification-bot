import { setSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../../ui/keyboard.js";
import { checkError } from "../../utils/helpers.js";

export async function setScheduleMessage(ctx, bot) {
  try {
    await ctx.answerCbQuery();
    const chatId = ctx.chat.id;
    setSchedule(bot, chatId);

    console.log("Schedule has been started.");
    return ctx.reply(
      "Schedule has been successfully started!🎉\nKeep in mind, bot checks for notifications every 10 minutes.",
      { parse_mode: "HTML" },
    );
  } catch (err) {
    const errMsg = "Error while starting a schedule: ";
    const ctxMsg = "Sorry, something went wrong. Couldn't set up a schedule.";
    return await checkError(err, ctx, errMsg, ctxMsg);
  }
}
