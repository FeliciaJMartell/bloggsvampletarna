/* skapar en tom array som startvärde för allPairs. Använder let eftersom värdet kommer att bytas ut längre ner i koden. 
Arrayen är tom och kommer sedan kastas och bytas ut med data från json filen. 
Men jag behöver deklarera den här så att något värde finns ifall det tar tid för filen att läsas in, så att koden kan fortsätta.*/
let allPairs = [];
/* skapar en variabel som säger att index börjar räkna från 0, använder let eftersom variabeln ändras när jag klickar på nästa eller tillbakaknapparna. */
let index = 0;

/*hämtar element med id från min html fil, använder const eftersom elementet i min html fil aldrig kommer bytas ut, men innehållet i elementet kan ändras. */
const leftRisk = document.getElementById("leftRisk");
const leftTitle = document.getElementById("leftTitle");
const leftList = document.getElementById("leftIdentify");

const rightRisk = document.getElementById("rightRisk");
const rightTitle = document.getElementById("rightTitle");
const rightList = document.getElementById("rightIdentify");

const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const pageNumber = document.getElementById("pageNumber");

/* hämtar den tomma behållaren från min html & skriver sedan texten längre ner i js filen. Lägger texten i js eftersom den bara ska synas om något gör att json filen
inte kan läsas in. */

const somethingHappened = document.getElementById("somethingHappened");

/*skapar en init funktion som anropar getList och sätter igång allting. Här lägger jag saker som ska köras direkt när sidan startar */
function init() {
    getList();
}

/*bygger en funktion för att kunna hämta min json fil & göra om till JavaScript objekt, använder mig av async så att jag kan använda await. 
Detta gör att sidan inte fryser under tiden som filen hämtas in. 
Hämtar sedan json filen med hjälp av fetch och använder await för att säga till datorn att vänta tills allt är hämtat.
Om filen som hämtas inte är OK, hoppar den då ner till catch som skickar ut felmeddelande i console log, men också på webbsidan.
Gör sedan om json filen till ett JavaScript object, använder await så att datorn väntar tills all text är omgjord. 
Hämtar sedan ut särskiljande egenskaper från json filen och ersätter den tomma arrayen allPairs med nytt innehåll.
Anropar sedan funktionen displayList.
Om något annat kraschar i funktionen getList, så som fetch eller displayList, då fångar catch det med. Så alla fel som sker i getList, fångas av catch. 
Eftersom jag skrivit "laddar..." i mina h3 rubriker så vill jag tömma dom om något skulle gå fel vid inläsning av json filen.
*/

async function getList() {
    try {
        const response = await fetch("../speciellaEgenskaper.json");
        if (!response.ok) {
            throw new Error("Något gick fel vid hämtning");
        }
        const data = await response.json();
        allPairs = data.särskiljande_egenskaper;

        displayList();

    } catch (error) {
        console.error("Fel:", error);
        somethingHappened.textContent = "Något gick fel när sidan lästes in, försök igen senare.";
        rightTitle.textContent = "";
        leftTitle.textContent = "";
    }
}

function displayList() {
    /* hämtar ett par från allPairs arrayen med hjälp av index. Jag använder sedan mina element från html filen och lägger in texten i dom så att det
    visas på hemsidan.  
    Jag hämtar texten från json filen som jag hämtat i funktionen getList. Detta med hjälp av par, risk och särskiljande. Jag loopar sedan igenom 
    arrayen med särskiljande med hjälp av en forEach loop och skapar en lista med varje punkt i arrayen. Jag lägger till appendChild så att varje
    punkt läggs till sist i listan.
    Tömmer leftList varenda gång, då listan annars bara skulle byggas på. Behöver inte tömma rubriken och risken eftersom dom ersätts varje gång.*/
    leftList.textContent = "";
    const leftPair = allPairs[index];
    leftTitle.textContent = leftPair.par;
    leftRisk.textContent = leftPair.risk;
    const leftFeatures = leftPair.särskiljande;

    leftFeatures.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        leftList.appendChild(li);
    });

    /* för att få ut två par på sidan kör jag index plus 1.*/
    const rightPair = allPairs[index + 1];

    /* tömmer behållarna så att det inte finns något kvar från tidigare ifall det skulle komma in ett par till i json filen (att det skulle bli udda antal). 
    Jag vill inte att sidan skulle krascha om det tex är 11 par i json filen. 
    Så om (rightPair !== undefined) vilket betyder om rightPair inte är undefined fortsätt fylla sidan, om det däremot är undefined, så stannar if och inget syns på höger
    sida eftersom behållarna är tömda sedan tidigare. */
    rightTitle.textContent = "";
    rightRisk.textContent = "";
    rightList.textContent = "";

    if (rightPair !== undefined) {
        rightTitle.textContent = rightPair.par;
        rightRisk.textContent = rightPair.risk;

        const rightFeatures = rightPair.särskiljande;

        rightFeatures.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            rightList.appendChild(li);
        });
    }
    showPageNumber(); // anropar min funktion så att sidnumrering visas direkt
    nextButton.disabled = (index >= allPairs.length - 2); // knappen blir grå när index är större eller lika med längden på allPairs - 2 eftersom jag vill visa två par.
    prevButton.disabled = (index <= 0); // knappen blir grå när index är 0 eller mindre,
}

/* skapar en funktion så att det finns en sidnumrering. Jag vill att varje sida ska visa 2 par & därav delar jag index med 2, men eftersom index börjar på 0 
så behöver jag plussa på 1 för korrekt nummer i sidnumreringen. Om det skulle komma in udda antal par i json filen så använder jag mig av Math.ceil som avrundar uppåt.
Så om det skulle komma in ett par till så skulle det bli 11 par, sista sidnumreringen skulle då säga 5.5 (11/2=5.5) vilket då inte stämmer eftersom det är 6 sidor. 
Skriver sedan ut det på webbsidan i min tomma <span> från html med hjälp av textContent.*/
function showPageNumber() {
    const currentPage = index / 2 + 1;
    const totalPages = Math.ceil(allPairs.length / 2);

    pageNumber.textContent = `Sida ${currentPage} av ${totalPages}`;
}

/* bygger en funktion som visar två stycken par från json filen åt gången, när man klickar på knappen nextButton så kommer index öka
med 2 och visa nästa två par. Om index är lika med eller större än längden på allPairs minus 2 så kommer knappen inte fungera längre, 
alltså ingenting händer när man trycker och den blir grå eftersom jag gjort disabled i displayList. */
function nextPair() {
    if (index < allPairs.length - 2) {
        index += 2;
        displayList();
    }
}

/* lägger till en eventlyssnare till min knapp som jag byggt i html & som anropar funktionen nextPair när man klickar på den. */
nextButton.addEventListener("click", nextPair);

/* bygger en funktion som gör att man kan gå tillbaka till föregående sida. Så när man klickar på knappen prevButton så går man tillbaka två par. 
När index är 0 eller mindre så kommer knappen inte fungera längre, 
alltså ingenting händer när man trycker och den blir grå eftersom jag gjort disabled i displayList. */
function prevPair() {
    if (index > 0) {
        index -= 2;
        displayList();
    }
}
/* lägger till en eventlyssnare till min knapp som jag byggt i html & som anropar funktionen prevPair när man klickar på den. */
prevButton.addEventListener("click", prevPair);

/*säger till att så fort sidan laddats klart så ska init köras */
window.onload = init;


