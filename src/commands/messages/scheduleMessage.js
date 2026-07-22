import { setSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../../ui/keyboard.js";
import { checkError } from "../../utils/helpers.js";

export async function setScheduleMessage(ctx, bot, isActive) {
  try {
    await ctx.answerCbQuery();
    const chatId = ctx.chat.id;
    await setSchedule(bot, chatId, ctx);

    console.log("Schedule has been started.");
    await ctx.reply(
      "Schedule has been successfully started!🎉\nKeep in mind, bot checks for notifications every 10 minutes.",
      { parse_mode: "HTML" },
    );
    isActive = true;
  } catch (err) {
    const errMsg = "Error while starting a schedule: ";
    const ctxMsg = "Sorry, something went wrong. Couldn't set up a schedule.";
    await checkError(err, ctx, errMsg, ctxMsg);
    isActive = false;
  }
  return isActive;
}
