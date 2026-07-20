export class NotificationHistoryRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async addNotificationToDB(id, chatId, title, chapter) {
    const timestamp = new Date().toISOString();
    const query = `INSERT INTO notification_history (telegram_id, title_name, chapter_number, chapter_id, sent_at) VALUES ($1, $2, $3, $4, $5)`;

    try {
      await this.pool.query(query, [chatId, title, chapter, id, timestamp]);
    } catch (err) {
      console.error("Couldn't add notidication to DB: ", err);
      throw err;
    }
  }

  async getNotificationById(chatId, title, chapter) {
    const query = `SELECT * FROM notification_history WHERE telegram_id = $1 AND title_name = $2 AND chapter_number=$3`;

    try {
      const res = await this.pool.query(query, [chatId, title, chapter]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (err) {
      console.error("Couldn't get notification from DB by ID: ", err);
      return null;
    }
  }

  async getByUserId(chatId) {
    const query = `SELECT * FROM notification_history WHERE telegram_id = $1`;
    try {
      const res = await this.pool.query(query, [chatId]);
      if (res.rows.length === 0) return null;
      return res.rows;
    } catch (err) {
      console.error("Couldn't get notifications from DB by user ID: ", err);
      return null;
    }
  }
}
