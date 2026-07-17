import axios from "axios";
import { fileURLToPath } from "url";
import { readJsonFile } from "../utils/jsonHelper.js";

// resolves relative directory problem
const cookiesPath = fileURLToPath(
  new URL("../storage/cookies.json", import.meta.url),
);

function loadCookiesFromStorage() {
  const cookieArray = readJsonFile(cookiesPath, null);
  if (!cookieArray) {
    console.warn("No cookies found! Please add correct data in there.");
    return "";
  }

  try {
    const cookieHeaderString = cookieArray
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    return cookieHeaderString;
  } catch (err) {
    console.error("Something went wrong mapping cookies: ", err);
    return "";
  }
}

const apiClient = axios.create({
  baseURL: "https://comix.to",
  headers: {
    Cookie: loadCookiesFromStorage(),
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  },
  transformRequest: [(data) => data],
});

export default apiClient;
