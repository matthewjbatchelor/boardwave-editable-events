const { query } = require('../config/database');

class ScheduleItem {
  static async findByEventId(eventId) {
    const result = await query(
      'SELECT * FROM schedule_items WHERE event_id = $1 ORDER BY sort_order ASC, time ASC',
      [eventId]
    );
    return result.rows.map(this.deserialize);
  }

  static async findById(id) {
    const result = await query('SELECT * FROM schedule_items WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async create(data) {
    const serialized = this.serialize(data);
    const result = await query(
      `INSERT INTO schedule_items (
        event_id, time, description, sort_order
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        serialized.event_id, serialized.time,
        serialized.description, serialized.sort_order
      ]
    );
    return this.deserialize(result.rows[0]);
  }

  static async update(id, data) {
    const serialized = this.serialize(data);
    const result = await query(
      `UPDATE schedule_items SET
        event_id = $1, time = $2, description = $3, sort_order = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *`,
      [
        serialized.event_id, serialized.time,
        serialized.description, serialized.sort_order, id
      ]
    );
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async delete(id) {
    const result = await query('DELETE FROM schedule_items WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static serialize(item) {
    return {
      event_id: item.eventId,
      time: item.time || '',
      description: item.description || '',
      sort_order: item.sortOrder || 0
    };
  }

  static deserialize(row) {
    return {
      id: row.id,
      eventId: row.event_id,
      time: row.time,
      description: row.description,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = ScheduleItem;
