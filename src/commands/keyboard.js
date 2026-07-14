import { Markup } from "telegraf";

export class Keyboard {

  static mainMenu() {
    return Markup.keyboard(["Set up notifications⚙️", "Unread notifications🔔"]).resize();
  }

  static scheduleOffNotifMenu()
  {
    return Markup.inlineKeyboard([
     [Markup.button.callback('Start sending notifications✅', 'start-schedule')]
    ])
  }

  static scheduleOnNotifMenu()
  {
    return Markup.inlineKeyboard([
     [Markup.button.callback('Stop sending notifications❌', 'stop-schedule')]
    ])
   }
}
