// not completed fully yet.

import { Scenes, Markup, Composer } from "telegraf";
import { compareTitles } from "../../utils/helpers.js";
import { mainMenuMessage } from "../../commands/messages/mainMenuMessage.js";
import { fileURLToPath } from "url";
import { readJsonFile, writeJsonFile } from "../../utils/jsonHelper.js";
import { Keyboard } from "../../ui/keyboard.js";
import { Database } from "../../db/db.js";

const database = new Database().userRepo;

const startStepHandler = new Composer();
startStepHandler.action("continue-unmute", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.reply("Write in a name of a title you wish to unmute.");
  return ctx.wizard.next();
});
startStepHandler.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.reply("Returning to the main menu...");
  return ctx.scene.leave();
});

const endStepHandler = new Composer();
endStepHandler.action("continue", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.reply("Write in a name of a title you wish to unmute.");
  return ctx.wizard.selectStep(2);
});
endStepHandler.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await ctx.reply("Returning to the main menu...");
  return ctx.scene.leave();
});

export const unmuteTitleScene = new Scenes.WizardScene(
  "UNMUTE_TITLE_SCENE",
  (ctx) => {
    ctx.reply("Do you wish to unmute any titles?", {
      ...Markup.inlineKeyboard([
        Markup.button.callback("Yes✅", "continue-unmute"),
        Markup.button.callback("No❌", "stop"),
      ]),
    });
    return ctx.wizard.next();
  },
  startStepHandler,
  async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      const titleName = ctx.message.text;
      let listData = await database.getMutedListById(chatId);
      const compareResult = compareTitles(listData, titleName);

      if (!compareResult.isPresent) {
        await ctx.reply(
          "No title found with such name in your muted list. Please check again or write it correctly.",
        );
        return;
      }

      console.log(compareResult.isPresent + " " + compareResult.titleName);

      // remove title from muted list
      const index = listData.indexOf(compareResult.titleName);

      console.log(index);
      if (index > -1) {
        listData.splice(index, 1);
      }

      console.log(listData);

      // write new array into the muted list
      try {
        await database.updateMutedList(chatId, listData);

        await ctx.reply("Unmuted title successfully!");

        await ctx.reply("Do you want to choose another title to unmute?", {
          ...Keyboard.confirmationKeyboard(),
        });

        return ctx.wizard.next();
      } catch (err) {
        await ctx.reply(
          "Something went wrong and couldn't delete your title from muted list. Leaving the scene...",
        );
        return ctx.scene.leave();
      }
    } catch (err) {
      console.error("Couldn't get a muted list.");
      await ctx.reply(
        "Something went wrong and couldn't get your muted list. Leaving the scene...",
      );
      return ctx.scene.leave();
    }
  },
  endStepHandler,
);

unmuteTitleScene.leave(async (ctx) => await mainMenuMessage(ctx));
