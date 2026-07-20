export class SessionRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async addCookiesToDB(cookies, chatId) {
    const timestamp = new Date().toISOString();
    const query = `INSERT INTO user_sessions (telegram_id, cookies, is_active, created_at) VALUES ($1, $2, $3, $4)`;

    try {
      await this.pool.query(query, [chatId, cookies, "true", timestamp]);
    } catch (err) {
      console.error("Couldn't add cookies to DB: ", err);
      throw err;
    }
  }

  async getUserSessionById(chatId) {
    const query = `SELECT * FROM user_sessions WHERE telegram_id = $1`;

    try {
      const res = await this.pool.query(query, [chatId]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (err) {
      console.error("Couldn't get cookies from DB by ID: ", err);
      return null;
    }
  }

  async updateCookies(cookies, chatId) {
    const timestamp = new Date().toISOString();
    const query = `UPDATE user_sessions SET cookies = $1, is_active = $2, created_at = $3 WHERE telegram_id = $4`;

    try {
      await this.pool.query(query, [cookies, "true", timestamp, chatId]);
    } catch (err) {
      console.error("Couldn't update cookies in DB: ", err);
      throw err;
    }
  }
}
