"use strict";
//TS hittar inte HTML knappen, så säger till att det finns en i min HTML fil
const logoutKnapp = document.getElementById("logoutKnapp");
logoutKnapp.addEventListener("click", () => {
    window.location.href = "index.html";
    localStorage.removeItem("inloggadAnvandare");
});
