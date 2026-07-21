import axios from "axios";
import { setupEnv } from "../utils/helpers.js";
import { Database } from "../db/db.js";

setupEnv("../../.env");

const database = new Database();

async function getCookieHeaderById(chatId) {
  const userSession = await database.sessionRepo.getUserSessionById(chatId);

  if (!userSession || !userSession.cookies) {
    console.warn(`No cookies for user ${chatId} found!`);
    return null;
  }

  try {
    let cookieArray;

    if (typeof userSession.cookies === "string") {
      cookieArray = JSON.parse(userSession.cookies);
    } else {
      cookieArray = userSession.cookies;
    }

    if (!Array.isArray(cookieArray)) {
      console.error("Cookies field in DB is not an array:", cookieArray);
      return null;
    }

    const cookieString = cookieArray
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    return cookieString;
  } catch (err) {
    console.error("Error parsing cookies from DB:", err);
    return null;
  }
}

export async function createApiClient(chatId) {
  const apiClient = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      Cookie: await getCookieHeaderById(chatId),
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    },
  });
  return apiClient;
}
