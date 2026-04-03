// burger
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// auth button
const authBtns = document.querySelectorAll(".authBtn");

authBtns.forEach(btn => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    const name = user.email.split("@")[0];

    btn.textContent = name;
    btn.removeAttribute("href");

    btn.onclick = () => {
      if (confirm("Logout?")) {
        localStorage.removeItem("user");
        window.location.href = "/auth/login.html";
      }
    };
  }
});

// watchlist button
const watchlistBtns = document.querySelectorAll(".watchlistBtn");

watchlistBtns.forEach(btn => {
  btn.onclick = function (e) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      e.preventDefault();
      showToast("Login required!");
      window.location.href = "/auth/login.html";
    } else {
      btn.href = "/pages/watchlist.html";
    }
  };
});

// toast
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");

  let bg = "bg-zinc-800";
  if (type === "error") bg = "bg-red-500";
  if (type === "warning") bg = "bg-yellow-500";

  toast.classList.add(bg,"text-white", "px-4", "py-2", "rounded-full", "h-10", "border", "font-semibold", "shadow-lg");
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}