import { loginMessage } from "../messages/loginMessage.js";
import { mainMenuMessage } from "../messages/mainMenuMessage.js";

export async function onStartAction(ctx, bot) {
  const chatId = ctx.chat.id;
  const username = ctx.from.username || ctx.from.first_name || "User";
  const user = await ctx.db.userRepo.getUserById(chatId);

  if (!user) {
    const timestamp = Date.now();
    await ctx.db.userRepo.addUserToDB(username, chatId);
    console.log(
      `User is new. Added user to the DB. ChatId = ${chatId}, username = ${username}`,
    );
  } else {
    console.log(
      `User already exists: ChatId = ${chatId}, username = ${username}`,
    );
    const userSession = await ctx.db.sessionRepo.getUserSessionById(chatId);
    console.log("USERSESSION" + userSession.cookies[0] + " " + userSession.is_active + " " + userSession.created_at + " " + userSession.telegram_id);
    if (
      userSession &&
      userSession.cookies &&
      (userSession.is_active === true || userSession.is_active === "true")
    ) {
      console.log(
        `User ${chatId} already has active cookies. Redirecting to options screen right away...`,
      );
      await bot.telegram.sendMessage(
        chatId,
        "You are already logged in and your cookies are active.\nIf you want to log onto your another account - choose to log out first.\nRedirecting you to main page...",
        { parse_mode: "HTML" },
      );
      return await mainMenuMessage(bot, chatId);
    }
  }

  return await loginMessage(ctx);
}
