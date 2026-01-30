// Admin functionality for event management

// Image upload helper function
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Setup image upload input with preview
function setupImageUpload(inputId, previewId, currentImage) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  // Show current image if exists
  if (currentImage) {
    preview.innerHTML = `<img src="/${currentImage}" alt="Current image"><span class="image-path">${currentImage}</span>`;
    preview.dataset.currentImage = currentImage;
  } else {
    preview.innerHTML = '<span class="no-image">No image selected</span>';
    preview.dataset.currentImage = '';
  }

  input.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview"><span class="image-path">New file: ${file.name}</span>`;
        preview.dataset.newFile = 'true';
      };
      reader.readAsDataURL(file);
    }
  });
}

// Get image value (either upload new or keep existing)
async function getImageValue(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return '';

  // Check if there's a new file to upload
  if (input.files && input.files[0]) {
    try {
      const imageUrl = await uploadImage(input.files[0]);
      return imageUrl;
    } catch (error) {
      alert('Failed to upload image. Using existing image if available.');
      return preview.dataset.currentImage || '';
    }
  }

  // Return existing image path
  return preview.dataset.currentImage || '';
}

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
        <label>Description</label>
        <div id="eventDescriptionEditor" class="quill-editor"></div>
        <input type="hidden" id="eventDescription">
      </div>
      <div class="form-group">
        <label for="descriptionImageUpload">Description Section Image</label>
        <input type="file" id="descriptionImageUpload" accept="image/*" class="image-upload-input">
        <div id="descriptionImagePreview" class="image-preview"></div>
        <small class="form-hint">Image displayed to the right of the event description</small>
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
        <label for="scheduleImageUpload">Schedule Section Image</label>
        <input type="file" id="scheduleImageUpload" accept="image/*" class="image-upload-input">
        <div id="scheduleImagePreview" class="image-preview"></div>
        <small class="form-hint">Image displayed next to the schedule/agenda</small>
      </div>
      <div class="form-group">
        <label>Section Heading</label>
        <div id="scheduleHeadingEditor" class="quill-editor"></div>
        <input type="hidden" id="scheduleHeading">
        <small class="form-hint">The main heading for the schedule section (e.g., "Welcome")</small>
      </div>
      <div class="form-group">
        <label>Agenda Content</label>
        <div id="agendaContentEditor" class="quill-editor"></div>
        <input type="hidden" id="agendaContent">
        <small class="form-hint">Full agenda with timings (e.g., "18:30 – Guest arrivals, drinks...")</small>
      </div>
      <div class="form-group">
        <label>Welcome Message</label>
        <div id="eventWelcomeEditor" class="quill-editor"></div>
        <input type="hidden" id="eventWelcome">
      </div>
      <div class="form-group">
        <label>Signature</label>
        <div id="eventSignatureEditor" class="quill-editor"></div>
        <input type="hidden" id="eventSignature">
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
        <label for="partnerLogoUpload">Partner Logo</label>
        <input type="file" id="partnerLogoUpload" accept="image/*" class="image-upload-input">
        <div id="partnerLogoPreview" class="image-preview"></div>
        <small class="form-hint">Logo will appear in the hero area and Event Partner section</small>
      </div>
      <div class="form-group">
        <label>Partner Description</label>
        <div id="partnerDescriptionEditor" class="quill-editor"></div>
        <input type="hidden" id="partnerDescription">
      </div>
      <div class="form-group">
        <label for="partnerWebsite">Partner Website</label>
        <input type="url" id="partnerWebsite" value="${event?.partnerWebsite || ''}">
      </div>
    </div>

    <div class="form-section">
      <h3>Testimonial</h3>
      <div class="form-group">
        <label>Testimonial Text</label>
        <div id="testimonialTextEditor" class="quill-editor"></div>
        <input type="hidden" id="testimonialText">
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
      <div class="form-group">
        <label for="partnerHeroImageUpload">Partner Section Image</label>
        <input type="file" id="partnerHeroImageUpload" accept="image/*" class="image-upload-input">
        <div id="partnerHeroImagePreview" class="image-preview"></div>
        <small class="form-hint">Large image displayed at the bottom of the Event Partner section</small>
      </div>
    </div>

    <div class="form-section">
      <h3>Event Connect</h3>
      <div class="form-group">
        <label>Intro Text</label>
        <div id="connectIntroEditor" class="quill-editor"></div>
        <input type="hidden" id="connectIntro">
      </div>
      <div class="form-group">
        <label>Instructions</label>
        <div id="connectInstructionsEditor" class="quill-editor"></div>
        <input type="hidden" id="connectInstructions">
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

  // Initialize Quill editors and image uploads after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeEventEditors(event);
    // Setup image uploads
    setupImageUpload('descriptionImageUpload', 'descriptionImagePreview', event ? event.descriptionImage : 'images/event-photo-1.jpg');
    setupImageUpload('partnerLogoUpload', 'partnerLogoPreview', event ? event.partnerLogo : '');
    setupImageUpload('scheduleImageUpload', 'scheduleImagePreview', event ? event.scheduleImage : 'images/networking-photo.jpg');
    setupImageUpload('partnerHeroImageUpload', 'partnerHeroImagePreview', event ? event.partnerHeroImage : 'images/panel-discussion.jpg');
  }, 100);
}

