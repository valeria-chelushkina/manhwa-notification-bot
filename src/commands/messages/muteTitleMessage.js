import { Keyboard } from "../../ui/keyboard.js";
import { getReadingList } from "../../services/parser.js";
import { fileURLToPath } from "url";
import { readJsonFile } from "../../utils/jsonHelper.js";

const mutedPath = fileURLToPath(
  new URL("../../storage/mutedList.json", import.meta.url),
);

export async function muteTitleMessage(ctx) {
  try {
    await ctx.answerCbQuery();
    const readingList = await getReadingList();
    let mutedList = readJsonFile(mutedPath, []);

    if (!Array.isArray(readingList) || readingList.length === 0) {
      return ctx.reply(
        "Your reading list is empty. You have no titles to get notifications from.",
      );
    }

    const lookupSet = new Set(mutedList);

    const formattedList = readingList.map((item, i) => {
      let formatted = `${i + 1}. ${item.title}`;
      const cleanTitle = item.title.trim().toLowerCase();
      if (lookupSet.has(cleanTitle)) {
        formatted += `🔕`;
      }
      return formatted;
    });

    const message = `Your reading list:\n${formattedList.join("\n")}
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
