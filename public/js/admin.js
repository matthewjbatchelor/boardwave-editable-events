// Admin functionality for event management

function enableAdminFeatures() {
  const addEventBtn = document.getElementById('addEventBtn');
  if (addEventBtn) {
    addEventBtn.style.display = 'block';
    addEventBtn.addEventListener('click', () => showEventForm(null));
  }

  addEventCardAdminButtons();
  if (currentEvent) {
    addEventViewAdminButtons();
  }
}

function disableAdminFeatures() {
  const addEventBtn = document.getElementById('addEventBtn');
  if (addEventBtn) addEventBtn.style.display = 'none';

  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.btn-edit').forEach(el => el.remove());
}

function addEventCardAdminButtons() {
  document.querySelectorAll('.event-card').forEach(card => {
    const actions = card.querySelector('.event-card-actions');
    if (actions && actions.innerHTML === '') {
      const eventId = card.dataset.eventId;
      actions.style.display = 'flex';
      actions.innerHTML = `
        <button class="btn-edit" data-action="edit">Edit</button>
        <button class="btn-secondary" data-action="duplicate">Duplicate</button>
        <button class="btn-delete" data-action="delete">Delete</button>
      `;

      // Add event listeners
      actions.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation();
        showEventForm(eventId);
      });
      actions.querySelector('[data-action="duplicate"]').addEventListener('click', (e) => {
        e.stopPropagation();
        duplicateEvent(eventId);
      });
      actions.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEvent(eventId);
      });
    }
  });
}

function addEventViewAdminButtons() {
  if (!currentEvent) return;

  // Add edit button to hero
  const hero = document.querySelector('.hero');
  if (hero && !hero.querySelector('.btn-edit')) {
    const btn = document.createElement('button');
    btn.className = 'btn-edit hero-edit-btn';
    btn.textContent = 'Edit Event';
    btn.onclick = () => showEventForm(currentEvent.id);
    hero.appendChild(btn);
  }

  // Add edit buttons to hosts
  document.querySelectorAll('#host .profile-card').forEach(card => {
    if (!card.querySelector('.btn-edit')) {
      const btn = document.createElement('button');
      btn.className = 'btn-edit';
      btn.textContent = 'Edit';
      btn.onclick = () => showPersonForm('host', card.dataset.id);
      card.appendChild(btn);
    }
  });

  // Add edit buttons to speakers
  document.querySelectorAll('#speakers .profile-card').forEach(card => {
    if (!card.querySelector('.btn-edit')) {
      const btn = document.createElement('button');
      btn.className = 'btn-edit';
      btn.textContent = 'Edit';
      btn.onclick = () => showPersonForm('speaker', card.dataset.id);
      card.appendChild(btn);
    }
  });

  // Add edit buttons to guests
  document.querySelectorAll('.guest-card').forEach(card => {
    if (!card.querySelector('.btn-edit')) {
      const btn = document.createElement('button');
      btn.className = 'btn-edit';
      btn.textContent = 'Edit';
      btn.onclick = () => showPersonForm('guest', card.dataset.id);
      card.appendChild(btn);
    }
  });

  // Add "Add" buttons to sections
  addSectionAddButtons();
}

function addSectionAddButtons() {
  const sections = [
    { id: 'host', type: 'host', label: 'Add Host' },
    { id: 'speakers', type: 'speaker', label: 'Add Speaker' },
    { id: 'guests', type: 'guest', label: 'Add Guest' },
    { id: 'schedule', type: 'schedule', label: 'Add Schedule Item' }
  ];

  sections.forEach(({ id, type, label }) => {
    const section = document.getElementById(id);
    if (section) {
      const header = section.querySelector('.section-header');
      if (header && !header.querySelector('.btn-edit')) {
        const btn = document.createElement('button');
        btn.className = 'btn-edit';
        btn.textContent = label;
        btn.onclick = () => type === 'schedule' ? showScheduleForm(null) : showPersonForm(type, null);
        header.appendChild(btn);
      }
    }
  });
}

