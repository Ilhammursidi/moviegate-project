const container = document.getElementById("watchlist");
const imgUrl = "https://image.tmdb.org/t/p/w500";

const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];


if(watchlist.length === 0) {
    container.innerHTML = "<p class='text-white flex justify-center'>Watchlist is Empty</p>"
}
const totalWatchlist = document.getElementById("countWatchlist").textContent = watchlist.length;

watchlist.forEach(function(movie) {
    const card = document.createElement("section")
    card.classList.add("grid","grid-cols-1","sm:grid-cols-[160px_1fr]","mt-8","gap-4","items-start");

    const img = document.createElement("img")
    img.src = imgUrl + movie.poster;
    img.classList.add("w-full", "h-64","sm:h-60", "object-cover", "rounded-md");

    const divDetails = document.createElement("div")
    divDetails.classList.add("flex", "flex-col", "justify-between","h-60", "w-full");

    const title = document.createElement("h1")
    title.classList.add("text-white","text-2xl","font-semibold")
    title.textContent = movie.title;

    const rating = document.createElement("div");
        rating.classList.add("flex", "items-center", "gap-2");

        rating.innerHTML =
        "<img src='/assets/icon/IMDB_Logo_2016 1.svg' class='w-8'>" +
        "<span class='text-gray-400 font-semibold'>" +
        movie.rating.toFixed(1) +
        "</span>" + "<img src='/assets/icon/v-icon.svg'>";

    const overview = document.createElement("p");
    overview.textContent = movie.overview;
    overview.classList.add("text-gray-400");
    
    const button = document.createElement("div")
    button.classList.add("flex","flex-row","font-semibold","gap-4")

    const btnDetails = document.createElement("button");
    btnDetails.classList.add("bg-white","rounded-full","h-10","w-35")
    btnDetails.textContent = "VIEW DETAILS";

    btnDetails.addEventListener("click", function () {
        goDetail(movie.id);
    });

    function goDetail(id) {
        window.location.href = "/pages/detail.html?id=" + id;
    }

    const btnRemove = document.createElement("button");
    btnRemove.classList.add("border","border-1","border-white","w-60","text-white","rounded-full","h-10")
    btnRemove.textContent = "REMOVE FROM WATCHLIST";

    btnRemove.addEventListener("click", function(){
        removeFromWatchlist(movie.id)
    })

    button.append(btnDetails,btnRemove)
    divDetails.append(title,rating,overview,button)
    card.append(img,divDetails)
    container.appendChild(card)
})

function removeFromWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlist = watchlist.filter(function(movie) {
        return movie.id !== id;
    });

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    window.location.reload();
}


console.log(watchlist)