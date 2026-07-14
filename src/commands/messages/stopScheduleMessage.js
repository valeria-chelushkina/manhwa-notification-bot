import { stopSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../../ui/keyboard.js";

export async function stopScheduleMessage(ctx) {
  try {
    await ctx.answerCbQuery();
    stopSchedule();
    console.log("Schedule has been stopped.");
    return ctx.reply(
      "Schedule has been successfully stopped⛔️\nYou will not be getting any more notifications until you start it up again.",
      { parse_mode: "HTML", },
    );
  } catch (err) {
    console.error("Error while stopping a schedule: ", err);
    return ctx.reply("Sorry, something went wrong. Couldn't stop a schedule.");
  }
}