// Event Form
async function showEventForm(eventId) {
  const modal = document.getElementById('editModal');
  const title = document.getElementById('editModalTitle');
  const fields = document.getElementById('editFormFields');
  const form = document.getElementById('editForm');
  const deleteBtn = modal.querySelector('.btn-delete');

  let event = null;
  if (eventId) {
    try {
      const response = await fetch(`/api/events/${eventId}`, { credentials: 'include' });
      event = await response.json();
    } catch (error) {
      console.error('Error loading event:', error);
      return;
    }
  }

  title.textContent = event ? 'Edit Event' : 'Create New Event';
  deleteBtn.style.display = event ? 'block' : 'none';

  fields.innerHTML = `
    <div class="form-section">
      <h3>Basic Information</h3>
      <div class="form-group">
        <label for="eventTitle">Event Title *</label>
        <input type="text" id="eventTitle" required value="${event?.title || ''}">
      </div>
      <div class="form-group">
        <label for="eventSubtitle">Subtitle</label>
        <input type="text" id="eventSubtitle" value="${event?.subtitle || ''}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="eventDate">Date</label>
          <input type="date" id="eventDate" value="${event?.eventDate ? event.eventDate.split('T')[0] : ''}">
        </div>
        <div class="form-group">
          <label for="eventLocation">Location</label>
          <input type="text" id="eventLocation" value="${event?.location || ''}">
        </div>
      </div>
      <div class="form-group">
        <label for="eventDescription">Description (HTML)</label>
        <textarea id="eventDescription" rows="6">${event?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="eventPublished" ${event?.isPublished ? 'checked' : ''}>
          Published
        </label>
      </div>
    </div>

    <div class="form-section">
      <h3>Schedule Section</h3>
      <div class="form-group">
        <label for="eventWelcome">Welcome Message</label>
        <textarea id="eventWelcome" rows="3">${event?.welcomeMessage || ''}</textarea>
      </div>
      <div class="form-group">
        <label for="eventSignature">Signature</label>
        <input type="text" id="eventSignature" value="${event?.signature || ''}">
      </div>
    </div>

    <div class="form-section">
      <h3>Contact Information</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="contactName">Contact Name</label>
          <input type="text" id="contactName" value="${event?.contactName || ''}">
        </div>
        <div class="form-group">
          <label for="contactTitle">Contact Title</label>
          <input type="text" id="contactTitle" value="${event?.contactTitle || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="contactEmail">Email</label>
          <input type="email" id="contactEmail" value="${event?.contactEmail || ''}">
        </div>
        <div class="form-group">
          <label for="contactPhone">Phone</label>
          <input type="text" id="contactPhone" value="${event?.contactPhone || ''}">
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Event Partner</h3>
      <div class="form-group">
        <label for="partnerName">Partner Name</label>
        <input type="text" id="partnerName" value="${event?.partnerName || ''}">
      </div>
      <div class="form-group">
        <label for="partnerDescription">Partner Description (HTML)</label>
        <textarea id="partnerDescription" rows="4">${event?.partnerDescription || ''}</textarea>
      </div>
      <div class="form-group">
        <label for="partnerWebsite">Partner Website</label>
        <input type="url" id="partnerWebsite" value="${event?.partnerWebsite || ''}">
      </div>
    </div>

    <div class="form-section">
      <h3>Testimonial</h3>
      <div class="form-group">
        <label for="testimonialText">Testimonial Text</label>
        <textarea id="testimonialText" rows="4">${event?.testimonialText || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="testimonialAuthor">Author</label>
          <input type="text" id="testimonialAuthor" value="${event?.testimonialAuthor || ''}">
        </div>
        <div class="form-group">
          <label for="testimonialTitle">Author Title</label>
          <input type="text" id="testimonialTitle" value="${event?.testimonialTitle || ''}">
        </div>
      </div>
      <div class="form-group">
        <label for="testimonialCompany">Author Company</label>
        <input type="text" id="testimonialCompany" value="${event?.testimonialCompany || ''}">
      </div>
    </div>

    <div class="form-section">
      <h3>Event Connect</h3>
      <div class="form-group">
        <label for="connectIntro">Intro Text</label>
        <textarea id="connectIntro" rows="2">${event?.connectIntro || ''}</textarea>
      </div>
      <div class="form-group">
        <label for="connectInstructions">Instructions</label>
        <textarea id="connectInstructions" rows="2">${event?.connectInstructions || ''}</textarea>
      </div>
    </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    await saveEvent(event?.id);
  };

  if (deleteBtn) {
    deleteBtn.onclick = () => deleteEvent(event?.id);
  }

  modal.classList.add('active');
  setupModalClose(modal);
}

async function saveEvent(eventId) {
  const data = {
    title: document.getElementById('eventTitle').value,
    subtitle: document.getElementById('eventSubtitle').value,
    eventDate: document.getElementById('eventDate').value || null,
    location: document.getElementById('eventLocation').value,
    description: document.getElementById('eventDescription').value,
    isPublished: document.getElementById('eventPublished').checked,
    welcomeMessage: document.getElementById('eventWelcome').value,
    signature: document.getElementById('eventSignature').value,
    contactName: document.getElementById('contactName').value,
    contactTitle: document.getElementById('contactTitle').value,
    contactEmail: document.getElementById('contactEmail').value,
    contactPhone: document.getElementById('contactPhone').value,
    partnerName: document.getElementById('partnerName').value,
    partnerDescription: document.getElementById('partnerDescription').value,
    partnerWebsite: document.getElementById('partnerWebsite').value,
    testimonialText: document.getElementById('testimonialText').value,
    testimonialAuthor: document.getElementById('testimonialAuthor').value,
    testimonialTitle: document.getElementById('testimonialTitle').value,
    testimonialCompany: document.getElementById('testimonialCompany').value,
    connectIntro: document.getElementById('connectIntro').value,
    connectInstructions: document.getElementById('connectInstructions').value
  };

  try {
    const url = eventId ? `/api/events/${eventId}` : '/api/events';
    const method = eventId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (response.ok) {
      closeModal();
      if (currentEvent && eventId === currentEvent.id) {
        viewEvent(eventId);
      } else {
        loadEvents();
      }
    } else {
      const error = await response.json();
      alert('Failed to save: ' + (error.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error saving event:', error);
    alert('Failed to save event');
  }
}

async function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event? This will also delete all associated hosts, speakers, guests, and schedule items.')) {
    return;
  }

  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      closeModal();
      showEventsList();
    } else {
      alert('Failed to delete event');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete event');
  }
}

async function duplicateEvent(eventId) {
  if (!confirm('Create a copy of this event?')) return;

  try {
    const response = await fetch(`/api/events/${eventId}/duplicate`, {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      loadEvents();
    } else {
      alert('Failed to duplicate event');
    }
  } catch (error) {
    console.error('Error duplicating event:', error);
    alert('Failed to duplicate event');
  }
}

// Person Form (Host, Speaker, Guest)
async function showPersonForm(type, personId) {
  const modal = document.getElementById('editModal');
  const title = document.getElementById('editModalTitle');
  const fields = document.getElementById('editFormFields');
  const form = document.getElementById('editForm');
  const deleteBtn = modal.querySelector('.btn-delete');

  const typeLabels = { host: 'Host', speaker: 'Speaker', guest: 'Guest' };
  let person = null;

  if (personId) {
    try {
      const response = await fetch(`/api/${type}s/${personId}`, { credentials: 'include' });
      person = await response.json();
    } catch (error) {
      console.error('Error loading person:', error);
      return;
    }
  }

  title.textContent = person ? `Edit ${typeLabels[type]}` : `Add ${typeLabels[type]}`;
  deleteBtn.style.display = person ? 'block' : 'none';

  fields.innerHTML = `
    <div class="form-group">
      <label for="personName">Name *</label>
      <input type="text" id="personName" required value="${person?.name || ''}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="personTitle">Title</label>
        <input type="text" id="personTitle" value="${person?.title || ''}">
      </div>
      <div class="form-group">
        <label for="personCompany">Company</label>
        <input type="text" id="personCompany" value="${person?.company || ''}">
      </div>
    </div>
    <div class="form-group">
      <label for="personBio">Bio</label>
      <textarea id="personBio" rows="4">${person?.bio || ''}</textarea>
    </div>
    <div class="form-group">
      <label for="personImage">Image Path</label>
      <input type="text" id="personImage" value="${person?.image || ''}" placeholder="images/guests/name.jpg">
    </div>
    ${type === 'guest' ? `
    <div class="form-group">
      <label for="personBadge">Badge</label>
      <select id="personBadge">
        <option value="">None</option>
        <option value="PARTNER" ${person?.badge === 'PARTNER' ? 'selected' : ''}>PARTNER</option>
        <option value="PATRON" ${person?.badge === 'PATRON' ? 'selected' : ''}>PATRON</option>
      </select>
    </div>
    ` : ''}
    <div class="form-group">
      <label for="personSort">Sort Order</label>
      <input type="number" id="personSort" value="${person?.sortOrder || 0}">
    </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    await savePerson(type, person?.id);
  };

  if (deleteBtn) {
    deleteBtn.onclick = () => deletePerson(type, person?.id);
  }

  modal.classList.add('active');
  setupModalClose(modal);
}

