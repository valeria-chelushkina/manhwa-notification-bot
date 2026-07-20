import { startMessage } from "../messages/startMessage.js";
import { loginMessage } from "../messages/loginMessage.js";

export async function onStartAction(ctx) {
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
      `User already exists: ${user}; ChatId = ${chatId}, username = ${username}`,
    );
  }

  await loginMessage(ctx);
}
