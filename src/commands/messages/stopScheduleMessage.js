import { stopSchedule } from "../../services/scheduler.js";
import { Keyboard } from "../keyboard.js";

export async function stopScheduleMessage(ctx) {
  try {
    stopSchedule();
    console.log("Schedule has been stopped.");
    return ctx.reply(
      "Schedule has been successfully stopped⛔️\nYou will not be getting any more notifications untill you start it up again.",
      { parse_mode: "HTML", ...Keyboard.startMenu() },
    );
  } catch (err) {
    console.error("Error while stopping a schedule: ", err);
    return ctx.reply("Sorry, something went wrong. Couldn't stop a schedule.");
  }
}