async function savePerson(type, personId) {
  const data = {
    eventId: currentEvent.id,
    name: document.getElementById('personName').value,
    title: document.getElementById('personTitle').value,
    company: document.getElementById('personCompany').value,
    bio: document.getElementById('personBio').value,
    image: document.getElementById('personImage').value,
    sortOrder: parseInt(document.getElementById('personSort').value) || 0
  };

  if (type === 'guest') {
    data.badge = document.getElementById('personBadge').value || null;
  }

  try {
    const url = personId ? `/api/${type}s/${personId}` : `/api/${type}s`;
    const method = personId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (response.ok) {
      closeModal();
      viewEvent(currentEvent.id);
    } else {
      const error = await response.json();
      alert('Failed to save: ' + (error.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error saving person:', error);
    alert('Failed to save');
  }
}

async function deletePerson(type, personId) {
  if (!confirm('Are you sure you want to delete this?')) return;

  try {
    const response = await fetch(`/api/${type}s/${personId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      closeModal();
      viewEvent(currentEvent.id);
    } else {
      alert('Failed to delete');
    }
  } catch (error) {
    console.error('Error deleting:', error);
    alert('Failed to delete');
  }
}

// Schedule Form
async function showScheduleForm(itemId) {
  const modal = document.getElementById('editModal');
  const title = document.getElementById('editModalTitle');
  const fields = document.getElementById('editFormFields');
  const form = document.getElementById('editForm');
  const deleteBtn = modal.querySelector('.btn-delete');

  let item = null;
  if (itemId) {
    try {
      const response = await fetch(`/api/schedule/${itemId}`, { credentials: 'include' });
      item = await response.json();
    } catch (error) {
      console.error('Error loading schedule item:', error);
      return;
    }
  }

  title.textContent = item ? 'Edit Schedule Item' : 'Add Schedule Item';
  deleteBtn.style.display = item ? 'block' : 'none';

  fields.innerHTML = `
    <div class="form-group">
      <label for="scheduleTime">Time *</label>
      <input type="text" id="scheduleTime" required value="${item?.time || ''}" placeholder="18:30">
    </div>
    <div class="form-group">
      <label for="scheduleDesc">Description *</label>
      <textarea id="scheduleDesc" rows="3" required>${item?.description || ''}</textarea>
    </div>
    <div class="form-group">
      <label for="scheduleSort">Sort Order</label>
      <input type="number" id="scheduleSort" value="${item?.sortOrder || 0}">
    </div>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    await saveScheduleItem(item?.id);
  };

  if (deleteBtn) {
    deleteBtn.onclick = () => deleteScheduleItem(item?.id);
  }

  modal.classList.add('active');
  setupModalClose(modal);
}

async function saveScheduleItem(itemId) {
  const data = {
    eventId: currentEvent.id,
    time: document.getElementById('scheduleTime').value,
    description: document.getElementById('scheduleDesc').value,
    sortOrder: parseInt(document.getElementById('scheduleSort').value) || 0
  };

  try {
    const url = itemId ? `/api/schedule/${itemId}` : '/api/schedule';
    const method = itemId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (response.ok) {
      closeModal();
      viewEvent(currentEvent.id);
    } else {
      const error = await response.json();
      alert('Failed to save: ' + (error.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error saving schedule item:', error);
    alert('Failed to save');
  }
}

async function deleteScheduleItem(itemId) {
  if (!confirm('Are you sure you want to delete this schedule item?')) return;

  try {
    const response = await fetch(`/api/schedule/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      closeModal();
      viewEvent(currentEvent.id);
    } else {
      alert('Failed to delete');
    }
  } catch (error) {
    console.error('Error deleting:', error);
    alert('Failed to delete');
  }
}

// Modal helpers
function closeModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.classList.remove('active');
}

function setupModalClose(modal) {
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.btn-cancel');

  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}
