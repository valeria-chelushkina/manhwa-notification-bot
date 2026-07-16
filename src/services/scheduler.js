import { getNotificationsList } from "./parser.js";
import { sendNewChapter } from "./telegram.js";
import { fileURLToPath } from "url";
import fs from 'fs';

const storagePath = fileURLToPath(
  new URL("../storage/storageHistory.json", import.meta.url),
);

let scheduleInterval = null;

async function checkChapters(bot, chatId) {
  let notificationsList = await getNotificationsList();

  if (!notificationsList || notificationsList.length === 0) return; // no new chapters were released

  let lastUpdate = notificationsList[0]; // the last released chapter would be first in the array

  let lastSeenId = "";
  if (fs.existsSync(storagePath)) {
    try {
      const rawData = fs.readFileSync(storagePath, "utf8");
      if (rawData) lastSeenId = JSON.parse(rawData).lastSeenId;
    } catch (err) {
      console.error("What happened?", err);
    }
  }

  // if the newest ID matches history, drop execution early
  if (lastUpdate.id === lastSeenId) {
    console.log("No changes.");
    return;
  }

  // find all items that are newer than checkpoint
  const newItems = [];
  for (const item of notificationsList) {
    if (item.id === lastSeenId) break;
    newItems.push(item);
  }

  // send out chapters
  newItems.reverse();
  for (const item of newItems) {
    await sendNewChapter(bot, chatId, item);
  }

  // save the fresh checkpoint tracking data
  fs.writeFileSync(
    storagePath,
    JSON.stringify({ lastSeenId: lastUpdate.id }, null, 2),
  );

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