function initializeEventEditors(event) {
  console.log('initializeEventEditors called, Quill defined:', typeof Quill !== 'undefined');

  if (typeof Quill === 'undefined') {
    console.error('Quill is not loaded - falling back to textareas');
    // Fallback: convert editor divs to textareas
    var editorConfigs = [
      { id: 'eventDescriptionEditor', hiddenId: 'eventDescription', content: event ? event.description : '' },
      { id: 'scheduleHeadingEditor', hiddenId: 'scheduleHeading', content: event ? event.scheduleHeading : '' },
      { id: 'agendaContentEditor', hiddenId: 'agendaContent', content: event ? event.agendaContent : '' },
      { id: 'eventWelcomeEditor', hiddenId: 'eventWelcome', content: event ? event.welcomeMessage : '' },
      { id: 'eventSignatureEditor', hiddenId: 'eventSignature', content: event ? event.signature : '' },
      { id: 'partnerDescriptionEditor', hiddenId: 'partnerDescription', content: event ? event.partnerDescription : '' },
      { id: 'testimonialTextEditor', hiddenId: 'testimonialText', content: event ? event.testimonialText : '' },
      { id: 'connectIntroEditor', hiddenId: 'connectIntro', content: event ? event.connectIntro : '' },
      { id: 'connectInstructionsEditor', hiddenId: 'connectInstructions', content: event ? event.connectInstructions : '' }
    ];
    editorConfigs.forEach(function(config) {
      var container = document.getElementById(config.id);
      if (container) {
        var textarea = document.createElement('textarea');
        textarea.id = config.hiddenId;
        textarea.rows = 4;
        textarea.value = config.content || '';
        textarea.className = 'fallback-textarea';
        container.parentNode.replaceChild(textarea, container);
      }
    });
    return;
  }

  var toolbarOptions = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ];

  // Helper function to create editor
  function createEditor(containerId, placeholder, content) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return null;
    }
    console.log('Creating Quill editor for:', containerId);
    try {
      var editor = new Quill(container, {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
        placeholder: placeholder
      });
      if (content) {
        editor.root.innerHTML = content;
      }
      console.log('Quill editor created successfully for:', containerId);
      return editor;
    } catch (err) {
      console.error('Error creating Quill editor:', err);
      return null;
    }
  }

  // Initialize all editors
  window.descriptionEditor = createEditor('eventDescriptionEditor', 'Enter event description...', event ? event.description : '');
  window.scheduleHeadingEditor = createEditor('scheduleHeadingEditor', 'Enter section heading (e.g., Welcome)...', event ? event.scheduleHeading : '');
  window.agendaContentEditor = createEditor('agendaContentEditor', 'Enter agenda with timings...', event ? event.agendaContent : '');
  window.welcomeEditor = createEditor('eventWelcomeEditor', 'Enter welcome message...', event ? event.welcomeMessage : '');
  window.signatureEditor = createEditor('eventSignatureEditor', 'Enter signature...', event ? event.signature : '');
  window.partnerDescEditor = createEditor('partnerDescriptionEditor', 'Enter partner description...', event ? event.partnerDescription : '');
  window.testimonialEditor = createEditor('testimonialTextEditor', 'Enter testimonial...', event ? event.testimonialText : '');
  window.connectIntroEditor = createEditor('connectIntroEditor', 'Enter intro text...', event ? event.connectIntro : '');
  window.connectInstructionsEditor = createEditor('connectInstructionsEditor', 'Enter instructions...', event ? event.connectInstructions : '');
}

