import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { ExpiredCookiesError } from "../config/api.js";

setupEnv("../../.env");

export function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function cleanTitle(text)
{
  if(!text) return '';
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function cleanHtml(data) {
  const safeTitle = escapeHtml(data.title);
  const safeUrl = process.env.BASE_URL + escapeHtml(data.url);
  const safeChapter = escapeHtml(data.chapter.toString());

  return {
    url: safeUrl,
    chapter: safeChapter,
  };
}

export function compareTitles(readingList, titleName) {
  const checkTitle = (obj) =>
    obj.trim().toLowerCase() === titleName.trim().toLowerCase();

  const result = {
    isPresent: readingList.some(checkTitle),
    titleName: readingList.find(checkTitle) || "",
  };

  return result;
}

export function setupEnv(filePath) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, filePath) });
}

export async function checkError(err, ctx, errMsg, ctxMsg) {
  if (err instanceof ExpiredCookiesError) {
    return await ctx.reply(
      "🍪Cookies expired! Please relogin once again through /login command.",
      { parse_mode: "HTML" },
    );
  }
  console.error(errMsg + err);
  return await ctx.reply(ctxMsg, { parse_mode: "HTML" });
}

export async function checkActiveCookes(chatId, ctx)
{
  const session = await ctx.db.sessionRepo.getUserSessionById(chatId);
  const is_active = session.is_active;
  if(!is_active || is_active === 'false') {
    const err = new ExpiredCookiesError();
    throw err;
  }
}