import { onStartAction } from "./actions/onStartAction.js";
import { setScheduleMessage } from "./messages/scheduleMessage.js";
import { unreadListMessage } from "./messages/unreadListMessage.js";
import { stopScheduleMessage } from "./messages/stopScheduleMessage.js";
import { setupNotificaitonsMessage } from "./messages/setupNotifMessage.js";
import { disableTitleMessage } from "./messages/disableTitleMessage.js";
import { muteTitleMessage } from "./messages/muteTitleMessage.js";
import { mutedListMessage } from "./messages/mutedListMessage.js";
import { Keyboard } from "../ui/keyboard.js";
import { Markup } from "telegraf";
import { message } from "telegraf/filters";

export function startupBot(bot, chatId) {
  let isActive = false;

  bot.telegram
    .sendMessage(
      chatId,
      "🤖Bot has rebooted. Menu refreshed.\nPress /start to start!",
      { parse_mode: "HTML", ...Markup.removeKeyboard() },
    )
    .catch((err) => console.error("Could not reset menu on startup:", err));

  bot.start(async (ctx) => {
    isActive = false;
    await onStartAction(ctx, bot);
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
    isActive = await setScheduleMessage(ctx, bot, isActive);
  });

  bot.action("stop-schedule", async (ctx) => {
    isActive = await stopScheduleMessage(ctx, isActive);
  });

  bot.action(
    "disable-title-notif",
    async (ctx) => await disableTitleMessage(ctx),
  );

  bot.action("mute-title", async (ctx) => {
    await muteTitleMessage(ctx);
    await ctx.scene.enter("MUTE_TITLE_SCENE");
  });

  bot.action("muted-list", async (ctx) => {
    await mutedListMessage(ctx);
    await ctx.scene.enter("UNMUTE_TITLE_SCENE");
  });
}
