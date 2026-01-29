// Events Management

let currentEvent = null;

// URL Routing
function getEventSlugFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/^\/event\/(.+)$/);
  return match ? match[1] : null;
}

function updateUrl(eventSlug) {
  if (eventSlug) {
    history.pushState({ eventSlug }, '', `/event/${eventSlug}`);
  } else {
    history.pushState({}, '', '/');
  }
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.eventSlug) {
    viewEventBySlug(e.state.eventSlug, false);
  } else {
    showEventsList(false);
  }
});

async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading">Loading events</div>';

  try {
    const response = await fetch('/api/events', { credentials: 'include' });
    const events = await response.json();

    if (events.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>No events yet.</p>
          ${window.isAdmin ? '<p>Click "Add New Event" to create your first event.</p>' : ''}
        </div>
      `;
      return;
    }

    grid.innerHTML = events.map(event => createEventCard(event)).join('');

    // Add click handlers
    grid.querySelectorAll('.event-card').forEach(card => {
      const eventId = card.dataset.eventId;
      card.querySelector('.event-card-image').addEventListener('click', () => viewEvent(eventId));
      card.querySelector('h3').addEventListener('click', () => viewEvent(eventId));
    });

    if (window.isAdmin) {
      addEventCardAdminButtons();
    }
  } catch (error) {
    console.error('Error loading events:', error);
    grid.innerHTML = '<div class="error-text">Failed to load events</div>';
  }
}

function createEventCard(event) {
  const date = event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : 'Date TBC';

  return `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-card-image" style="${event.heroImage ? `background-image: url('/${event.heroImage}')` : ''}">
        ${!event.isPublished ? '<span class="event-card-badge draft">Draft</span>' : ''}
      </div>
      <div class="event-card-content">
        <h3>${event.title}</h3>
        <div class="event-card-date">${date}</div>
        <div class="event-card-location">${event.location || ''}</div>
        <div class="event-card-actions admin-only" style="display:none;"></div>
      </div>
    </div>
  `;
}

async function viewEvent(eventId, updateHistory = true) {
  try {
    const response = await fetch(`/api/events/${eventId}`, { credentials: 'include' });
    currentEvent = await response.json();

    renderEventView(currentEvent);

    document.getElementById('eventsListView').style.display = 'none';
    document.getElementById('eventView').style.display = 'block';

    window.scrollTo(0, 0);

    // Update URL with event slug
    if (updateHistory && currentEvent.slug) {
      updateUrl(currentEvent.slug);
    }

    // Update page title
    document.title = `${currentEvent.title} | Boardwave Events`;

    // Add back button event listener
    const backBtn = document.getElementById('backToEventsBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => showEventsList(true));
    }

    // Add edit event button event listener
    const editBtn = document.getElementById('editEventBtn');
    if (editBtn) {
      const eventIdToEdit = editBtn.dataset.eventId;
      editBtn.addEventListener('click', () => showEventForm(eventIdToEdit));
    }

    if (window.isAdmin) {
      addEventViewAdminButtons();
    }
  } catch (error) {
    console.error('Error loading event:', error);
    alert('Failed to load event');
  }
}

async function viewEventBySlug(slug, updateHistory = true) {
  try {
    const response = await fetch(`/api/events/${slug}`, { credentials: 'include' });
    if (!response.ok) {
      // Event not found, show events list
      showEventsList(true);
      return;
    }
    currentEvent = await response.json();

    renderEventView(currentEvent);

    document.getElementById('eventsListView').style.display = 'none';
    document.getElementById('eventView').style.display = 'block';

    window.scrollTo(0, 0);

    // Update URL with event slug
    if (updateHistory && currentEvent.slug) {
      updateUrl(currentEvent.slug);
    }

    // Update page title
    document.title = `${currentEvent.title} | Boardwave Events`;

    // Add back button event listener
    const backBtn = document.getElementById('backToEventsBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => showEventsList(true));
    }

    // Add edit event button event listener
    const editBtn = document.getElementById('editEventBtn');
    if (editBtn) {
      const eventIdToEdit = editBtn.dataset.eventId;
      editBtn.addEventListener('click', () => showEventForm(eventIdToEdit));
    }

    if (window.isAdmin) {
      addEventViewAdminButtons();
    }
  } catch (error) {
    console.error('Error loading event:', error);
    showEventsList(true);
  }
}

function renderEventView(event) {
  const view = document.getElementById('eventView');

  view.innerHTML = `
    ${window.isAdmin ? '<button class="back-button" id="backToEventsBtn">← Back to Events</button>' : ''}
    ${window.isAdmin ? `<button class="edit-event-button" id="editEventBtn" data-event-id="${event.id}">Edit Event</button>` : ''}

    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1>${event.title}</h1>
        ${event.subtitle ? `<p class="hero-details">${event.subtitle}</p>` : ''}
        ${event.partnerLogo ? `<div class="hero-partner"><span>In partnership with</span>${event.partnerWebsite ? `<a href="${event.partnerWebsite}" target="_blank" rel="noopener noreferrer">` : ''}<img src="/${event.partnerLogo}" alt="${event.partnerName || 'Event Partner'}">${event.partnerWebsite ? '</a>' : ''}</div>` : ''}
      </div>
    </section>

    <!-- Event Description -->
    <section id="event-description" class="section event-description">
      <div class="container">
        <div class="content-text">
          ${event.description || '<p>Event description coming soon...</p>'}
        </div>
      </div>
    </section>

    <!-- Schedule -->
    ${event.schedule && event.schedule.length > 0 ? `
    <section id="schedule" class="section schedule">
      <div class="container">
        <div class="schedule-grid">
          <div class="schedule-image">
            <img src="/images/networking-photo.jpg" alt="Networking">
          </div>
          <div class="schedule-content">
            ${event.scheduleHeading ? `<div class="schedule-heading">${event.scheduleHeading}</div>` : '<h2>Welcome</h2>'}
            ${event.welcomeMessage ? `<p class="welcome-text">${event.welcomeMessage}</p>` : ''}
            ${event.scheduleIntro ? `<div class="schedule-intro">${event.scheduleIntro}</div>` : '<h3>Timings for the evening will be as follows:</h3>'}
            <div class="timeline">
              ${event.schedule.map(item => `
                <div class="timeline-item" data-id="${item.id}">
                  <div class="time">${item.time}</div>
                  <div class="description">${item.description}</div>
                </div>
              `).join('')}
            </div>
            ${event.signature ? `<div class="signature">${event.signature}</div>` : ''}
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Host -->
    ${event.hosts && event.hosts.length > 0 ? `
    <section id="host" class="section host">
      <div class="container">
        <h2>Introducing</h2>
        <div class="section-header">HOST</div>
        ${event.hosts.map(host => `
          <div class="profile-card" data-id="${host.id}">
            <div class="profile-image">
              <img src="${host.image ? '/' + host.image : '/images/placeholder-profile.svg'}" alt="${host.name}">
            </div>
            <div class="profile-content">
              <h3>${host.name}</h3>
              <p class="profile-title">${host.title || ''}<br>${host.company || ''}</p>
              <p class="profile-bio">${host.bio || ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Speakers -->
    ${event.speakers && event.speakers.length > 0 ? `
    <section id="speakers" class="section speakers">
      <div class="container">
        <div class="section-header">SPEAKERS</div>
        <div class="speakers-grid">
          ${event.speakers.map(speaker => `
            <div class="profile-card" data-id="${speaker.id}">
              <div class="profile-image">
                <img src="${speaker.image ? '/' + speaker.image : '/images/placeholder-profile.svg'}" alt="${speaker.name}">
              </div>
              <div class="profile-content">
                <h3>${speaker.name}</h3>
                <p class="profile-title">${speaker.title || ''}<br>${speaker.company || ''}</p>
                <p class="profile-bio">${speaker.bio || ''}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Guests -->
    ${event.guests && event.guests.length > 0 ? `
    <section id="guests" class="section guests">
      <div class="container">
        <div class="section-header">GUESTS</div>
        <div class="guests-scroll-hint">
          <span>Scroll to see all ${event.guests.length} guests →</span>
          <div class="scroll-arrows">
            <button class="scroll-arrow" id="guestsScrollLeft" aria-label="Scroll left">←</button>
            <button class="scroll-arrow" id="guestsScrollRight" aria-label="Scroll right">→</button>
          </div>
        </div>
        <div class="guests-scroll-container">
          <div class="guests-grid" id="guestsGrid">
            ${event.guests.map(guest => `
              <div class="guest-card" data-id="${guest.id}">
                ${guest.badge ? `<div class="guest-badge">${guest.badge}</div>` : ''}
                <div class="profile-image">
                  <img src="${guest.image ? '/' + guest.image : '/images/placeholder-profile.svg'}" alt="${guest.name}" onerror="this.src='/images/placeholder-profile.svg'">
                </div>
                <h3>${guest.name}</h3>
                <p class="profile-title">${guest.title || ''}<br>${guest.company || ''}</p>
                ${guest.bio ? `<p class="profile-bio">${guest.bio}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Event Connect -->
    ${event.connectIntro || event.connectInstructions ? `
    <section id="event-connect" class="section event-connect">
      <div class="container">
        <h2>Event Connect</h2>
        <div class="connect-grid">
          <div class="connect-content">
            ${event.connectIntro ? `<p class="connect-intro">${event.connectIntro}</p>` : ''}
            ${event.connectInstructions ? `<p class="connect-instructions">${event.connectInstructions}</p>` : ''}
          </div>
          <div class="connect-image">
            <img src="/images/event-connect-platform.jpg" alt="Event Connect Platform">
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Event Partner -->
    ${event.partnerName ? `
    <section id="event-partner" class="section event-partner">
      <div class="container">
        <h2>Introducing our Event Partner</h2>
        ${event.partnerLogo ? `<div class="partner-logo"><img src="/${event.partnerLogo}" alt="${event.partnerName}"></div>` : ''}
        <div class="partner-content">
          ${event.partnerDescription || ''}
        </div>
        ${event.partnerWebsite ? `<p class="partner-link"><a href="${event.partnerWebsite}" target="_blank">${event.partnerWebsite.replace(/^https?:\/\//, '')}</a></p>` : ''}

        ${event.testimonialText ? `
        <div class="testimonial">
          <blockquote>
            <p>${event.testimonialText}</p>
            ${event.testimonialAuthor ? `
            <footer>
              <strong>${event.testimonialAuthor}</strong><br>
              ${event.testimonialTitle || ''}<br>
              ${event.testimonialCompany || ''}
            </footer>
            ` : ''}
          </blockquote>
        </div>
        ` : ''}

        <div class="partner-hero-image">
          <img src="/images/panel-discussion.jpg" alt="Event">
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Contact -->
    ${event.contactName || event.contactEmail ? `
    <section id="contact" class="section contact">
      <div class="container">
        <div class="contact-content">
          <img src="/images/blackboardwave.png" alt="Boardwave" class="contact-logo">
          <h2>Contact us:</h2>
          <div class="contact-details">
            ${event.contactName ? `<p><strong>${event.contactName}</strong></p>` : ''}
            ${event.contactTitle ? `<p>${event.contactTitle}</p>` : ''}
            ${event.contactEmail ? `<p><a href="mailto:${event.contactEmail}">${event.contactEmail}</a></p>` : ''}
            ${event.contactPhone ? `<p><a href="tel:${event.contactPhone}">${event.contactPhone}</a></p>` : ''}
          </div>
        </div>
      </div>
    </section>
    ` : ''}
  `;

  // Update navigation
  updateEventNavigation(event);

  // Setup guests scroll arrows
  setupGuestsScroll();
}

function setupGuestsScroll() {
  const grid = document.getElementById('guestsGrid');
  const leftBtn = document.getElementById('guestsScrollLeft');
  const rightBtn = document.getElementById('guestsScrollRight');

  if (!grid || !leftBtn || !rightBtn) return;

  const scrollAmount = 300;

  leftBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Update button states on scroll
  const updateButtons = () => {
    leftBtn.disabled = grid.scrollLeft <= 0;
    const canScrollRight = grid.scrollWidth > grid.clientWidth &&
                           grid.scrollLeft < grid.scrollWidth - grid.clientWidth - 5;
    rightBtn.disabled = !canScrollRight;
  };

  grid.addEventListener('scroll', updateButtons);

  // Delay initial update to ensure DOM is fully rendered
  setTimeout(updateButtons, 100);
}

function updateEventNavigation(event) {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  const sections = ['home', 'event-description'];
  if (event.schedule?.length) sections.push('schedule');
  if (event.hosts?.length) sections.push('host');
  if (event.speakers?.length) sections.push('speakers');
  if (event.guests?.length) sections.push('guests');
  if (event.connectIntro) sections.push('event-connect');
  if (event.partnerName) sections.push('event-partner');
  if (event.contactName || event.contactEmail) sections.push('contact');

  const labels = {
    'home': 'Home',
    'event-description': 'Event',
    'schedule': 'Schedule',
    'host': 'Host',
    'speakers': 'Speakers',
    'guests': 'Guests',
    'event-connect': 'Connect',
    'event-partner': 'Partner',
    'contact': 'Contact'
  };

  navMenu.innerHTML = sections.map(id =>
    `<li><a href="#${id}">${labels[id]}</a></li>`
  ).join('');
}

function showEventsList(updateHistory = true) {
  currentEvent = null;
  document.getElementById('eventsListView').style.display = 'block';
  document.getElementById('eventView').style.display = 'none';

  // Update URL to home
  if (updateHistory) {
    updateUrl(null);
  }

  // Update page title
  document.title = 'Boardwave Events';

  // Reset navigation
  document.getElementById('navMenu').innerHTML = '';

  loadEvents();
}

// Initialize - check URL for direct event access
document.addEventListener('siteAccessGranted', initializeApp);

async function initializeApp() {
  const eventSlug = getEventSlugFromUrl();

  if (eventSlug) {
    // Direct link to event - publicly accessible
    viewEventBySlug(eventSlug, false);
  } else {
    // No event slug - check if admin
    await checkAuthAndShowContent();
  }
}

async function checkAuthAndShowContent() {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'include' });
    const data = await response.json();

    if (data.isAuthenticated && data.user?.role === 'admin') {
      // Admin can see events list
      window.isAdmin = true;
      loadEvents();
    } else {
      // Not admin - show message that direct link is required
      showNoAccessMessage();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    showNoAccessMessage();
  }
}

function showNoAccessMessage() {
  const grid = document.getElementById('eventsGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="no-access-message">
        <h2>Welcome to Boardwave Events</h2>
        <p>To view an event, please use a direct event link.</p>
        <p>If you're an administrator, please <a href="#" id="loginLink">log in</a> to manage events.</p>
      </div>
    `;

    // Add login link handler
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginModal').classList.add('active');
      });
    }
  }
}
