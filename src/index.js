import { Telegraf } from "telegraf";
import { startupBot } from "./commands/registerHandlers.js";
import { setupScenes } from "./scenes/setupScenes.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token is not present! Provide a bot token.");
}

const botToken = process.env.BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;

const bot = new Telegraf(botToken);

setupScenes(bot);
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
