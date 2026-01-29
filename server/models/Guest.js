const { query } = require('../config/database');

class Guest {
  static async findByEventId(eventId) {
    const result = await query(
      `SELECT * FROM guests WHERE event_id = $1 ORDER BY substring(name from '([^ ]+)$') ASC, name ASC`,
      [eventId]
    );
    return result.rows.map(this.deserialize);
  }

  static async findById(id) {
    const result = await query('SELECT * FROM guests WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async create(data) {
    const serialized = this.serialize(data);
    const result = await query(
      `INSERT INTO guests (
        event_id, name, title, company, bio, image, badge, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        serialized.event_id, serialized.name, serialized.title,
        serialized.company, serialized.bio, serialized.image,
        serialized.badge, serialized.sort_order
      ]
    );
    return this.deserialize(result.rows[0]);
  }

  static async update(id, data) {
    const serialized = this.serialize(data);
    const result = await query(
      `UPDATE guests SET
        event_id = $1, name = $2, title = $3, company = $4,
        bio = $5, image = $6, badge = $7, sort_order = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        serialized.event_id, serialized.name, serialized.title,
        serialized.company, serialized.bio, serialized.image,
        serialized.badge, serialized.sort_order, id
      ]
    );
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async delete(id) {
    const result = await query('DELETE FROM guests WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static serialize(guest) {
    return {
      event_id: guest.eventId,
      name: guest.name || '',
      title: guest.title || '',
      company: guest.company || '',
      bio: guest.bio || '',
      image: guest.image || '',
      badge: guest.badge || null,
      sort_order: guest.sortOrder || 0
    };
  }

  static deserialize(row) {
    return {
      id: row.id,
      eventId: row.event_id,
      name: row.name,
      title: row.title,
      company: row.company,
      bio: row.bio,
      image: row.image,
      badge: row.badge,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Guest;
