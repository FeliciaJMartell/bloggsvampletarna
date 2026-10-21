const namn = "Kalle";
const losenord = "qwe123";

const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("namn");
const losenordInput = document.getElementById("losenord");
const felMeddelande = document.getElementById("felMeddelande");
const sparadAnvandare = localStorage.getItem("inloggadAnvandare");


if (sparadAnvandare) {
    skickaTillBloggen();
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const inskrivetNamn = nameInput.value;
    const inskrivetLosenord = losenordInput.value;

    if (inskrivetNamn === namn && inskrivetLosenord === losenord) {
        localStorage.setItem("inloggadAnvandare", inskrivetNamn);
        skickaTillBloggen();
        

    } else {
        felMeddelande.textContent = "Felaktiga inloggningsuppgifter";

    }
});

function skickaTillBloggen() {
    window.location.href= "../blogg.html";
}





