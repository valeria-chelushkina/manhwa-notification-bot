import { getNotificationsList } from "./parser.js";
import { sendNewChapter } from "./telegram.js";
import { checkError, cleanTitle, checkActiveCookes } from "../utils/helpers.js";

let scheduleInterval = null;

async function checkChapters(bot, chatId, ctx) {
  let notificationsList = await getNotificationsList(chatId, ctx);

  if (!notificationsList || notificationsList.length === 0) return; // no new chapters were released

  let lastUpdate = notificationsList[0]; // the last released chapter would be first in the array

  const userList = await ctx.db.notificationHistoryRepo.getByUserId(chatId);
  let chapterIds;
  if (userList) {
    chapterIds = userList.map((item) => item.chapter_id);
  } else {
    chapterIds = [];
  }

  const chapterIdsSet = new Set(chapterIds);

  // check if lastUpdate had already been seen
  if (chapterIdsSet.has(lastUpdate)) {
    console.log("No changes.");
    return;
  }

  const mutedList = await ctx.db.userRepo.getMutedListById(chatId);
  const lookupSet = new Set(mutedList);

  // find all items that are newer than checkpoint
  const newItems = [];
  for (const item of notificationsList) {
    item.title = cleanTitle(item.title);
    if (chapterIdsSet.has(item.id)) break;
    if (await compareNotificaitons(item, chatId, ctx));
    await ctx.db.notificationHistoryRepo.addNotificationToDB(
      item.id,
      chatId,
      item.title,
      item.chapter,
    );
    if (lookupSet.has(item.title)) continue;
    newItems.push(item);
  }

  // send out chapters
  newItems.reverse();
  for (const item of newItems) {
    await sendNewChapter(bot, chatId, item);
  }
}

export async function setSchedule(bot, chatId, ctx) {
  await checkActiveCookes(chatId, ctx);
  if (scheduleInterval) {
    clearInterval(scheduleInterval);
  }

  console.log("Starting schedule...");

  await checkChapters(bot, chatId, ctx);

  scheduleInterval = setInterval(async () => {
    try {
      await checkChapters(bot, chatId, ctx);
    } catch (err) {
      console.error(`Error for ${chatId}:`, err.message);

      if (err.name === "ExpiredCookiesError") {
        stopSchedule();
      }
    }
  }, 10 * 60 * 1000);

  scheduleInterval = setInterval(
    () => {
      try {
        checkChapters(bot, chatId, ctx);
      } catch (err) {
        throw err;
      }
    },
    10 * 60 * 1000,
  );
}

export function stopSchedule() {
  if (scheduleInterval) {
    clearInterval(scheduleInterval);
    scheduleInterval = null;
    console.log("Interval cleared successfully.");
  } else {
    console.log("No active interval to stop.");
  }
}

async function compareNotificaitons(item, chatId, ctx) {
  const comparedNotification =
    await ctx.db.notificationHistoryRepo.getNotificationById(
      chatId,
      item.title,
      item.chapter,
    );
  if (comparedNotification) return true;
  return false;
}
