import express from "express";
import { message } from "telegraf/filters";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import axios from "axios";
import { setupEnv } from "../utils/helpers.js";
import { Database } from "../db/db.js";
import { optionsMessage } from "../commands/messages/optionsMessage.js";
  import fs from "fs";
  import { loginMessage } from "../commands/messages/loginMessage.js";

setupEnv("../../.env");

const database = new Database();

export async function startServer(bot) {
  // create express application
  const app = express();
  const port = 3000;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.post("/api/login", async (req, res) => {
    const cookiesString = req.body.cookies;
    const tgId = req.body.telegram_id;

    if (!cookiesString) {
      return res.json({ success: false, message: "No cookies provided." });
    }

    try {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

      console.log("Verifying cookies of user " + tgId);

      const verifyResponse = await axios.get(
        process.env.BASE_URL +
          "/api/v1/user/notifications?scope=comics&unread=1",
        {
          headers: {
            Cookie: cookiesString,
            "User-Agent": userAgent,
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          validateStatus: (status) => status < 500,
        },
      );

      if (
        verifyResponse.status === 401 ||
        verifyResponse.status === 403 ||
        verifyResponse.data?.message === "Unauthenticated."
      ) {
        return res.json({
          success: false,
          message: "Invalid or expired cookies.",
        });
      }

      const cookieArray = cookiesString
        .split(";")
        .map((c) => {
          const [name, ...val] = c.trim().split("=");
          return { name, value: val.join("=") };
        })
        .filter((c) => c.name);

      const cookiesFormatted = JSON.stringify(cookieArray, null, 2);

      // check if user exist in users table
      const user = await database.userRepo.getUserById(tgId);
      if (!user) {
        return res.json({
          success: false,
          message: "Please start the bot before logging in.",
        });
      }

      // check if cookies exist for this user
      const userCookiesInfo =
        await database.sessionRepo.getUserSessionById(tgId);

      if (userCookiesInfo) {
        if (
          cookiesFormatted === userCookiesInfo.cookies &&
          (userCookiesInfo.is_active === true ||
            userCookiesInfo.is_active === "true")
        ) {
          console.log("Cookies are up to date.");
        } else {
          await database.sessionRepo.updateCookies(cookiesFormatted, tgId);
        }
      } else {
        await database.sessionRepo.addCookiesToDB(cookiesFormatted, tgId);
      }

      console.log("Cookies verified and saved successfully.");

      res.json({ success: true, message: "Logged in securely!" });
    } catch (err) {
      console.error("Error verifying cookies:", err.message);
      res.json({ success: false, message: "Error verifying cookies." });
    }
  });

  // Node.js Backend
  app.post("/api/login-success", async (req, res) => {
    const { userId } = req.body;

    try {
      // check if user exist in users table
      const user = await database.userRepo.getUserById(userId);

      if (!user) {
        console.log(`User ${userId} is not logged in!`);
        return res.sendStatus(401);
      }

      // 2. Send the message via the bot instance
      await bot.telegram.sendMessage(
        userId,
        "You logged in successfully! 🎉 Now you can set up your notifications.",
      );

      optionsMessage(bot, userId);

      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at ${port}`);
  });
}
