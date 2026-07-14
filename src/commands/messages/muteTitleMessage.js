import { Keyboard } from "../../ui/keyboard.js";
import { getReadingList } from "../../services/parser.js";

export async function muteTitleMessage(ctx) {
  try {
    await ctx.answerCbQuery();
    const readingList = await getReadingList();

    if (!Array.isArray(readingList) || readingList.length === 0) {
      return ctx.reply(
        "Your reading list is empty. You have no titles to get notifications from.",
      );
    }
    const formattedList = readingList.map((item, i) => {
      return `${i + 1}. ${item.title}`;
    });

    const message = `To mute specific title write its full name (just copy it from the list) or write its number. If you changed your mind - type 0.

Your reading list:
${formattedList.join("\n")}
`;

    console.log("Bot sent out reading list.");
    return ctx.reply(message, { parse_mode: "HTML" });
  } catch (err) {
    console.error("Couldn't send out a reading list: ", err);
    return ctx.reply(
      "Sorry, something went wrong while sending out a message.",
    );
  }
}
