// not completed fully yet.

import { Scenes } from "telegraf";
import { compareTitles } from "../utils/helpers.js";
import { fileURLToPath } from "url";
import { getReadingList } from "../services/parser.js";
import fs from "fs";

export const muteTitleScene = new Scenes.WizardScene(
  "MUTE_TITLE_SCENE",
  (ctx) => {
    ctx.reply(
      "To mute specific title write its full name (just copy it from the list).",
    );
    ctx.wizard.state.titleInfo = {};
    ctx.wizard.next();
  },
  async (ctx) => {
    try {
      const readingList = await getReadingList();

      // right now it doesnt resolve a problem if there are two same title names. it will just silence all of them.
      if (!compareTitles(readingList, ctx.message.text)) {
        ctx.reply(
          "No title found with such name in your reading list. Please check again or write it correctly.",
        );
        return;
      }

      const mutedPath = fileURLToPath(
        new URL("../storage/mutedList.json", import.meta.url),
      );

      // write the file into the mutedList (will be a DB later)
      if (!appendToJson(mutedPath, ctx.message.text)) {
        ctx.reply(
          "Something went wrong and couldn't add your title in the muted list. Leaving the scene...",
        );
        return ctx.scene.leave();
      }

      ctx.reply(
        "Added your title to a muted list successfully! Now leaving the scene...",
      );

      // will add 'add more' 'leave' choice later
      return ctx.scene.leave();
    } catch (err) {
      console.error("Couldn't get a reading list.");
      ctx.reply(
        "Something went wrong and couldn't get your reading list. Leaving the scene...",
      );
      return ctx.scene.leave();
    }
  },
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
