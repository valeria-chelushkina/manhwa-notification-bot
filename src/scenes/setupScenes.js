import { Scenes, session } from "telegraf";
import { muteTitleScene } from "./muteTitleScene.js";

export function setupScenes(bot) {
  const stage = new Scenes.Stage([muteTitleScene]);

  bot.use(session());
  bot.use(stage.middleware());
}
