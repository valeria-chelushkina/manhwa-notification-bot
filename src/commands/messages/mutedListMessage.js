import { Database } from "../../db/db.js";

const database = new Database().userRepo;

export async function mutedListMessage(ctx) {
  try {
    await ctx.answerCbQuery();
    const chatId = ctx.chat.id;
    const mutedList = await database.getMutedListById(chatId);

    if (!Array.isArray(mutedList) || mutedList.length === 0) {
      return ctx.reply("Your muted list is empty. No titles muted.");
    }

    const formattedList = mutedList.map((item, i) => {
      return `${i + 1}. ${item}🔕`;
    });

    const message = `Your muted list:\n${formattedList.join("\n")}
`;

    console.log("Bot sent out muted list.");
    return ctx.reply(message, { parse_mode: "HTML" });
  } catch (err) {
    console.error("Couldn't send out a muted list: ", err);
    return ctx.reply(
      "Sorry, something went wrong while sending out a message.",
    );
  }
}
