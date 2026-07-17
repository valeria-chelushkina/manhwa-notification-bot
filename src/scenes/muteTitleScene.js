// not completed fully yet.

import { Scenes, Markup, Composer } from "telegraf";
import { compareTitles } from "../utils/helpers.js";
import { fileURLToPath } from "url";
import { getReadingList } from "../services/parser.js";
import fs from "fs";

const mutedPath = fileURLToPath(
  new URL("../storage/mutedList.json", import.meta.url),
);

const inlineHandler = new Composer();
inlineHandler.action("continue", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.reenter();
});
inlineHandler.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("Returning to the main menu...");
  return ctx.scene.leave();
});

export const muteTitleScene = new Scenes.WizardScene(
  "MUTE_TITLE_SCENE",
  (ctx) => {
    ctx.reply(
      "To mute specific title write its full name (just copy it from the list).",
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    try {
      const readingList = await getReadingList();

      const titleName = ctx.message.text;

      // right now it doesnt resolve a problem if there are two same title names. it will just silence all of them.
      if (
        !compareTitles(
          readingList.map((item) => item.title),
          titleName,
        )
      ) {
        ctx.reply(
          "No title found with such name in your reading list. Please check again or write it correctly.",
        );
        return;
      }

      // checks if title is already muted
      if (fs.existsSync(mutedPath)) {
        try {
          let listData = [];
          const rawData = fs.readFileSync(mutedPath, "utf8");
          if (rawData) {
            listData = JSON.parse(rawData);
          }

          console.log(listData);
          if (compareTitles(listData, titleName)) {
            ctx.reply(
              "This title is already muted. Try to choose another one.",
            );
            return;
          }
        } catch (err) {
          console.error("Something went wrong:", err);

          ctx.reply(
            "Something went wrong and couldn't add your title in the muted list. Leaving the scene...",
          );
          return ctx.scene.leave();
        }
      }

      // write the file into the mutedList (will be a DB later)
      if (!appendToJson(mutedPath, titleName)) {
        ctx.reply(
          "Something went wrong and couldn't add your title in the muted list. Leaving the scene...",
        );
        return ctx.scene.leave();
      }

      await ctx.reply("Added your title to a muted list successfully!");

      await ctx.reply("Do you want to choose another title to mute?", {
        ...Markup.inlineKeyboard([
          Markup.button.callback("Yes✅", "continue"),
          Markup.button.callback("No❌", "stop"),
        ]),
      });

      return ctx.wizard.next();
    } catch (err) {
      console.error("Couldn't get a reading list.");
      ctx.reply(
        "Something went wrong and couldn't get your reading list. Leaving the scene...",
      );
      return ctx.scene.leave();
    }
  },
  inlineHandler,
);

function appendToJson(filePath, data) {
  let newData = [];

  if (fs.existsSync(filePath)) {
    try {
      const rawData = fs.readFileSync(filePath, "utf8");
      if (rawData) {
        newData = JSON.parse(rawData);
      }

      newData.push(data);
      const trimmedData = newData.map((item) => {
        return item.trim().toLowerCase();
      });
      fs.writeFileSync(filePath, JSON.stringify(trimmedData));
      console.log("Title successfully added to a muted list file!");
      return true;
    } catch (err) {
      console.error("Something went wrong:", err);
      return false;
    }
  }
}
