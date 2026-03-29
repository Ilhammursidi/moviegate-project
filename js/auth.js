const form = document.getElementById("form");

if(form) {
  const type = form.dataset.type;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    resetError(email,emailError);
    resetError(password,passwordError);
    if(confirmPassword) resetError(confirmPassword,confirmPasswordError);

    let isValid = true;

    if(!/\S+@\S+\.\S+/.test(email.value)) {
      showError(email,emailError,"Invalid Email");
      isValid = false;
    }

    if(password.value.length < 6) {
      showError(password,passwordError,"Password must be at least 6 characters");
      isValid = false;
    }

    if(type === "register" && confirmPassword) {
      if(confirmPassword.value !== password.value) {
        showError(confirmPassword, confirmPasswordError, "Password not match");
        isValid = false;
      }
    }

    if(isValid) {
      if(type === "login") {
        login(email.value, password.value);
      } else {
        register(email.value, password.value);
      }
    }
  });
}

function login(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  const user = users.find(function (u) {
    return u.email === email && u.password === password;
  });

  const loginError = document.getElementById("loginError");

  loginError.classList.add("hidden");

  if (!user) {
    loginError.textContent = "Incorrect Email or Password";
    loginError.classList.remove("hidden");
    return;
  }

    localStorage.setItem("user",JSON.stringify(user));
    window.location.href = "/index.html";
  }

function register(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.some(function(u) {
    return u.email === email;
  });

  if(exists) {
    showError(email,emailError,"Email already exists")
    return;
  }

  users.push({email,password});
  localStorage.setItem("users",JSON.stringify(users));

  window.location.href = "/auth/login.html"
}

function resetError(div,errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    div.classList.remove("border-red-500")
}

function showError(div,errorEl,message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
    div.classList.add("border-red-500");
}


function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");

  let bg = "bg-zinc-800";
  if (type === "error") bg = "bg-red-500";
  if (type === "warning") bg = "bg-yellow-500";

  toast.className =
    bg + " text-white px-4 py-2 rounded-full h-10 border-2 font-semibold border border-white shadow-lg animate-fade";

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}


const authBtn = document.querySelectorAll(".authBtn");

authBtn.forEach(btn =>{

  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user) {
    const userName = user.email.split("@")[0];
    btn.removeAttribute("href")  
    btn.textContent = userName;
    
     btn.onclick = function () {
      if (confirm("Logout?")) {
        localStorage.removeItem("user");
        window.location.href = "/auth/login.html";
      }
    };
  }
});