import { setSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../keyboard.js";

export async function setScheduleMessage(ctx, bot, chatId) {
  try {
    setSchedule(bot, chatId);

    console.log("Schedule has been started.");
    return ctx.reply(
      "Schedule has been successfully started!🎉\nKeep in mind, bot checks for notifications every 10 minutes.",
      { parse_mode: "HTML" },
    );
  } catch (err) {
    console.error("Error while starting a schedule: ", err);
    return ctx.reply(
      "Sorry, something went wrong. Couldn't set up a schedule.",
    );
  }
}
