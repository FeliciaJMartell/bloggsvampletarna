/*Hårdkodade inloggningsuppgifter */
const namn = "Kalle";
const losenord = "qwe123";

/*Hämtar min HTML element */
const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("namn");
const losenordInput = document.getElementById("losenord");
const felMeddelande = document.getElementById("felMeddelande");
const sparadAnvandare = localStorage.getItem("inloggadAnvandare");


/*Skapar upp en funktion som länkar till bloggsidan */
function skickaTillBloggen() {
    window.location.href = "../blogg.html";
}

/*Om man råkar klicka ner sidan utan att ha loggat ut så stannar man inloggad */
if (sparadAnvandare) {
    skickaTillBloggen();
}

/*Skapar upp en eventlyssnare. Stoppar sidan från att ladda om. Om namnet och lösenordet är korrekt, spara i localStorage och
skicka till bloggen. Annars får man ett felmeddelande. */
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







