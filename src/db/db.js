import pg from "pg";
import dotenv from "dotenv";
import { UserRepo } from "./repos/userRepo.js";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    });

    this.userRepo = new UserRepo(this.pool);
  }
}
