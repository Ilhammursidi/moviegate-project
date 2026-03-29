const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

console.log(movieId);

const apiKey = "30b5ecf11de0de34456f889c40cca90f";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const imgUrl = "https://image.tmdb.org/t/p/w500";


async function getDetail(id) {
    try {
        const url = baseUrl + id + "?api_key=" + apiKey;

        const res = await fetch(url);
        if(!res.ok) {
            throw new Error("Response error")
        }
        const movie = await res.json()
        
        const credits = await getCredits(id);
        
        renderDetail(movie,credits)
    } catch (error) {
        console.log("Failed to fetch",error)
    }
}

getDetail(movieId)

async function getCredits(id) {
    try {
        const url = baseUrl + id + "/credits?api_key=" + apiKey;
        const res = await fetch(url);
        if(!res.ok){
            throw new Error("Response error")
        }
        const data = await res.json();

        return data;

    } catch (error) {
        console.log("Error credits",error);
        return null;
    }
}

function renderDetail(movie,credits) {
    document.getElementById("title").textContent = movie.title;

    const poster = document.getElementById("poster");
    poster.src = imgUrl + movie.poster_path;
    poster.classList.add("w-full","sm:w-50","md:w-50");

    document.getElementById("addToWatchlist").addEventListener("click", function () {
        addWatchlist(movie);
        });

    document.getElementById("rating")

    rating.innerHTML =
        "<img src='/assets/icon/IMDB_Logo_2016 1.svg' class='w-8'>" +
        "<span class='text-gray-400 font-semibold'>" +
        movie.vote_average.toFixed(1) +
        "</span>" + "<img src='/assets/icon/v-icon.svg'>";

    document.getElementById("overview").textContent = movie.overview;

    const genreContainer = document.getElementById("genres");

    movie.genres.forEach(function(g) {
        const span = document.createElement("span");

        span.textContent = g.name;
        span.classList.add("px-3","py-1","text-md","border","border-white","rounded-full","text-white","mr-2");

        genreContainer.appendChild(span);
    })

    const director = credits.crew.find(function(person) {
        return person.job === "Director";
    })

    document.getElementById("director").textContent =
    "Director: " + (director ? director.name : "Unknown");

    const castNames = credits.cast.slice(0,3).map(function(actor){
        return actor.name;
    })

    castText = castNames.join(", ");

    document.getElementById("cast").textContent = "Cast: " + castText;
}

function addWatchlist(movie) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        showToast("Login Required!");
        window.location.href = "/auth/login.html";
        return;
    }

    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    const exists = watchlist.some(function(item) {
    return item.id === movie.id;
    });

    if (exists) {
        showToast("the film is already on the watchlist");
        return;
    }

    const movieData = {
        id: movie.id,
        overview : movie.overview,
        title: movie.title,
        poster: movie.poster_path,
        rating: movie.vote_average
    };

    watchlist.push(movieData);

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    showToast("Movie successfully added to watchlist");
}
