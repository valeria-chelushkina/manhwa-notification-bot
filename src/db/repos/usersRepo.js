export class UserRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async addUserToDB(username, chatId) {
    const timestamp = new Date().toISOString();
    const query = `INSERT INTO users (telegram_id, username, created_at) VALUES ($1, $2, $3)`;

    try {
      await this.pool.query(query, [chatId, username, timestamp]);
    } catch (err) {
      console.error("Couldn't add user to DB: ", err);
      throw err;
    }
  }

  async getUserById(chatId) {
    const query = `SELECT * FROM users WHERE telegram_id = $1`;

    try {
      const res = await this.pool.query(query, [chatId]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (err) {
      console.error("Couldn't get user from DB by ID: ", err);
      return null;
    }
  }

  async getMutedListById(chatId) {
    const query = `SELECT muted_list FROM users WHERE telegram_id = $1`;

    try {
      const res = await this.pool.query(query, [chatId]);
      if (res.rows.length === 0) return null;
      return res.rows[0].muted_list;
    } catch (err) {
      console.error("Couldn't get muted list from DB by ID: ", err);
      return null;
    }
  }

  async addToMutedList(chatId, title) {
    const query = `UPDATE users SET muted_list = array_append(muted_list, $1) WHERE telegram_id = $2`;

    try {
      await this.pool.query(query, [title, chatId]);
    } catch (err) {
      console.error("Couldn't add title to muted list to DB: ", err);
      throw err;
    }
  }
}
