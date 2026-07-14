import { Keyboard } from "../../ui/keyboard.js";

// will possibly make it a scene in the future
export async function setupNotificaitonsMessage(ctx, isActive) {
   if (ctx.callbackQuery) {
        await ctx.answerCbQuery();
    } 
  let firstOption = "";
  let keyboardOption;
  if (!isActive) {
    firstOption = `1. Start bot sending you notificaitons.\nEvery time you get a notification on your account - it will be sent to you throug this bot.`;
    keyboardOption = Keyboard.scheduleOffNotifMenu();
  } else {
    firstOption = `1. Stop bot from sending you notifications.\nIf you don't want to get them anymore, just stop the bot and you will stop getting any :)`;
    keyboardOption = Keyboard.scheduleOnNotifMenu();
  }

  const finalMessage = `Here you can set up your notifications and start the bot! You can:
    
${firstOption}
2. Disable notifications from certain titles.\nYou can disable titles from which you don't want to recieve any updates (if you change your mind one day - you can turn them back on).`;

  try {
    console.log("Sent out 'setup notifications' message.");
    return ctx.reply(finalMessage, { parse_mode: "HTML", ...keyboardOption, });
  } catch (err) {
    console.error("Couldn't send out a setup message:", err);
    return ctx.reply(
      "Sorry, something went wrong while sending out a message.",
    );
  }
}
