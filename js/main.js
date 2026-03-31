const apiKey = "30b5ecf11de0de34456f889c40cca90f";
const baseUrl = "https://api.themoviedb.org/3/discover/movie";
const imgUrl = "https://image.tmdb.org/t/p/w500";
const genreUrl = "https://api.themoviedb.org/3/genre/movie/list";

let currentPage = 1;
const totalPages = 5;
const totalItems = 100;
const itemsPerPage = 20;
let selectedGenre = "";

const container = document.getElementById("movies");
const pagination = document.getElementById("pagination");
const select = document.getElementById("genre");

// genre
async function getGenres() {
    try {
        const url = genreUrl + "?api_key=" + apiKey;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("response failed");
        
        const data = await response.json();
        
        const map = {};
        data.genres.forEach(g => map[g.id] = g.name);
        
    return map;
  } catch (error) {
      console.log("Failed to fetch", error);
      return {};
    }
}

// genreUI
function renderGenreOptions(map) {
    select.innerHTML = `<option value="">Genre</option>`;
    
    for (let id in map) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = map[id];
        select.appendChild(option);
    }
}

// paginationInfo
function updatePaginationInfo() {
  const start = (currentPage - 1) * itemsPerPage + 1;
  let end = currentPage * itemsPerPage;
  if (end > totalItems) end = totalItems;

  const info = document.getElementById("paginationInfo");
  if (info) {
      info.textContent = `Items per page: ${itemsPerPage} ${start}-${end} of ${totalItems}`;
  }
}

// paginationUI
function renderPagination() {
    pagination.innerHTML = "";
    
    // prev
    const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage === 1;
  prev.classList.add("text-white", "border", "px-3" ,"py-1", "rounded", "disabled:opacity-50");
  
  prev.onclick = () => {
      if (currentPage > 1) {
          currentPage--;
          changePage();
        }
    };
    
    pagination.appendChild(prev);
    
    // numbers
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        
    btn.textContent = i;
    btn.classList.add("px-3" ,"py-1" ,"border" ,"text-white", "rounded");
    
    if (i === currentPage) {
        btn.classList.add("border-sky-400", "text-sky-400");
    }
    
    btn.onclick = () => {
        currentPage = i;
        changePage();
    };
    
    pagination.appendChild(btn);
}

// next
const next = document.createElement("button");
next.textContent = "Next";
next.disabled = currentPage === totalPages;
  next.classList.add("text-white" ,"border", "px-3", "py-1" ,"rounded" ,"disabled:opacity-50");

  next.onclick = () => {
      if (currentPage < totalPages) {
          currentPage++;
          changePage();
        }
    };
    
    pagination.appendChild(next);
}

// movies
async function getMovies() {
    try {
    let url = baseUrl + "?api_key=" + apiKey + "&page=" + currentPage;
    
    if (selectedGenre) {
        url += "&with_genres=" + selectedGenre;
    }
    const genreMap = await getGenres();

    const response = await fetch(url);
    if (!response.ok) throw new Error("response failed");
    
    const data = await response.json();
    
    container.innerHTML = "";
    
    const sortValue = document.getElementById("sortRating").value;
    
    let movies = data.results;
    
    if (sortValue === "desc") {
        movies.sort((a, b) => b.vote_average - a.vote_average);
    }
    
    if (sortValue === "asc") {
        movies.sort((a, b) => a.vote_average - b.vote_average);
    }

    const wrapper = document.createElement("section");
    wrapper.classList.add("grid","grid-rows-[auto_1fr]","gap-10","w-full");

    movies.forEach(movie => {
        const card = document.createElement("div");
      card.classList.add("grid","w-full","min-w-0","grid-rows-[auto_1fr]","sm:grid-cols-[auto_1fr]","border","sm:border-none","border-white","py-2","rounded-md","gap-4","items-start");

      const img = document.createElement("img");
      img.src = imgUrl + movie.poster_path;
      img.classList.add("w-full", "h-auto","sm:h-60", "object-cover", "rounded-md");
      
      const detail = document.createElement("div");
      detail.classList.add("flex","flex-col","justify-between","h-auto","sm:h-60");
      
      const title = document.createElement("h2");
      title.classList.add("text-white", "text-xl", "font-semibold");
      title.textContent = movie.title;
      
      const genreBox = document.createElement("div");
      genreBox.classList.add("flex", "gap-2", "flex-wrap");
      
      movie.genre_ids.forEach(id => {
          if (!genreMap[id]) return;
          
          const span = document.createElement("span");
          span.textContent = genreMap[id];
        span.classList.add("px-3", "py-1", "text-xs", "border", "border-white", "rounded-full", "text-white");

        genreBox.appendChild(span);
    });

    const rating = document.createElement("div");
      rating.classList.add("flex", "items-center", "gap-2");
      rating.innerHTML =
      "<img src='/assets/icon/IMDB_Logo_2016 1.svg' class='w-8'>" +
        `<span class='text-gray-400 font-semibold'>${movie.vote_average.toFixed(1)}</span>` +
        "<img src='/assets/icon/v-icon.svg'>";
        
        const synopsis = document.createElement("p");
        synopsis.classList.add("text-gray-400", "text-sm");
        synopsis.textContent = movie.overview;
        
        const actions = document.createElement("div");
        actions.classList.add("flex", "gap-4", "mt-2", "font-semibold");
        
        const btnDetail = document.createElement("button");
        btnDetail.textContent = "VIEW DETAILS";
        btnDetail.classList.add("bg-white", "text-black", "px-4", "py-1", "rounded-full", "text-sm");
        btnDetail.onclick = () => {
            window.location.href = "/pages/detail.html?id=" + movie.id;
      };
      
      const btnWatch = document.createElement("button");
      btnWatch.textContent = "ADD TO WATCHLIST";
      btnWatch.classList.add("border", "border-white", "text-white", "px-4", "py-1", "rounded-full", "text-sm");
      btnWatch.onclick = () => addWatchlist(movie);
      
      actions.append(btnDetail, btnWatch);
      
      detail.append(title, genreBox, rating, synopsis, actions);
      card.append(img, detail);
      wrapper.appendChild(card);
    });
    
    container.appendChild(wrapper);

    renderPagination();
    updatePaginationInfo();
    
} catch (error) {
    console.log("Fail to fetch", error);
}
}

// change
function changePage() {
    getMovies();
}

// filter
if (select) {
  select.addEventListener("change", function () {
    selectedGenre = this.value;
    currentPage = 1;
    changePage();
  });
}

// watchlist
function addWatchlist(movie) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    showToast("login required");
    window.location.href = "/auth/login.html";
    return;
  }

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  const exists = watchlist.some(item => item.id === movie.id);

  if (exists) {
    showToast("already added");
    return;
  }

  watchlist.push({
    id: movie.id,
    overview: movie.overview,
    title: movie.title,
    poster: movie.poster_path,
    rating: movie.vote_average
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  showToast("Added to Watchlist");
}

document.getElementById("sortRating").addEventListener("change", function () {
  getMovies();
});

// init
async function init() {
  const genres = await getGenres();
  renderGenreOptions(genres);
  getMovies();
}

init();