async function saveEvent(eventId) {
  // Get content from Quill editors
  const getEditorContent = (editor) => {
    if (!editor) return '';
    const content = editor.root.innerHTML;
    // Return empty string if only contains empty paragraph
    return content === '<p><br></p>' ? '' : content;
  };

  // Handle image uploads
  const descriptionImage = await getImageValue('descriptionImageUpload', 'descriptionImagePreview');
  const partnerLogo = await getImageValue('partnerLogoUpload', 'partnerLogoPreview');
  const scheduleImage = await getImageValue('scheduleImageUpload', 'scheduleImagePreview');
  const partnerHeroImage = await getImageValue('partnerHeroImageUpload', 'partnerHeroImagePreview');

  const data = {
    title: document.getElementById('eventTitle').value,
    subtitle: document.getElementById('eventSubtitle').value,
    eventDate: document.getElementById('eventDate').value || null,
    location: document.getElementById('eventLocation').value,
    description: getEditorContent(window.descriptionEditor),
    descriptionImage: descriptionImage,
    isPublished: document.getElementById('eventPublished').checked,
    scheduleHeading: getEditorContent(window.scheduleHeadingEditor),
    agendaContent: getEditorContent(window.agendaContentEditor),
    scheduleImage: scheduleImage,
    welcomeMessage: getEditorContent(window.welcomeEditor),
    signature: getEditorContent(window.signatureEditor),
    contactName: document.getElementById('contactName').value,
    contactTitle: document.getElementById('contactTitle').value,
    contactEmail: document.getElementById('contactEmail').value,
    contactPhone: document.getElementById('contactPhone').value,
    partnerName: document.getElementById('partnerName').value,
    partnerLogo: partnerLogo,
    partnerDescription: getEditorContent(window.partnerDescEditor),
    partnerWebsite: document.getElementById('partnerWebsite').value,
    testimonialText: getEditorContent(window.testimonialEditor),
    testimonialAuthor: document.getElementById('testimonialAuthor').value,
    testimonialTitle: document.getElementById('testimonialTitle').value,
    testimonialCompany: document.getElementById('testimonialCompany').value,
    partnerHeroImage: partnerHeroImage,
    connectIntro: getEditorContent(window.connectIntroEditor),
    connectInstructions: getEditorContent(window.connectInstructionsEditor)
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
        viewEvent(eventId, true, true); // preserve scroll position
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
      <label>Bio</label>
      <div id="personBioEditor" class="quill-editor"></div>
      <input type="hidden" id="personBio">
    </div>
    <div class="form-group">
      <label for="personImageUpload">Profile Image</label>
      <input type="file" id="personImageUpload" accept="image/*" class="image-upload-input">
      <div id="personImagePreview" class="image-preview"></div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="usePlaceholder" ${!person?.image ? 'checked' : ''}>
          Use placeholder image (no photo available)
        </label>
      </div>
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

  // Initialize after a short delay
  setTimeout(() => {
    // Setup image upload for profile image
    setupImageUpload('personImageUpload', 'personImagePreview', person ? person.image : '');

    // Handle placeholder checkbox
    const placeholderCheckbox = document.getElementById('usePlaceholder');
    const imageUploadGroup = document.getElementById('personImageUpload')?.parentElement;
    const imagePreview = document.getElementById('personImagePreview');

    if (placeholderCheckbox) {
      // Update UI based on initial state
      const updateImageUploadState = () => {
        if (placeholderCheckbox.checked) {
          if (imageUploadGroup) {
            document.getElementById('personImageUpload').disabled = true;
          }
          if (imagePreview) {
            imagePreview.innerHTML = '<span class="no-image">Using placeholder image</span>';
            imagePreview.dataset.currentImage = '';
          }
        } else {
          if (imageUploadGroup) {
            document.getElementById('personImageUpload').disabled = false;
          }
        }
      };

      updateImageUploadState();
      placeholderCheckbox.addEventListener('change', updateImageUploadState);
    }

    // Initialize Quill editor for bio
    if (typeof Quill !== 'undefined') {
      window.personBioEditor = new Quill('#personBioEditor', {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }],
            ['link'],
            ['clean']
          ]
        },
        placeholder: 'Enter bio...'
      });
      if (person?.bio) {
        window.personBioEditor.root.innerHTML = person.bio;
      }
    }
  }, 100);
}

async function savePerson(type, personId) {
  const usePlaceholder = document.getElementById('usePlaceholder')?.checked;

  // Get bio from Quill editor
  const getBioContent = () => {
    if (!window.personBioEditor) return '';
    const content = window.personBioEditor.root.innerHTML;
    return content === '<p><br></p>' ? '' : content;
  };

  // Handle image upload
  let personImage = null;
  if (!usePlaceholder) {
    personImage = await getImageValue('personImageUpload', 'personImagePreview');
  }

  const data = {
    eventId: currentEvent.id,
    name: document.getElementById('personName').value,
    title: document.getElementById('personTitle').value,
    company: document.getElementById('personCompany').value,
    bio: getBioContent(),
    image: personImage,
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
      viewEvent(currentEvent.id, true, true); // preserve scroll position
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
      viewEvent(currentEvent.id, true, true); // preserve scroll position
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
      <label>Description *</label>
      <div id="scheduleDescEditor" class="quill-editor"></div>
      <input type="hidden" id="scheduleDesc">
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

  // Initialize Quill editor for schedule description
  if (typeof Quill !== 'undefined') {
    window.scheduleDescEditor = new Quill('#scheduleDescEditor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }],
          ['link'],
          ['clean']
        ]
      },
      placeholder: 'Enter description...'
    });
    if (item?.description) {
      window.scheduleDescEditor.root.innerHTML = item.description;
    }
  }
}

async function saveScheduleItem(itemId) {
  // Get description from Quill editor
  const getDescContent = () => {
    if (!window.scheduleDescEditor) return '';
    const content = window.scheduleDescEditor.root.innerHTML;
    return content === '<p><br></p>' ? '' : content;
  };

  const data = {
    eventId: currentEvent.id,
    time: document.getElementById('scheduleTime').value,
    description: getDescContent(),
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
      viewEvent(currentEvent.id, true, true); // preserve scroll position
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
      viewEvent(currentEvent.id, true, true); // preserve scroll position
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
