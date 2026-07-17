// not completed fully yet.

import { Scenes, Markup, Composer } from "telegraf";
import { compareTitles } from "../../utils/helpers.js";
import { fileURLToPath } from "url";
import { getReadingList } from "../../services/parser.js";
import { readJsonFile, writeJsonFile } from "../../utils/jsonHelper.js";
import { Keyboard } from "../../ui/keyboard.js";

const mutedPath = fileURLToPath(
  new URL("../../storage/mutedList.json", import.meta.url),
);

const inlineHandler = new Composer();
inlineHandler.action("continue", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  return ctx.scene.reenter();
});
inlineHandler.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
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
      const compareResult = compareTitles(
        readingList.map((item) => item.title),
        titleName,
      );

      if (!compareResult.isPresent) {
        ctx.reply(
          "No title found with such name in your reading list. Please check again or write it correctly.",
        );
        return;
      }

      // checks if title is already muted
      let listData = readJsonFile(mutedPath, []);

      if (compareTitles(listData, titleName).isPresent) {
        await ctx.reply(
          "This title is already muted. Do you want to choose another title to mute?",
          {
            ...Keyboard.confirmationKeyboard(),
          },
        );
        return ctx.wizard.next();
      }

      // write the file into the mutedList (will be a DB later)
      if (!appendToJson(mutedPath, compareResult.titleName)) {
        ctx.reply(
          "Something went wrong and couldn't add your title in the muted list. Leaving the scene...",
        );
        return ctx.scene.leave();
      }

      await ctx.reply("Added your title to a muted list successfully!");

      await ctx.reply("Do you want to choose another title to mute?", {
        ...Keyboard.confirmationKeyboard(),
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
  let newData = readJsonFile(filePath, []);

  // if the file was corrupted into a string, reset it to an array
  if (!Array.isArray(newData)) {
    newData = [];
  }

  newData.push(data);

  if (writeJsonFile(filePath, newData)) {
    console.log("Title successfully added to a muted list file!");
    return true;
  } else {
    console.error("Something went wrong writing to file.");
    return false;
  }
}