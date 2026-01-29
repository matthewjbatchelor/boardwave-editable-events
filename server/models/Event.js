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
        hero_image, description, description_image, schedule_heading, schedule_intro, schedule_image, welcome_message, signature,
        contact_name, contact_title, contact_email, contact_phone,
        partner_name, partner_logo, partner_description, partner_website,
        testimonial_text, testimonial_author, testimonial_title, testimonial_company, testimonial_image,
        partner_hero_image, connect_intro, connect_instructions, connect_link, connect_image,
        is_published
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
      ) RETURNING *`,
      [
        serialized.title, serialized.slug, serialized.subtitle,
        serialized.event_date, serialized.event_time, serialized.location, serialized.venue,
        serialized.hero_image, serialized.description, serialized.description_image,
        serialized.schedule_heading, serialized.schedule_intro,
        serialized.schedule_image, serialized.welcome_message, serialized.signature,
        serialized.contact_name, serialized.contact_title, serialized.contact_email, serialized.contact_phone,
        serialized.partner_name, serialized.partner_logo, serialized.partner_description, serialized.partner_website,
        serialized.testimonial_text, serialized.testimonial_author, serialized.testimonial_title,
        serialized.testimonial_company, serialized.testimonial_image, serialized.partner_hero_image,
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
        hero_image = $8, description = $9, description_image = $10,
        schedule_heading = $11, schedule_intro = $12,
        schedule_image = $13, welcome_message = $14, signature = $15,
        contact_name = $16, contact_title = $17, contact_email = $18, contact_phone = $19,
        partner_name = $20, partner_logo = $21, partner_description = $22, partner_website = $23,
        testimonial_text = $24, testimonial_author = $25, testimonial_title = $26,
        testimonial_company = $27, testimonial_image = $28, partner_hero_image = $29,
        connect_intro = $30, connect_instructions = $31, connect_link = $32, connect_image = $33,
        is_published = $34,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $35
      RETURNING *`,
      [
        serialized.title, serialized.slug, serialized.subtitle,
        serialized.event_date, serialized.event_time, serialized.location, serialized.venue,
        serialized.hero_image, serialized.description, serialized.description_image,
        serialized.schedule_heading, serialized.schedule_intro,
        serialized.schedule_image, serialized.welcome_message, serialized.signature,
        serialized.contact_name, serialized.contact_title, serialized.contact_email, serialized.contact_phone,
        serialized.partner_name, serialized.partner_logo, serialized.partner_description, serialized.partner_website,
        serialized.testimonial_text, serialized.testimonial_author, serialized.testimonial_title,
        serialized.testimonial_company, serialized.testimonial_image, serialized.partner_hero_image,
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
      description_image: event.descriptionImage || '',
      schedule_heading: event.scheduleHeading || '',
      schedule_intro: event.scheduleIntro || '',
      schedule_image: event.scheduleImage || '',
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
      partner_hero_image: event.partnerHeroImage || '',
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
      descriptionImage: row.description_image,
      scheduleHeading: row.schedule_heading,
      scheduleIntro: row.schedule_intro,
      scheduleImage: row.schedule_image,
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
      partnerHeroImage: row.partner_hero_image,
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
