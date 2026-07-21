// not completed fully yet.

import { Scenes, Markup, Composer } from "telegraf";
import { compareTitles } from "../../utils/helpers.js";
import { getReadingList } from "../../services/parser.js";
import { mainMenuMessage } from "../../commands/messages/mainMenuMessage.js";
import { Keyboard } from "../../ui/keyboard.js";
import { Database } from "../../db/db.js";
import { checkError } from "../../utils/helpers.js";

const database = new Database();

export const inlineHandler = new Composer();
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
      Markup.removeKeyboard(),
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      const readingList = await getReadingList(chatId);
      const titleName = ctx.message.text;

      // right now it doesnt resolve a problem if there are two same title names. it will just silence all of them.
      // check if title exists in reading list
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
      let listData = await database.userRepo.getMutedListById(chatId);

      if (compareTitles(listData, titleName).isPresent) {
        await ctx.reply(
          "This title is already muted. Do you want to choose another title to mute?",
          {
            ...Keyboard.confirmationKeyboard(),
          },
        );
        return ctx.wizard.next();
      }

      try {
        await database.userRepo.addToMutedList(chatId, compareResult.titleName);

        await ctx.reply("Added your title to a muted list successfully!");

        await ctx.reply("Do you want to choose another title to mute?", {
          ...Keyboard.confirmationKeyboard(),
        });

        return ctx.wizard.next();
      } catch (err) {
        ctx.reply(
          "Something went wrong and couldn't add your title in the muted list. Leaving the scene...",
        );
        return ctx.scene.leave();
      }
    } catch (err) {
      const errMsg = "Couldn't get a reading list: ";
      const ctxMsg =
        "Something went wrong and couldn't get your reading list. Leaving the scene...";
      await checkError(err, ctx, errMsg, ctxMsg);

      return ctx.scene.leave();
    }
  },
  inlineHandler,
);

muteTitleScene.leave(async (ctx) => {
  const chatId = ctx.chat.id;
  const bot = ctx.telegram;

  await mainMenuMessage(bot, chatId);
});
