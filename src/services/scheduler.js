import { getNotificationsList } from "./parser.js";
import { sendNewChapter } from "./telegram.js";
import { readJsonFile, writeJsonFile } from "../utils/jsonHelper.js";
import { fileURLToPath } from "url";
import { Database } from "../db/db.js";

const storagePath = fileURLToPath(
  new URL("../storage/storageHistory.json", import.meta.url),
);

const mutedPath = fileURLToPath(
  new URL("../storage/mutedList.json", import.meta.url),
);

const database = new Database();

let scheduleInterval = null;

async function checkChapters(bot, chatId) {

  const userList = await database.notificationHistoryRepo.getByUserId(chatId);
  const chapterIds = userList.map(item => item.chapter_id);
  const chapterIdsSet = new Set(chapterIds);

  let notificationsList = await getNotificationsList(chatId);

  if (!notificationsList || notificationsList.length === 0)  return; // no new chapters were released

  let lastUpdate = notificationsList[0]; // the last released chapter would be first in the array

  // check if lastUpdate had already been seen
  if(chapterIdsSet.has(lastUpdate))
  {
    console.log("No changes.");
    return;
  }

  const lookupSet = new Set(readJsonFile(mutedPath, []));

  // find all items that are newer than checkpoint
  const newItems = [];
  for (const item of notificationsList) {
    if (chapterIdsSet.has(item.id)) break;
    if(compareNotificaitons(item, chatId));
    database.notificationHistoryRepo.addNotificationToDB(item.id, chatId, item.title, item.chapter);
    // skip muted titles - haven't implemented to DB yet
    if (lookupSet.has(item.title)) continue;
    newItems.push(item);
  }

  // send out chapters
  newItems.reverse();
  for (const item of newItems) {
    await sendNewChapter(bot, chatId, item);
  }

  return;
}

export function setSchedule(bot, chatId, stop = false) {
  if (scheduleInterval) {
    clearInterval(scheduleInterval);
  }

  console.log("Starting schedule...");
  if (!scheduleInterval) checkChapters(bot, chatId);
  scheduleInterval = setInterval(
    () => checkChapters(bot, chatId),
    10 * 60 * 1000
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

function compareNotificaitons(item, chatId)
{
  const comparedNotification = await database.notificationHistoryRepo.getNotificationById(chatId, item.title, item.chapter);
  if(comparedNotification) return true;
  return false;
}