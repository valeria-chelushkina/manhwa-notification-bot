import express from "express";
import { message } from "telegraf/filters";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import axios from "axios";
import { setupEnv } from "../utils/helpers.js";

setupEnv("../../.env");

// create express application
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

import fs from "fs";

app.post("/api/login", async (req, res) => {
  const cookiesString = req.body.cookies;

  if (!cookiesString) {
    return res.json({ success: false, message: "No cookies provided." });
  }

  try {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    const verifyResponse = await axios.get(
      process.env.BASE_URL + "/api/v1/user/notifications?scope=comics&unread=1",
      {
        headers: {
          Cookie: cookiesString,
          "User-Agent": userAgent,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        validateStatus: (status) => status < 500,
      }
    );

    if (verifyResponse.status === 401 || verifyResponse.status === 403 || verifyResponse.data?.message === "Unauthenticated.") {
      return res.json({ success: false, message: "Invalid or expired cookies." });
    }

    const cookieArray = cookiesString.split(';').map(c => {
      const [name, ...val] = c.trim().split('=');
      return { name, value: val.join('=') };
    }).filter(c => c.name);

    // will change to DB or return
    const storagePath = path.join(__dirname, "..", "storage", "cookies.json");
    fs.writeFileSync(storagePath, JSON.stringify(cookieArray, null, 2));
    
    console.log("Cookies verified and saved successfully.");
    
    res.json({ success: true, message: "Logged in securely!" });

  } catch (err) {
    console.error("Error verifying cookies:", err.message);
    res.json({ success: false, message: "Error verifying cookies." });
  }
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
