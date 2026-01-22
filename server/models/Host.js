const { query } = require('../config/database');

class Host {
  static async findByEventId(eventId) {
    const result = await query(
      'SELECT * FROM hosts WHERE event_id = $1 ORDER BY sort_order ASC',
      [eventId]
    );
    return result.rows.map(this.deserialize);
  }

  static async findById(id) {
    const result = await query('SELECT * FROM hosts WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async create(data) {
    const serialized = this.serialize(data);
    const result = await query(
      `INSERT INTO hosts (
        event_id, name, title, company, bio, image, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        serialized.event_id, serialized.name, serialized.title,
        serialized.company, serialized.bio, serialized.image,
        serialized.sort_order
      ]
    );
    return this.deserialize(result.rows[0]);
  }

  static async update(id, data) {
    const serialized = this.serialize(data);
    const result = await query(
      `UPDATE hosts SET
        event_id = $1, name = $2, title = $3, company = $4,
        bio = $5, image = $6, sort_order = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        serialized.event_id, serialized.name, serialized.title,
        serialized.company, serialized.bio, serialized.image,
        serialized.sort_order, id
      ]
    );
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async delete(id) {
    const result = await query('DELETE FROM hosts WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static serialize(host) {
    return {
      event_id: host.eventId,
      name: host.name || '',
      title: host.title || '',
      company: host.company || '',
      bio: host.bio || '',
      image: host.image || '',
      sort_order: host.sortOrder || 0
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
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Host;
