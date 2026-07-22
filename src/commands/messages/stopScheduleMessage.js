import { stopSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../../ui/keyboard.js";

export async function stopScheduleMessage(ctx, isActive) {
  try {
    await ctx.answerCbQuery();
    stopSchedule();
    console.log("Schedule has been stopped.");
    await ctx.reply(
      "Schedule has been successfully stopped⛔️\nYou will not be getting any more notifications until you start it up again.",
      { parse_mode: "HTML" },
    );
    isActive = false;
  } catch (err) {
    console.error("Error while stopping a schedule: ", err);
    await ctx.reply("Sorry, something went wrong. Couldn't stop a schedule.");
    isActive = true;
  }
  return isActive;
}
