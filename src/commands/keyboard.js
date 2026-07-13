import { Markup } from "telegraf";

export class Keyboard {

  static startMenu() {
    return Markup.keyboard(["Start schedule✅", "Unread notifications🔔"]).resize();
  }

  static stopScheduleMenu() {
    return Markup.keyboard(["Stop schedule❌", "Unread notifications🔔"]).resize();
  }
}
