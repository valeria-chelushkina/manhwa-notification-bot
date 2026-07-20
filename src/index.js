import { Telegraf } from "telegraf";
import { setupBot } from "./app/setupBot.js";
import { setupEnv } from "./utils/helpers.js";

setupEnv("../.env");

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token is not present! Provide a bot token.");
}

const botToken = process.env.BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;

const bot = setupBot(botToken, myChatId);

try {
  bot.launch({ dropPendingUpdates: true });
  console.log("Bot has launched");
} catch (err) {
  console.error("Something went wrong: ", err);
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
