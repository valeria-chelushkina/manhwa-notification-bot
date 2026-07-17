import { Markup } from "telegraf";

export class Keyboard {
  static mainMenu() {
    return Markup.keyboard([
      "Set up notifications⚙️",
      "Unread notifications🔔",
    ]).resize();
  }

  static scheduleOffNotifMenu() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Start sending notifications✅",
          "start-schedule",
        ),
      ],
      [
        Markup.button.callback(
          "Disable title notifications",
          "disable-title-notif",
        ),
      ],
    ]);
  }

  static scheduleOnNotifMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.callback("Stop sending notifications❌", "stop-schedule")],
      [
        Markup.button.callback(
          "Disable title notifications",
          "disable-title-notif",
        ),
      ],
    ]);
  }

  static disableNotifMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.callback("Mute title🔕", "mute-title")],
      [Markup.button.callback("List of muted titles🔕", "muted-list")],
    ]);
  }

  static cancelMenu() {
    return Markup.keyboard(["Cancel❌"]).resize();
  }

  static confirmationKeyboard() {
    return Markup.inlineKeyboard([
      Markup.button.callback("Yes✅", "continue"),
      Markup.button.callback("No❌", "stop"),
    ]);
  }
}
