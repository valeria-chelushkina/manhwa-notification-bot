import { Scenes, session } from "telegraf";
import { muteTitleScene } from "./wizardScenes/muteTitleScene.js";
import { unmuteTitleScene } from "./wizardScenes/unmuteTitleScene.js";

export function setupScenes(bot) {
  const stage = new Scenes.Stage([muteTitleScene, unmuteTitleScene]);

  bot.use(session());
  bot.use(stage.middleware());
}
