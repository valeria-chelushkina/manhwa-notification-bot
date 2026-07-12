import "dotenv/config";
import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
import { firstMessageBot } from "./commands/start-bot-msg.js";

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token is not present! Provide a bot token.");
}

const botToken = process.env.BOT_TOKEN;

const bot = new Telegraf(botToken);

try {
  bot.start(async (ctx) => ctx.reply(await firstMessageBot(), { parse_mode: "HTML" }));

  bot.launch();

  console.log("Bot has launched");
} catch (err) {
  console.error("Something went wrong!");
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
