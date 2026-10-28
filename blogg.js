"use strict";
/*Gör 3 mallar för att skapa objekt.
Varje gång en användare skapar ett inlägg eller en kommentar så skapas ett nytt objekt med hjälp av new längre ner i koden.
Valde att skapa en mall BlogEntry för att slippa skriva samma kod två gånger. Så jag gör extends i de andra två mallarna.
Använder mig även av datum här, men eftersom det inte är något användaren ska skriva in, så behöver jag inte lägga
till det som en parameter.*/
class BlogEntry {
    author;
    date;
    text;
    constructor(author, text) {
        this.author = author;
        this.date = new Date().toLocaleDateString("sv-SE");
        this.text = text;
    }
}
/*Använder mig av extends för att ta med BlogEntrys egenskaper in i BlogComment, använder mig av super()
för att köra förälderns konstruktor.
Men behöver inte ta med någon extra egenskap.*/
class BlogComment extends BlogEntry {
    constructor(author, text) {
        super(author, text);
    }
}
/*Använder mig av extends och super här med. Men lägger till titel och en array för BlogComments. Arrayen är tom från början eftersom
ett nytt blogginlägg inte har några kommentarer.*/
class BlogPost extends BlogEntry {
    title;
    comments;
    constructor(title, author, text) {
        super(author, text);
        this.title = title;
        this.comments = [];
    }
}
//Hämtar element från min HTML fil, men getElementById kan ge null, så "as" berättar för TS att elementen finns och vad för sorts element det är.
const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postText = document.getElementById("postText");
const postsContainer = document.getElementById("posts");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
/*Hämtar användaren som är inloggad, är ingen inloggad blir det null*/
const loggedInUser = localStorage.getItem("inloggadAnvandare");
/* Skapar en init funktion som min kod anropar längst ner i filen och den körs när sidan laddas.
Använder void eftersom init inte returnerar något.
Init säger till att om det inte är någon som är inloggad så döljs formuläret för att skriva blogginlägg,
även logga ut knappen döljs. Men meddelandet om att man behöver logga in för att kunna kommentera/skriva syns.
Den visar också befintliga blogginlägg/kommentarer med hjälp av renderPosts().*/
function init() {
    if (!loggedInUser) {
        postForm.hidden = true;
        logoutButton.hidden = true;
        loginMessage.hidden = false;
    }
    renderPosts();
}
/*Skapar en funktion för att kunna spara användarens inlägg i localStorage. Tar emot en lista med BlogPost-objekt, listan kommer
från koden som anropar savePosts när någon kommenterar eller skriver nytt inlägg.
Använder JSON.stringify för att göra om listan till en text. LocalStorage kan bara spara text, därför använder jag stringify.
 Använder void eftersom funktionen inte returnerar något. */
