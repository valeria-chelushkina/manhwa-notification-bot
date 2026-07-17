import axios from "axios";
import { fileURLToPath } from "url";
import fs from 'fs';
import { readJsonFile } from "../utils/jsonHelper";

// resolves relative directory problem
const cookiesPath = fileURLToPath(
  new URL("../storage/cookies.json", import.meta.url),
);

function loadCookiesFromStorage() {
  try {
    // checks if file exists
    if (!fs.existsSync(cookiesPath)) {
      console.warn("No cookies found! Please add correct data in there.");
      return "";
    }
    const cookieArray = readJsonFile(cookiesPath);

    const cookieHeaderString = cookieArray
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    return cookieHeaderString;
  } catch (err) {
    console.error("Something went wrong: ", err);
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
