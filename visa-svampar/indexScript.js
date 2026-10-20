let sectionRef;

function init() {
    //Ladda in sidan och starta 
    sectionRef = document.querySelector("section");
    let jsonError = document.getElementById("jsonError");
    fetchData();
}

window.onload = init;

async function fetchData() {
    /*Hämta svampar.json, try catch för att kolla så att allting fungerar som det ska när datan hämtas annars vissas ett errormeddelande
        if(!response.ok) fångar det som fetch inte gör, t.ex. 404 not found, och skickar ett errormeddelande.
    */
    try {
        const response = await fetch("../svampar.json");
        if (!response.ok) {
            throw new Error("Kunde inte hämta data");
        }
        const data = await response.json();
        createArticle(data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        jsonError.textContent = "Det gick inte att ladda in sidan. Försök igen senare.";
    }

}

function createArticle(data) {

    /*Loopa svampar.json och skapa artiklar för varje svamp
      Möjligtvis en function för att skapa elementen? 
      Även add event listeners för att kunna spara svampar på sin sida*/

    data.svampar.forEach(svamp => {
        const article = document.createElement("article");
        //Skapa element för svampens namn, bild, beskrivning och fyndplats.
        let swedishName = createElement("h3", svamp.svenskt_namn);
        article.appendChild(swedishName);

        let latinName = createElement("h3", svamp.latinskt_namn);
        article.appendChild(latinName);

        let imageMushroom = document.createElement("img");
        imageMushroom.src = "../svampar/" + svamp.bild.replace("./", ""); //Json-filen hade inte mappnamnet så la till det här för att kunna få tag på bilderna. 
        imageMushroom.alt = "Bild av " + svamp.svenskt_namn;
        article.appendChild(imageMushroom);

        let descriptionMushroom = createElement("p", svamp.beskrivning);
        article.appendChild(descriptionMushroom);

        let edibilityMushroom = createElement("p", svamp.ätlig);

        //Här skapas badges att sätta på korten med en function.
        let badge = document.createElement("p");
        edibleBadge(svamp, badge);
        article.appendChild(badge);
        article.appendChild(edibilityMushroom);

        let locationMushroom = createElement("p", svamp.fyndplats);
        locationMushroom.textContent = "Fyndplats: " + locationMushroom.textContent;
        article.appendChild(locationMushroom);

        saveArticleButton(svamp, article);
        sectionRef.appendChild(article);
    });
}

//En funktion för att skapa element för att minska mängden repeterad kod i createArticle()
function createElement(elementType, textContent) {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    return element;
}

/* Skapar en knapp för att spara svamp och beroende på om en svamp redan är sparad eller inte står det "spara" eller "sparad"
Så även om man laddar om sidan kan man fortfarande se vilka svampar man redan har sparat. 
Skapar ett click event där JS kollar om svampen redan är sparad och är den inte det så hämtar den alla sparade svampar 
och använder .push för att lägga till den nya svampen och sedan sparar den uppdaterade listan i local storage igen
med hjälp av .setItem och JSON.stringify.  
 */
function saveArticleButton(svamp, article) {
    const saveButton = document.createElement("button");

    if (!checkIfSaved(svamp)) {
        saveButton.textContent = "Spara";
    } else {
        saveButton.textContent = "Sparad";
    }
    article.appendChild(saveButton);

    saveButton.addEventListener("click", () => {
        if (!checkIfSaved(svamp)) {
            let savedMushrooms = JSON.parse(localStorage.getItem("savedMushrooms")) || [];
            savedMushrooms.push(svamp.latinskt_namn);
            localStorage.setItem("savedMushrooms", JSON.stringify(savedMushrooms));
            saveButton.textContent = "Sparad";
        }
    });
}

//Kollar ifall en svamp är sparad eller inte, använda samma kod på två ställen så skapade en funktion istället. 
function checkIfSaved(svamp) {
    let savedMushrooms = JSON.parse(localStorage.getItem("savedMushrooms")) || [];
    return (savedMushrooms.some(saved => saved === svamp.latinskt_namn));
    //.some returnerar redan "true" eller "false" så behöver inte if-sats här utan kan returnera direkt.
}
/*En function för att sätta badges framför ätlighets-texten för att göra tydligt om det är ätligt eller inte
Svampkorten på min och Zouhirs sida behövde matcha så jag fixade detta i min text med, men i lite egen version.
classList.add() använder jag för att kunna ändra färgerna i CSS så det blir extra tydligt vilka som är giftiga och inte.
.startsWith() kollar vad texten börjar med för att se om den är ätlig eller inte. */
function edibleBadge(svamp, badge) {
    const edible = svamp.ätlig;

    if (edible.startsWith("Ätlig")) {
        badge.textContent = "✔ Ätlig ";
        badge.classList.add("edible");
    } else if (edible.startsWith("Dödligt giftig")) {
        badge.textContent = "⚠ Dödligt Giftig";
        badge.classList.add("deadly");
    } else if (edible.startsWith("Giftig")) {
        badge.textContent = "⚠ Giftig";
        badge.classList.add("poisonous");
    }
}