function savePosts(posts) {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}
/*Skapar en funktion för att kunna hämta användarens blogginlägg, hämtar det från localStorage. Om det finns sparade inlägg så görs
texten om till en lista med JSON.parse och returneras. Finns inget så returneras en tom lista.  */
function getPosts() {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}
/*Skapar en funktion för datum. Funktionen tar emot parametern date: string och skapar time element med document.createElement.
dateTime sätter datetime-attributet som läses av skärmläsare och sökmotorer och sedan använder jag textContent som sätter ut texten på webbsidan.
Funktionen returnerar elementet "time". Värdet kommer ifrån klassen BlogEntry där den sätts i konstruktorn.
Funktionen anropas i renderPosts för både inlägg och kommentarer.
*/
function createTime(date) {
    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = date;
    return time;
}
/*Skapar en funktion för användarens blogginlägg och kommentarer. Den ritar ut alla inlägg och kommentarer på sidan.
Den börjar med att tömma posts-behållaren för att inte visa dubbletter.
Sedan hämtar den sparade inlägg från localStorage med getPosts.*/
function renderPosts() {
    postsContainer.textContent = "";
    const posts = getPosts();
    /*Skapar upp behållare för blogginlägg och kommentarer. Skapar upp element med createElement. ForEach går igenom alla inlägg,
    i varje varv så är post det aktuella blogginlägget och index dess plats i listan.
    Post och index ändras för varje inlägg som loopas igenom.
    Fyller behållarna med användarens input med textContent.
    Lägger till classList.add för att kunna ändra styling i CSS.
    Använder appendChild för att kunna lägga datum efter namnet & anropar då funktion createTime.
    Använder appendChild i commentSection för att lägga in kommentaren i kommentarsdelen.
    */
    posts.forEach((post, index) => {
        const article = document.createElement("article");
        const title = document.createElement("h3");
        title.textContent = post.title;
        const info = document.createElement("p");
        info.classList.add("post-info");
        info.textContent = `${post.author}, `;
        info.appendChild(createTime(post.date));
        const text = document.createElement("p");
        text.textContent = post.text;
        const commentSection = document.createElement("section");
        commentSection.classList.add("comments");
        const commentHeading = document.createElement("h4");
        commentHeading.textContent = "Kommentarer";
        commentSection.appendChild(commentHeading);
        /* Loopar igenom kommentarerna för detta inlägg som finns sparade i localStorage.
        För varje kommentar skapas ett <p> med namn, datum & text som läggs in sist i kommentarsdelen.
        Gör detta så att rätt kommentar hamnar under rätt inlägg.*/
        post.comments.forEach(comment => {
            const commentText = document.createElement("p");
            commentText.textContent = `${comment.author}, `;
            commentText.append(createTime(comment.date), `: ${comment.text}`);
            commentSection.appendChild(commentText);
        });
        /* Gör en if sats som säger "om man är inloggad" så ska detta skapas.
        Skapar upp allt i TS och inte i HTML, därför döljer jag det inte på samma vis som formuläret med blogginlägg.
        Så här skapar jag upp möjligheten till att kommentera, skapar upp element, säger att man måste skriva något för att kunna
        publicera, annars får man felmeddelande. Tar även hjälp av aria-label för skärmuppläsaren.
        Använder mig av append så att kommentarsrutan och knappen hamnar i formulär elementet.*/
        if (loggedInUser) {
            const commentForm = document.createElement("form");
            const commentInput = document.createElement("textarea");
            commentInput.required = true;
            commentInput.setAttribute("aria-label", "Skriv en kommentar");
            const commentButton = document.createElement("button");
            commentButton.type = "submit";
            commentButton.textContent = "Kommentera";
            commentForm.append(commentInput, commentButton);
            /*Skapar upp min eventlyssnare för knappen "kommentera":
             Börjar med att säga till att sidan inte ska laddas om eftersom detta är standard med formulär.
             Hämtar sedan alla inlägg ifall något nytt inlägg har sparats sedan sidan ritades. (vill inte att den nya kommentaren skriver över en annan)
             commenValue = kommentaren som användaren skrivit in (utan mellanslag i början och slutet).
             new BlogComment = skapar den nya kommentaren med den inloggade som författare, datumet sätts automatiskt i dess konstruktor.
             allPosts [index] = sätter rätt kommentar på rätt inlägg, indexet kommer från ForEach loopen och eftersom den lyssnaren
             ligger i loopen så kommer den ihåg rätt index.
             comments.push = lägger den nya kommentaren längst ner på inläggets kommentarslista.
             savePosts = sparar hela listan med den nya kommentaren och lägger in i localStorage som JSON.
             renderPosts = ritar om alla inlägg så att den nya kommentaren syns.*/
            commentForm.addEventListener("submit", (event) => {
                event.preventDefault();
                /*Required används i min HTML samt i renderPosts som säger att man måste skriva något i rutan att kommentera/göra inlägg.
                Men ett mellanslag räknas som "något". trim() tar då bort mellanslag i början och slutet. Vilket gör att
                om man bara skriver ett mellanslag och försöker publicera så kommer inget sparas. */
                const commentValue = commentInput.value.trim();
                if (!commentValue) {
                    return;
                }
                const allPosts = getPosts();
                allPosts[index].comments.push(new BlogComment(loggedInUser, commentValue));
                savePosts(allPosts);
                renderPosts();
            });
            /*Lägger kommentarsformuläret sist i kommentarsdelen.*/
            commentSection.appendChild(commentForm);
        }
        /*Lägger titel, användare, användarens text & kommentarsdelen i elementet article.*/
        article.append(title, info, text, commentSection);
        /*Gör så att det nya inlägget läggs högst upp, använder prepend eftersom att index måste fortsätta stämma så att kommentarerna
        vet vilket inlägg de hör till.*/
        postsContainer.prepend(article);
    });
}
/*Skapar upp min eventlyssnare för blogginlägg, när man trycker på submit så startas denna funktion, men om man inte är inloggad
 så avslutas funktionen med return och inget inlägg skapas.
 Hade egentligen inte behövt min if-sats då formuläret är dolt om man inte är inloggad. Men utan if-satsen så kan
TS klaga på att loggedInUser är null. Så jag visar egentligen TS att värdet finns.
 Sedan är det samma procedur som på kommentarsdelen.
 Skapar nytt BlogPost-objekt, hämtar alla inlägg, lägger till det nya inlägget med posts.push, sparar och ritar sedan om sidan.*/
postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loggedInUser) {
        return;
    }
    /*Använder trim() här med, som säger om titeln eller texten bara innehåller mellanslag spara inget*/
    const titleValue = postTitle.value.trim();
    const textValue = postText.value.trim();
    if (!titleValue || !textValue) {
        return;
    }
    const newPost = new BlogPost(titleValue, loggedInUser, textValue);
    const posts = getPosts();
    posts.push(newPost);
    savePosts(posts);
    renderPosts();
    /*Tömmer alla textfält så man kan skriva nytt inlägg direkt efter man publicerat det första. Utan detta skulle titeln och texten
    stå kvar. Den behövs inte i kommentarsfältet eftersom renderPosts funktionen bygger om allt från början.*/
    postForm.reset();
});
/*Logga ut-knappen, när man trycker på logga ut så tas användaren bort i localStorage och man skickas tillbaka till bloggsidan
som utloggad.*/
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("inloggadAnvandare");
    window.location.href = "blogg.html";
});
/*Anropar init som kör igång allt som ska hända när sidan laddas*/
init();
