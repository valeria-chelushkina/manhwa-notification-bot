import { Telegraf } from "telegraf";
import { Database } from "../db/db.js";
import { startupBot } from "../commands/registerHandlers.js";
import { setupScenes } from "../scenes/setupScenes.js";

export function setupBot(botToken, chatId) {
  const bot = new Telegraf(botToken);
  const database = new Database();

  bot.use((ctx, next) => {
    ctx.db = database;
    return next();
  });

  startupBot(bot, chatId);
  setupScenes(bot);

  return bot;
}
