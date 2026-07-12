import "dotenv/config";
import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
import { setSchedule } from "./services/scheduler.js";
import { startupBot } from "./commands/start.js";

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token is not present! Provide a bot token.");
}

const botToken = process.env.BOT_TOKEN;

const bot = new Telegraf(botToken);

startupBot(bot);

try {
  bot.launch();
  console.log("Bot has launched");
} catch (err) {
  console.error("Something went wrong!");
}

const myChatId = process.env.MY_CHAT_ID;
setSchedule(bot, myChatId);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
