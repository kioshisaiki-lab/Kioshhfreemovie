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

// Category Switcher
btnMovies.addEventListener('click', () => {
  currentType = 'movie';
  btnMovies.classList.add('active');
  btnTV.classList.remove('active');
  sectionTitle.textContent = 'Trending Movies';
  getMedia(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`, 'movie');
});

btnTV.addEventListener('click', () => {
  currentType = 'tv';
  btnTV.classList.add('active');
  btnMovies.classList.remove('active');
  sectionTitle.textContent = 'Trending TV Series';
  getMedia(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`, 'tv');
});

// Search
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if(query) {
    sectionTitle.textContent = `Search Results: ${query}`;
    getMedia(`https://api.themoviedb.org/3/search/${currentType}?api_key=${API_KEY}&query=${query}`, currentType);
  }
});

// Player Modal (In-update sa mas gumaganang player server)
function openModal(title, overview, id, type) {
  const embedUrl = type === 'tv' 
    ? `https://vidsrc.cc/v2/embed/tv/${id}/1/1`
    : `https://vidsrc.cc/v2/embed/movie/${id}`;

  modalBody.innerHTML = `
    <h3 style="margin-bottom:10px; font-size:16px;">${title}</h3>
    <iframe src="${embedUrl}" width="100%" height="250" frameborder="0" allowfullscreen style="border-radius:6px; background:#000;"></iframe>
    <p style="margin-top:10px; color:#ccc; font-size:12px; max-height:100px; overflow-y:auto;">${overview}</p>
  `;
  modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Initial Load
getMedia(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`, 'movie');
