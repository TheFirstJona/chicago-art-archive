// Base API URL for Art Institute of Chicago
const ARTIC_BASE_URL = 'https://api.artic.edu/api/v1';

// DOM Elements
const artworksGrid = document.getElementById('artworks-grid');
const statusMessage = document.getElementById('status-message');

// Fetch artworks from ARTIC API and render them to the DOM 
async function fetchArtworks() {
  try {
    showStatus('Loading artworks from the Chicago Art Archive...', 'loading');

    // Request artworks specifying key fields to keep payloads light
    const endpoint = `${ARTIC_BASE_URL}/artworks?fields=id,title,artist_display,date_display,medium_display,image_id&limit=12`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }

    const data = await response.json();
    hideStatus();
    renderArtworks(data.data);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    showStatus('Failed to load artworks. Please try again.', 'error');
  }
}

// Build and inject HTML card elements for each artwork
function renderArtworks(artworks) {
  artworksGrid.innerHTML = '';

  if (!artworks || artworks.length === 0) {
    showStatus('No artworks found.', 'info');
    return;
  }

  artworks.forEach(art => {
    const card = document.createElement('article');
    card.className = 'card';

    // Construct high-res image URL using ARTIC IIIF endpoint if image_id exists
    let imageHtml = '<div class="card-image-wrap"><span class="card-image-placeholder">No image available</span></div>';
    if (art.image_id) {
      const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/600,/0/default.jpg`;
      imageHtml = `
        <div class="card-image-wrap">
          <img src="${imageUrl}" alt="${art.title || 'Artwork image'}" loading="lazy" />
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHtml}
      <div class="card-body">
        <h3 class="card-title">${art.title || 'Untitled'}</h3>
        <p class="card-meta"><strong>Artist:</strong> ${art.artist_display || 'Unknown Artist'}</p>
        <p class="card-meta"><strong>Date:</strong> ${art.date_display || 'Undated'}</p>
        <p class="card-meta"><strong>Medium:</strong> ${art.medium_display || 'Not specified'}</p>
      </div>
    `;

    artworksGrid.appendChild(card);
  });
}

// Display user-facing status / error banners
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function hideStatus() {
  statusMessage.className = 'status-message hidden';
}

// Initial load
fetchArtworks();