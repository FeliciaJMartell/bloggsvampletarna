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
från koden som anropas när någon kommenterar eller skriva nytt inlägg.
Använder JSON.stringify för att göra om listan till en text. LocalStorage kan bara spara text, därför använder jag stringfy.
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
DateTime sätter datetime-attributet som läses av skärmläsare och sökmotorer och sedan använder jag textcontent som sätter ut texten på webbsidan.
Funktionen retunerar elementet "time". Värdet kommer ifrån klassen BlogEntry där den sätts i konstruktorn.
Funktionen anropas i renderPost för både inlägg och kommentarer.
*/
function createTime(date) {
    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = date;
    return time;
}
/*Skapar en funktion för användarens blogginlägg och kommentarer. Den ritar ut alla inlägg och kommentarer på sidan.
Den börjar med att tömma posts behållaren för att inte visa dubletter.
Sedan hämtar den sparade inlägg från localStorage med getPosts.*/
function renderPosts() {
    postsContainer.textContent = "";
    const posts = getPosts();
    /*Skapar upp behållare för blogginlägg och kommentarer. Skapar upp element med createElement. ForEach går igenom alla inlägg,
    i varje varv så post det aktuella blogginlägget och index dess plats i listan.
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
        info.textContent = post.author + ", ";
        info.appendChild(createTime(post.date));
        const text = document.createElement("p");
        text.textContent = post.text;
        const commentSection = document.createElement("section");
        commentSection.classList.add("comments");
        const commentHeading = document.createElement("h4");
        commentHeading.textContent = "Kommentarer";
        commentSection.appendChild(commentHeading);
        /* Loopar igenom kommentarerna för detta inlägget som finns sparade i localStorage.
        För varje kommentar skapas ett <p> med namn, datum & text som läggs in sist i kommentarsdelen.
        Gör detta så att rätt kommentar hamnar under rätt inlägg.*/
        post.comments.forEach(comment => {
            const commentText = document.createElement("p");
            commentText.textContent = comment.author + ", ";
            commentText.append(createTime(comment.date), ": " + comment.text);
            commentSection.appendChild(commentText);
        });
        /* Gör en if sats som säger "om man är inloggad" så ska detta synas. Skapar upp allt i TS och inte i HTML, därför döljer
        jag det inte på samma vis som formuläret med blogginlägg.
        Så här skapar jag upp möjligheten till att kommentera, skapar upp element, säger att man måste skriva något för att kunna
        publicera, annars får man felmeddelande.
        */
        if (loggedInUser) {
            const commentForm = document.createElement("form");
            const commentInput = document.createElement("textarea");
            commentInput.required = true;
            commentInput.rows = 1;
            commentInput.setAttribute("aria-label", "Skriv en kommentar");
            const commentButton = document.createElement("button");
            commentButton.type = "submit";
            commentButton.textContent = "Kommentera";
            commentForm.append(commentInput, commentButton);
            commentForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const allPosts = getPosts();
                allPosts[index].comments.push(new BlogComment(loggedInUser, commentInput.value));
                savePosts(allPosts);
                renderPosts();
            });
            commentSection.appendChild(commentForm);
        }
        article.append(title, info, text, commentSection);
        postsContainer.prepend(article);
    });
}
postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loggedInUser) {
        return;
    }
    const newPost = new BlogPost(postTitle.value, loggedInUser, postText.value);
    const posts = getPosts();
    posts.push(newPost);
    savePosts(posts);
    renderPosts();
    postForm.reset();
});
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("inloggadAnvandare");
    window.location.href = "blogg.html";
});
init();
