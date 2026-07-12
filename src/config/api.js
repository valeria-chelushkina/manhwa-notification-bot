import axios from "axios";
import path from "path";
import fs, { readFileSync } from "fs";
import { fileURLToPath } from "url";

// const cookiesPath = path.resolve("src", "storage", "cookies.json");

// resolves relative directory problem
const cookiesPath = fileURLToPath(new URL("../storage/cookies.json", import.meta.url));

function loadCookiesFromStorage() {
  try {
    // checks if file exists
    if (!fs.existsSync(cookiesPath)) {
      console.warn("No cookies found! Please add correct data in there.");
      return "";
    }
    const rawData = fs.readFileSync(cookiesPath, "utf8");
    const cookieArray = JSON.parse(rawData);

    const cookieHeaderString = cookieArray
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    return cookieHeaderString;
  } catch (err) {
    console.error("Something went wrong: ", err);
    return "";
  }
}

const apiClient = await axios.create({
  baseURL: "https://comix.to",
  headers: {
    Cookie: loadCookiesFromStorage(),
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  },
  transformRequest: [(data) => data],
});

export default apiClient;
