import "dotenv/config";
import { Telegraf } from "telegraf";
import { startupBot } from "./commands/start.js";

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token is not present! Provide a bot token.");
}

const botToken = process.env.BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;

const bot = new Telegraf(botToken);

startupBot(bot, myChatId);

try {
  bot.launch({ dropPendingUpdates: true });
  console.log("Bot has launched");
} catch (err) {
  console.error("Something went wrong!");
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
