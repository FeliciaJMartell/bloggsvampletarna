// ==========================================
// Mina svampar: visar de svampar besökaren har sparat
// ==========================================

// ------------------------------------------
// 1. Referenser till HTML och inställningar
// ------------------------------------------
const cardContainer = document.getElementById("card-container");
const emptyState = document.getElementById("empty-state");
const clearButton = document.getElementById("clear-button");
const errorMessage = document.getElementById("error-message");

// Nyckeln som de sparade svamparna ligger under i localStorage (bestämd tillsammans med Linn)
const STORAGE_KEY = "savedMushrooms";

// Alla svampar från svampar.json. Filen hämtas bara en gång och sparas här.
let allMushrooms = [];

// ------------------------------------------
// 2. Hämta data
// ------------------------------------------

// Läser listan med sparade LATINSKA NAMN ur localStorage.
// Ger alltid tillbaka en lista, även om inget finns sparat eller om texten är trasig.
function getSavedNames() {
    const savedText = localStorage.getItem(STORAGE_KEY);

    // Inget sparat än: localStorage ger null, och då använder vi en tom lista
    if (!savedText) {
        return [];
    }

    try {
        // Texten görs om till en riktig lista
        const savedList = JSON.parse(savedText);

        // Bara en lista duger. Allt annat räknas som tomt.
        if (Array.isArray(savedList)) {
            return savedList;
        }
        return [];
    } catch (error) {
        // JSON.parse kastar ett fel om texten inte är giltig JSON
        return [];
    }
}

// Hämtar alla svampar från svampar.json.
// async + await: vi väntar på filen innan vi går vidare.
async function loadMushrooms() {
    const response = await fetch("../svampar.json");

    // fetch räknar "404 hittades inte" som ett svar, så vi kontrollerar själva
    if (!response.ok) {
        throw new Error("Kunde inte hämta svampar.json, status " + response.status);
    }

    const data = await response.json();
    return data.svampar; // listan med de 20 svamparna
}

// ------------------------------------------
// 3. Små hjälpfunktioner för att bygga kort
// ------------------------------------------

// Skapar ett element med text i, till exempel <p>Hej</p>
function createTextElement(tagName, text) {
    const element = document.createElement(tagName);
    element.textContent = text;
    return element;
}

// Fältet "ätlig" är en lång text, till exempel "Ätlig – en av de bästa...".
// Vi tittar bara på hur texten börjar och bevarar er ursprungliga logik för Ä, Ö, Å.
function getEdibility(edibleText) {
    if (!edibleText) return "Okänd"; // Säkerhetskoll om JSON-data skulle saknas

    if (edibleText.startsWith("Ätlig")) {
        return "Ätlig";
    }
    if (edibleText.startsWith("Dödligt giftig")) {
        return "Dödligt giftig";
    }
    if (edibleText.startsWith("Giftig")) {
        return "Giftig";
    }
    // Reservläge: vi påstår aldrig att en okänd svamp är ätlig
    return "Okänd";
}

// Skapar etiketten med symbol och text (aldrig bara färg)
function createBadge(edibility) {
    const badge = document.createElement("span");
    badge.classList.add("badge");

    if (edibility === "Ätlig") {
        badge.textContent = "✔ Ätlig";
        badge.classList.add("badge-atlig");
    } else if (edibility === "Giftig") {
        badge.textContent = "⚠ Giftig";
        badge.classList.add("badge-giftig");
    } else if (edibility === "Dödligt giftig") {
        badge.textContent = "⚠ Dödligt giftig";
        badge.classList.add("badge-dodlig");
    } else {
        badge.textContent = "? Okänd";
    }

    return badge;
}

// Bygger ett helt svampkort
function createCard(svamp) {
    const article = document.createElement("article");

    article.appendChild(createTextElement("h2", svamp.svenskt_namn));
    article.appendChild(createTextElement("h3", svamp.latinskt_namn));

    const image = document.createElement("img");
    // JSON-filen har inte mappnamnet, så vi lägger till "svampar/" (samma rad som Linn)
    image.src = "../svampar/" + svamp.bild.replace("./", "");
    image.alt = "Bild av " + svamp.svenskt_namn;
    image.loading = "lazy"; // bilder långt ned laddas först när man scrollar dit
    article.appendChild(image);

    article.appendChild(createTextElement("p", svamp.beskrivning));
    article.appendChild(createTextElement("p", "Fyndplats: " + svamp.fyndplats));

    // Hämtar ätlighetsstatus från JSON med exakt rätt nyckel ("ätlig")
    const edibility = getEdibility(svamp["ätlig"]);

    // Lägger först till färg-badgen
    article.appendChild(createBadge(edibility));

    // Lägger sedan till hela den förklarande texten om ätlighet från JSON-filen (enligt Linns krav)
    article.appendChild(createTextElement("p", svamp["ätlig"]));

    return article;
}

