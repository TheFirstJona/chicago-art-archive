// Base API URL for Art Institute of Chicago
const ARTIC_BASE_URL = 'https://api.artic.edu/api/v1';

// State management
let currentView = 'artworks';
let isSearchActive = false;

// DOM Elements
const artworksGrid = document.getElementById('artworks-grid');
const statusMessage = document.getElementById('status-message');
const artworksView = document.getElementById('artworks-view');
const exhibitionsView = document.getElementById('exhibitions-view');
const exhibitionsGrid = document.getElementById('exhibitions-grid');
const navArtworksBtn = document.getElementById('nav-artworks');
const navExhibitionsBtn = document.getElementById('nav-exhibitions');

// Search Form DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const btnClear = document.getElementById('btn-clear');

// Switch views and fetch corresponding data
function switchView(targetView) {
  if (currentView === targetView) return;

  currentView = targetView;

  if (targetView === 'artworks') {
    navArtworksBtn.classList.add('active');
    navExhibitionsBtn.classList.remove('active');
    artworksView.classList.remove('hidden');
    exhibitionsView.classList.add('hidden');
    fetchArtworks();
  } else if (targetView === 'exhibitions') {
    navExhibitionsBtn.classList.add('active');
    navArtworksBtn.classList.remove('active');
    exhibitionsView.classList.remove('hidden');
    artworksView.classList.add('hidden');
    fetchExhibitions();
  }
}

// Fetch artworks from ARTIC API and render them to the DOM (Endpoint 1)
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

// Search artworks by keyword
async function searchArtworks(query) {
  try {
    showStatus(`Searching archive for "${query}"...`, 'loading');

    // Switch to artworks view automatically if user searches while on exhibitions tab
    if (currentView !== 'artworks') {
      currentView = 'artworks';
      navArtworksBtn.classList.add('active');
      navExhibitionsBtn.classList.remove('active');
      artworksView.classList.remove('hidden');
      exhibitionsView.classList.add('hidden');
    }

    const endpoint = `${ARTIC_BASE_URL}/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_display,date_display,medium_display,image_id&limit=12`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Search request error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      artworksGrid.innerHTML = '';
      showStatus(`No artworks found matching "${query}". Try another search term.`, 'info');
      return;
    }

    hideStatus();
    renderArtworks(data.data);
  } catch (error) {
    console.error('Error executing search:', error);
    showStatus('An error occurred while searching. Please try again.', 'error');
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

// Fetch exhibitions from ARTIC API (Endpoint 2)
async function fetchExhibitions() {
  try {
    showStatus('Loading exhibitions...', 'loading');

    const endpoint = `${ARTIC_BASE_URL}/exhibitions?fields=id,title,short_description,image_url,aic_start_at,aic_end_at,status&limit=12`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }

    const data = await response.json();
    hideStatus();
    renderExhibitions(data.data);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    showStatus('Failed to load exhibitions. Please check your connection and try again.', 'error');
  }
}

// Render exhibition cards to the DOM
function renderExhibitions(exhibitions) {
  exhibitionsGrid.innerHTML = '';

  if (!exhibitions || exhibitions.length === 0) {
    showStatus('No exhibitions found.', 'info');
    return;
  }

  exhibitions.forEach(exhibit => {
    const card = document.createElement('article');
    card.className = 'card';

    let imageHtml = '<div class="card-image-wrap"><span class="card-image-placeholder">No promotional image</span></div>';
    if (exhibit.image_url) {
      imageHtml = `
        <div class="card-image-wrap">
          <img src="${exhibit.image_url}" alt="${exhibit.title || 'Exhibition banner'}" loading="lazy" />
        </div>
      `;
    }

    // Format dates nicely if available
    const startDate = exhibit.aic_start_at ? new Date(exhibit.aic_start_at).toLocaleDateString() : 'TBD';
    const endDate = exhibit.aic_end_at ? new Date(exhibit.aic_end_at).toLocaleDateString() : 'Ongoing';

    card.innerHTML = `
      ${imageHtml}
      <div class="card-body">
        <h3 class="card-title">${exhibit.title || 'Untitled Exhibition'}</h3>
        <p class="card-meta"><strong>Dates:</strong> ${startDate} – ${endDate}</p>
        <p class="card-meta"><strong>Status:</strong> ${exhibit.status || 'Active'}</p>
        <p class="card-description">${exhibit.short_description || 'No summary available for this exhibition.'}</p>
      </div>
    `;

    exhibitionsGrid.appendChild(card);
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

// Search state reset helper
function resetSearchState() {
  isSearchActive = false;
  searchInput.value = '';
  btnClear.classList.add('hidden');
}

// Event Listeners for tab navigation
navArtworksBtn.addEventListener('click', () => switchView('artworks'));
navExhibitionsBtn.addEventListener('click', () => switchView('exhibitions'));

// Event Listener for search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevents full page reload
  
  const query = searchInput.value.trim();
  if (!query) {
    showStatus('Please enter a keyword to search.', 'error');
    return;
  }

  isSearchActive = true;
  btnClear.classList.remove('hidden');
  searchArtworks(query);
});

// Event Listener for Clear Button
btnClear.addEventListener('click', () => {
  resetSearchState();
  if (currentView === 'artworks') {
    fetchArtworks();
  } else {
    fetchExhibitions();
  }
});

// Initial load
fetchArtworks();