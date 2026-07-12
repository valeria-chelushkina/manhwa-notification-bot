import { cleanHtml } from "../utils/helpers.js";

export async function sendNewChapter(bot, chatId, data) {
  Object.assign(data, cleanHtml(data));
  const caption = `<b>\t\tNew chapter just came out!🎉🎉</b>

<b><i>⪼---➢ ${data.title}🐾🐾</i></b>
⪼---➢ Chapter ${data.chapter}🖇
⪼---➢ Released: ${data.releasedAt}⏳

<a href='${data.url}'>\t\t--Click here to read👈--</a>`;

  try {
    await bot.telegram.sendPhoto(
      chatId,
      { url: data.thumbnail.large },
      { caption: caption, parse_mode: "HTML" },
    );

    console.log("Sent chapter sucessfully");
  } catch (err) {
    console.error("Couldn't send a chapter!", err);
  }
}
