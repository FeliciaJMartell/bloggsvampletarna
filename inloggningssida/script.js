/* jag använder const för att deklarera min värden, som Kalle och qwe123, det är hårdkodat och används för inloggning. Jag använder sedan namn och losenord
längre ner i filen för att avgöra om det är rätt eller fel när man försöker logga in. I detta fallet måste man skriva Kalle och qwe123 för att kunna logga in.
Jag använder sedan den inbyggda funktionen i javaScript, document.getElementById för att hämta mina element från min HTML fil. 
Jag använder dock document.querySelector för min bild, då det är en class.
Jag använder localStorage.getItem för att hämta värde, för att kunna spara och rensa i förrådet senare. Mer förklaring längre ner.*/

const namn = "Kalle";
const losenord = "qwe123";

const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("namn");
const losenordInput = document.getElementById("losenord");
const felMeddelande = document.getElementById("felMeddelande");
const inloggadVy = document.getElementById("inloggadVy");
const valkomstText = document.getElementById("valkomstText");
const logoutKnapp = document.getElementById("logoutKnapp");
const loginRubrik = document.getElementById("loginRubrik");
const svampBild = document.querySelector(".svamp");
const sparadAnvandare = localStorage.getItem("inloggadAnvandare");

/* här hämtar sparad användare från local storage, datorn kollar då i förrådet för att se om något finns sparat där.
Om det finns något sparat ska användaren se inloggad vy direkt. Detta gäller då om sidan tex laddas om, eller om man råkat stänga ner .*/

if (sparadAnvandare) {
    visaInloggadVy(sparadAnvandare);
}

/* Jag använder den inbyggda funktionen loginForm.addEventListener så att koden lyssnar efter vad som ska ske. 
Jag använder event.preventDefault för att stoppa sidan från att ladda om hela tiden. 
Jag deklarerar sedan två nya värden, för att kunna hämta upp vad användaren har skrivit när den försöker logga in. Value hämtar värdet som användaren skriver in 
och sparar i inskrivetNamn och inskrivetLosenord
och jämförs sedan i if satsen. där jag ber datorn kolla om inskrivetNamn är lika med (==) min variabel namn (Kalle) och (&&) inSkrivet lösenord är lika med (==) qwe123.
Om det då är korrekt, både namn och lösenord därav (&&), så hamnar man på inloggad vy, jag anropar då min egen funktion längre ner. 
Jag använder localStorage.setItem för att spara användarnamnet (Kalle) i förrådet så att datorn ska stanna inloggad även om man råkar klicka ner rutan.
Så här sätter jag ihop localStorage.getItem och localStorage.setItem, jag hämtar värdet och sparar det i förrådet. 
Om man då inte loggar in med rätt användarnamn och lösenord så får man ett felmeddelande. */

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const inskrivetNamn = document.getElementById('namn').value;
    const inskrivetLosenord = document.getElementById('losenord').value;

    if (inskrivetNamn == namn && inskrivetLosenord == losenord) {
        visaInloggadVy(inskrivetNamn);
        localStorage.setItem("inloggadAnvandare", inskrivetNamn);

    } else {
        felMeddelande.textContent = "Felaktiga inloggningsuppgifter";

    }
});

/* här är min funktion som ska visas vid inloggad vy. Jag hämtar min variabel valkomsText och skriver ut vad den ska säga. Anledningen till att jag lägger den här
och inte i min html fil är för att det ska bli dynamiskt. Jag vill ju att inloggatNamn ska stämma överens med personen som loggat in. Hade jag hårdkodat
namnet i min html fil så hade det stått Välkommen Kalle ..... även fast Pelle hade loggat in.
Så jag anropar visaInloggadVy som då har värdet av vem som loggat in.  
Sedan väljer jag vad som ska synas och inte synas beroende på add och remove. Här lägger jag även till/tar bort min class hidden som ligger i min css.
Jag valde att göra en egen funktion av detta då jag använder funktionen på två ställen, ett när man loggar in från början & en gång om man råkat klicka ner sidan.*/


function visaInloggadVy(inloggatNamn) {
    valkomstText.textContent = "Välkommen " + inloggatNamn + ", du är nu inloggad.";

    loginForm.classList.add("hidden");
    svampBild.classList.add("hidden");
    loginRubrik.classList.add("hidden");
    inloggadVy.classList.remove("hidden");
}

/* Jag använder den inbyggda funktionen loginForm.addEventListener så att koden lyssnar efter vad som ska ske, eftersom min logga ut knapp ligger i en section, så behövde
jag att datorn lyssnar efter klick (när man trycker på knappen med musen).
Igen så väljer jag vad som ska synas och inte synas. 
Jag tömmer också rutorna där man skriver användarnamn och lösenord. Hade jag inte gjort det hade det fortsatt stått Kalle och lösenordet när man loggat ut.
localStorage.removeItem använder jag nu så att datan raderas när man loggar ut. */

logoutKnapp.addEventListener("click", () => {
    inloggadVy.classList.add("hidden");

    loginForm.classList.remove("hidden");
    svampBild.classList.remove("hidden");
    loginRubrik.classList.remove("hidden");

    nameInput.value = "";
    losenordInput.value = "";
    felMeddelande.textContent = "";

    localStorage.removeItem("inloggadAnvandare");

});



