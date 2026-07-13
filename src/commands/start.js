import { startMessage } from "./messages/startMessage.js";
import { setScheduleMessage } from "./messages/scheduleMessage.js";
import { unreadListMessage } from "./messages/unreadListMessage.js";
import { stopScheduleMessage } from "./messages/stopScheduleMessage.js";
import { Keyboard } from "./keyboard.js";

export function startupBot(bot, chatId) {

  bot.telegram.sendMessage(
    chatId, 
    "🤖Bot has rebooted. Menu refreshed.", 
    { ...Keyboard.startMenu() }
  ).catch(err => console.error("Could not reset menu on startup:", err));

  bot.start(async (ctx) => {
    await startMessage(ctx);
  });

  bot.hears(
    "Start schedule✅",
    async (ctx) => await setScheduleMessage(ctx, bot, chatId),
  );

  bot.hears(
    "Unread notifications🔔",
    async (ctx) => await unreadListMessage(ctx),
  );

  bot.hears(
    'Stop schedule❌',
    async (ctx) => await stopScheduleMessage(ctx),
  )
}
