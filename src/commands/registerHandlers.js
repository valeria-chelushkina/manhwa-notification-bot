import { startMessage } from "./messages/startMessage.js";
import { setScheduleMessage } from "./messages/scheduleMessage.js";
import { unreadListMessage } from "./messages/unreadListMessage.js";
import { stopScheduleMessage } from "./messages/stopScheduleMessage.js";
import { setupNotificaitonsMessage } from "./messages/setupNotifMessage.js";
import { disableTitleMessage } from "./messages/disableTitleMessage.js";
import { muteTitleMessage } from "./messages/muteTitleMessage.js";
import { Keyboard } from "../ui/keyboard.js";

export function startupBot(bot, chatId) {
  let isActive = false;

  bot.telegram
    .sendMessage(chatId, "🤖Bot has rebooted. Menu refreshed.", {
      ...Keyboard.mainMenu(),
    })
    .catch((err) => console.error("Could not reset menu on startup:", err));

  bot.start(async (ctx) => {
    isActive = false;
    await startMessage(ctx);
  });

  bot.hears(
    "Set up notifications⚙️",
    async (ctx) => await setupNotificaitonsMessage(ctx, isActive),
  );

  bot.hears(
    "Unread notifications🔔",
    async (ctx) => await unreadListMessage(ctx),
  );

  bot.action("start-schedule", async (ctx) => {
    isActive = true;
    await setScheduleMessage(ctx, bot, chatId);
  });

  bot.action("stop-schedule", async (ctx) => {
    isActive = false;
    await stopScheduleMessage(ctx);
  });

  bot.action('disable-title-notif', async (ctx) => {
    await disableTitleMessage(ctx);
  })

  bot.action('mute-title', async(ctx) => await muteTitleMessage(ctx));
}
