const API_KEY = '5959ee7103e0456dc8c681afb1462d4a'; 

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.getElementById('sectionTitle');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const btnMovies = document.getElementById('btnMovies');
const btnTV = document.getElementById('btnTV');
const genreSelect = document.getElementById('genreSelect');

let currentType = 'movie';

async function getMedia(url, type) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if(data.results && data.results.length > 0) {
      showMedia(data.results, type);
    } else {
      movieGrid.innerHTML = '<p style="color:#aaa;">Walang nahanap.</p>';
    }
  } catch (error) {
    movieGrid.innerHTML = '<p style="color:#e50914;">May problema sa pag-load ng data.</p>';
  }
}

function showMedia(items, type) {
  movieGrid.innerHTML = '';
  items.forEach(item => {
    const title = item.title || item.name;
    const { poster_path, vote_average, overview, id } = item;
    if(!poster_path) return;

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="card-info">
        <h3>${title}</h3>
        <span>★ ${vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
      </div>
    `;

    card.addEventListener('click', () => openModal(title, overview, id, type));
    movieGrid.appendChild(card);
  });
}

function loadContent() {
  const genreId = genreSelect.value;
  let url = '';

  if (genreId) {
    const selectedText = genreSelect.options[genreSelect.selectedIndex].text;
    sectionTitle.textContent = `${selectedText} (${currentType === 'movie' ? 'Movies' : 'TV Shows'})`;
    url = `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
  } else {
    sectionTitle.textContent = `Trending ${currentType === 'movie' ? 'Movies' : 'TV Series'}`;
    url = `https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`;
  }

  getMedia(url, currentType);
}

// Category Buttons Switcher
btnMovies.addEventListener('click', () => {
  currentType = 'movie';
  btnMovies.classList.add('active');
  btnTV.classList.remove('active');
  loadContent();
});

btnTV.addEventListener('click', () => {
  currentType = 'tv';
  btnTV.classList.add('active');
  btnMovies.classList.remove('active');
  loadContent();
});

// Genre Dropdown Event
genreSelect.addEventListener('change', loadContent);

// Search Feature
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if(query) {
    sectionTitle.textContent = `Search Results: ${query}`;
    getMedia(`https://api.themoviedb.org/3/search/${currentType}?api_key=${API_KEY}&query=${query}`, currentType);
  }
});

// Player Modal
function openModal(title, overview, id, type) {
  const s1 = type === 'tv' ? `https://vidsrc.me/embed/tv?id=${id}&s=1&e=1` : `https://vidsrc.me/embed/movie?id=${id}`;
  const s2 = type === 'tv' ? `https://embed.su/embed/tv/${id}/1/1` : `https://embed.su/embed/movie/${id}`;
  const s3 = type === 'tv' ? `https://vidsrc.cc/v2/embed/tv/${id}/1/1` : `https://vidsrc.cc/v2/embed/movie/${id}`;

  modalBody.innerHTML = `
    <h3 style="margin-bottom:8px; font-size:16px;">${title}</h3>
    
    <div style="display:flex; gap:8px; margin-bottom:10px;">
      <button onclick="document.getElementById('playerIframe').src='${s1}'" style="padding:6px 12px; font-size:12px; background:#e50914; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Server 1</button>
      <button onclick="document.getElementById('playerIframe').src='${s2}'" style="padding:6px 12px; font-size:12px; background:#22252f; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Server 2</button>
      <button onclick="document.getElementById('playerIframe').src='${s3}'" style="padding:6px 12px; font-size:12px; background:#22252f; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Server 3</button>
    </div>

    <iframe id="playerIframe" src="${s1}" width="100%" height="250" frameborder="0" allowfullscreen style="border-radius:6px; background:#000;"></iframe>
    <p style="margin-top:10px; color:#ccc; font-size:12px; max-height:80px; overflow-y:auto;">${overview}</p>
  `;
  modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalBody.innerHTML = '';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
  }
});

// Initial Load
loadContent();
