import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";

const botToken = process.env.BOT_TOKEN;

const bot = new Telegraf(botToken);

bot.start(ctx => ctx.reply('Welcome!'));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));