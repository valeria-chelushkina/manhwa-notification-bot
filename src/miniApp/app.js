import express from "express";
import { message } from "telegraf/filters";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import axios from "axios";
import { LoginOnWebsite } from "./login.js";

// create express application
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/login", (req, res) => {
  const userUsername = req.body.username;
  const userPassword = req.body.password;
  const telegramId = req.body.telegramId;

  console.log(`Recieved login info for user: ${userUsername}`);

  res.json({
    success: true,
    message: "Data received successfully!",
  });

  const cookies = LoginOnWebsite(userUsername, userPassword);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
