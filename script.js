const API_KEY = 'YOUR_TMDB_API_KEY';
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Fetch movies on page load
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

function showMovies(movies) {
  movieGrid.innerHTML = '';
  movies.forEach(movie => {
    const { title, poster_path, vote_average, overview, id } = movie;
    if(!poster_path) return;

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="card-info">
        <h3>${title}</h3>
        <span>★ ${vote_average.toFixed(1)}</span>
      </div>
    `;

    card.addEventListener('click', () => openModal(title, overview, id));
    movieGrid.appendChild(card);
  });
}

// Search Functionality
searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  if(query) {
    getMovies(SEARCH_URL + query);
  }
});

// Modal Popup for details
async function openModal(title, overview, id) {
  // Fetch trailer
  const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  let trailerHTML = '';
  if(trailer) {
    trailerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen style="margin-top:15px; border-radius:6px;"></iframe>`;
  }

  modalBody.innerHTML = `
    <h2>${title}</h2>
    <p style="margin-top:10px; color:#ccc;">${overview}</p>
    ${trailerHTML}
  `;
  modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Initial load
getMovies(API_URL);
