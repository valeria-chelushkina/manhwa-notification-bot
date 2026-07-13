import { startMessage } from "./messages/startMessage.js";
import { setScheduleMessage } from "./messages/scheduleMessage.js";
import { unreadListMessage } from "./messages/unreadListMessage.js";

export function startupBot(bot, chatId) {
  
  bot.start(async (ctx) => {await startMessage(ctx)});

  bot.hears('Start schedule✅', async (ctx) => await setScheduleMessage(ctx, bot, chatId));

  bot.hears('Unread notifications🔔', async (ctx) => await unreadListMessage(ctx));

}
