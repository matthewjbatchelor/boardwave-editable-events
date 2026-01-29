const { query } = require('../config/database');

class Event {
  static async findAll() {
    const result = await query('SELECT * FROM events ORDER BY event_date DESC, created_at DESC');
    return result.rows.map(this.deserialize);
  }

  static async findById(id) {
    const result = await query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async findBySlug(slug) {
    const result = await query('SELECT * FROM events WHERE slug = $1', [slug]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async create(data) {
    const serialized = this.serialize(data);
    const result = await query(
      `INSERT INTO events (
        title, slug, subtitle, event_date, event_time, location, venue,
        hero_image, description, schedule_heading, schedule_intro, welcome_message, signature,
        contact_name, contact_title, contact_email, contact_phone,
        partner_name, partner_logo, partner_description, partner_website,
        testimonial_text, testimonial_author, testimonial_title, testimonial_company, testimonial_image,
        connect_intro, connect_instructions, connect_link, connect_image,
        is_published
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
      ) RETURNING *`,
      [
        serialized.title, serialized.slug, serialized.subtitle,
        serialized.event_date, serialized.event_time, serialized.location, serialized.venue,
        serialized.hero_image, serialized.description, serialized.schedule_heading, serialized.schedule_intro,
        serialized.welcome_message, serialized.signature,
        serialized.contact_name, serialized.contact_title, serialized.contact_email, serialized.contact_phone,
        serialized.partner_name, serialized.partner_logo, serialized.partner_description, serialized.partner_website,
        serialized.testimonial_text, serialized.testimonial_author, serialized.testimonial_title,
        serialized.testimonial_company, serialized.testimonial_image,
        serialized.connect_intro, serialized.connect_instructions, serialized.connect_link, serialized.connect_image,
        serialized.is_published
      ]
    );
    return this.deserialize(result.rows[0]);
  }

  static async update(id, data) {
    const serialized = this.serialize(data);
    const result = await query(
      `UPDATE events SET
        title = $1, slug = $2, subtitle = $3,
        event_date = $4, event_time = $5, location = $6, venue = $7,
        hero_image = $8, description = $9, schedule_heading = $10, schedule_intro = $11,
        welcome_message = $12, signature = $13,
        contact_name = $14, contact_title = $15, contact_email = $16, contact_phone = $17,
        partner_name = $18, partner_logo = $19, partner_description = $20, partner_website = $21,
        testimonial_text = $22, testimonial_author = $23, testimonial_title = $24,
        testimonial_company = $25, testimonial_image = $26,
        connect_intro = $27, connect_instructions = $28, connect_link = $29, connect_image = $30,
        is_published = $31,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $32
      RETURNING *`,
      [
        serialized.title, serialized.slug, serialized.subtitle,
        serialized.event_date, serialized.event_time, serialized.location, serialized.venue,
        serialized.hero_image, serialized.description, serialized.schedule_heading, serialized.schedule_intro,
        serialized.welcome_message, serialized.signature,
        serialized.contact_name, serialized.contact_title, serialized.contact_email, serialized.contact_phone,
        serialized.partner_name, serialized.partner_logo, serialized.partner_description, serialized.partner_website,
        serialized.testimonial_text, serialized.testimonial_author, serialized.testimonial_title,
        serialized.testimonial_company, serialized.testimonial_image,
        serialized.connect_intro, serialized.connect_instructions, serialized.connect_link, serialized.connect_image,
        serialized.is_published, id
      ]
    );
    return result.rows[0] ? this.deserialize(result.rows[0]) : null;
  }

  static async delete(id) {
    // Delete related data first
    await query('DELETE FROM schedule_items WHERE event_id = $1', [id]);
    await query('DELETE FROM guests WHERE event_id = $1', [id]);
    await query('DELETE FROM speakers WHERE event_id = $1', [id]);
    await query('DELETE FROM hosts WHERE event_id = $1', [id]);

    const result = await query('DELETE FROM events WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static serialize(event) {
    return {
      title: event.title || '',
      slug: event.slug || this.generateSlug(event.title),
      subtitle: event.subtitle || '',
      event_date: event.eventDate || null,
      event_time: event.eventTime || '',
      location: event.location || '',
      venue: event.venue || '',
      hero_image: event.heroImage || '',
      description: event.description || '',
      schedule_heading: event.scheduleHeading || '',
      schedule_intro: event.scheduleIntro || '',
      welcome_message: event.welcomeMessage || '',
      signature: event.signature || '',
      contact_name: event.contactName || '',
      contact_title: event.contactTitle || '',
      contact_email: event.contactEmail || '',
      contact_phone: event.contactPhone || '',
      partner_name: event.partnerName || '',
      partner_logo: event.partnerLogo || '',
      partner_description: event.partnerDescription || '',
      partner_website: event.partnerWebsite || '',
      testimonial_text: event.testimonialText || '',
      testimonial_author: event.testimonialAuthor || '',
      testimonial_title: event.testimonialTitle || '',
      testimonial_company: event.testimonialCompany || '',
      testimonial_image: event.testimonialImage || '',
      connect_intro: event.connectIntro || '',
      connect_instructions: event.connectInstructions || '',
      connect_link: event.connectLink || '',
      connect_image: event.connectImage || '',
      is_published: event.isPublished ? 1 : 0
    };
  }

  static deserialize(row) {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      subtitle: row.subtitle,
      eventDate: row.event_date,
      eventTime: row.event_time,
      location: row.location,
      venue: row.venue,
      heroImage: row.hero_image,
      description: row.description,
      scheduleHeading: row.schedule_heading,
      scheduleIntro: row.schedule_intro,
      welcomeMessage: row.welcome_message,
      signature: row.signature,
      contactName: row.contact_name,
      contactTitle: row.contact_title,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      partnerName: row.partner_name,
      partnerLogo: row.partner_logo,
      partnerDescription: row.partner_description,
      partnerWebsite: row.partner_website,
      testimonialText: row.testimonial_text,
      testimonialAuthor: row.testimonial_author,
      testimonialTitle: row.testimonial_title,
      testimonialCompany: row.testimonial_company,
      testimonialImage: row.testimonial_image,
      connectIntro: row.connect_intro,
      connectInstructions: row.connect_instructions,
      connectLink: row.connect_link,
      connectImage: row.connect_image,
      isPublished: Boolean(row.is_published),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  static generateSlug(title) {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

module.exports = Event;