// ------------------------------------------
// 4. Visa sidan
// ------------------------------------------

// Visar tomt läge eller knappen beroende på hur många kort det finns
function updateVisibility(cardCount) {
    const hasCards = cardCount > 0;

    emptyState.hidden = hasCards; // Tomt läge syns BARA när det är 0 kort (hasCards är false)
    clearButton.hidden = !hasCards; // Knappen syns BARA när det finns kort (hasCards är true)
    errorMessage.hidden = true;
}

// Visar bara felmeddelandet (när svampar.json inte gick att hämta)
function showError() {
    errorMessage.hidden = false;
    emptyState.hidden = true;
    clearButton.hidden = true;
}

// Väljer ut, sorterar och ritar de sparade svamparna
function renderSavedMushrooms() {
    const savedNames = getSavedNames();

    // 1. Behåll bara svampar vars latinska namn finns i listan
    const savedMushrooms = allMushrooms.filter(svamp => savedNames.includes(svamp.latinskt_namn));

    // 2. Sortera alfabetiskt efter svenskt namn, med svenska bokstäver (å, ä, ö sist)
    savedMushrooms.sort((a, b) => a.svenskt_namn.localeCompare(b.svenskt_namn, "sv"));

    // 3. Rädda den osynliga rubriken och töm behållaren så W3C-validatorn och kraven för tillgänglighet är uppfyllda
    const srHeading = cardContainer.querySelector(".sr-only");
    if (srHeading) {
        cardContainer.replaceChildren(srHeading);
    } else {
        cardContainer.replaceChildren();
    }

    // Bygg ett kort per svamp
    savedMushrooms.forEach(svamp => {
        cardContainer.appendChild(createCard(svamp));
    });

    // 4. Tomt läge avgörs EFTER filtreringen: noll kort betyder tomt läge
    updateVisibility(savedMushrooms.length);
}

// ------------------------------------------
// 5. Töm-knappen
// ------------------------------------------
clearButton.addEventListener("click", () => {
    // confirm ger true (OK) eller false (Avbryt)
    const isSure = window.confirm("Är du säker på att du vill ta bort alla dina sparade svampar?");

    if (isSure) {
        // Tar bort bara vår nyckel (inte allt i localStorage)
        localStorage.removeItem(STORAGE_KEY);
        // Vi har redan alla svampar i minnet, så vi behöver inte hämta filen igen
        renderSavedMushrooms();
    }
});

// ------------------------------------------
// 6. Starta
// ------------------------------------------
async function init() {
    try {
        allMushrooms = await loadMushrooms();
        renderSavedMushrooms();
    } catch (error) {
        console.error("Kunde inte visa sparade svampar:", error);
        showError();
    }
}

// Skriptet har defer i HTML, så sidan är redan inläst när vi kommer hit
init();

// --stresstesta koden!--
/*async function init() {
    try {
        // 1. Hämta alla svampar först
        allMushrooms = await loadMushrooms();

        // --- TILLFÄLLIGT TEST START ---
        // 2. Ta de första 20 svamparnas latinska namn från JSON-filen och spara i localStorage
        if (allMushrooms.length > 0) {
            const nineMushrooms = allMushrooms
                .slice(0, 20) // Begränsa till max 20 stycken
                .map(svamp => svamp.latinskt_namn); // Plocka bara ut det latinska namnet

            localStorage.setItem("savedMushrooms", JSON.stringify(nineMushrooms));
        }
        // --- TILLFÄLLIGT TEST SLUT ---

        // 3. Rita ut svamparna
        renderSavedMushrooms();
    } catch (error) {
        console.error("Kunde inte visa sparade svampar:", error);
        showError();
    }
}*/