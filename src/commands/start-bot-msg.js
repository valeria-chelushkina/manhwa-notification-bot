import { Telegraf } from "telegraf";
import { getNotificationsList } from "../services/parser.js";
import { escapeHtml } from "../utils/helpers.js";

const BASE_URL = 'https://comix.to';

export async function firstMessageBot()
{
    return `
    Welcome to manhwa notifications sender bot.
It will (should) send you notificaitons when new chapters of your manhwas come out.

${await formatList()}`;
};

async function formatList()
{
    const unreadList = await getNotificationsList(); // right now i do not check whether it repeats or not
    if(!Array.isArray(unreadList) || unreadList.length === 0)
    {
        return `There is no new notifications on your account!`;
    }

    const formattedList = unreadList.map((item, i) => {
        const safeTitle = escapeHtml(item.title);
        const cleanTitle = safeTitle.replace(/&amp;amp;/g, '&').replace(/&amp;/g, '&');
        const safeUrl = BASE_URL + escapeHtml(item.url);
        const safeChapter = escapeHtml(item.chapter.toString());
        return `${i+1}. <a href='${safeUrl}'>${cleanTitle} - Chapter ${safeChapter}</a>.`;
    });

    return `Here is the list of new notificaitons on your account:
${formattedList.join('\n')}`;
}

console.log(await firstMessageBot());