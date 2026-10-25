class BlogEntry {
    author: string;
    date: string;
    text: string;
    constructor(author: string, text: string) {
        this.author = author;
        this.date = new Date().toLocaleDateString("sv-SE");
        this.text = text;
    }
}

class BlogComment extends BlogEntry {
    constructor(author: string, text: string) {
        super(author, text);
    }
}

class BlogPost extends BlogEntry {
    title: string;
    comments: BlogComment[];

    constructor(title: string, author: string, text: string) {
        super(author, text);
        this.title = title;
        this.comments = [];
    }
}

//Hämtar element från min HTML fil, men getElementById kan ge null, så "as" berättar för TS att elementen finns och vad för sorts element det är.
const postForm = document.getElementById("postForm") as HTMLFormElement;
const postTitle = document.getElementById("postTitle") as HTMLInputElement;
const postText = document.getElementById("postText") as HTMLTextAreaElement;
const postsContainer = document.getElementById("posts") as HTMLDivElement;
const loginMessage = document.getElementById("loginMessage") as HTMLParagraphElement;
const logoutButton = document.getElementById("logoutButton") as HTMLButtonElement;

const loggedInUser = localStorage.getItem("inloggadAnvandare");

if (!loggedInUser) {
    postForm.hidden = true;
    logoutButton.hidden = true;
    loginMessage.hidden = false;
}

function getPosts(): BlogPost[] {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

function savePosts(posts: BlogPost[]): void {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}

function createTime(date: string): HTMLTimeElement {
    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = date;
    return time;
}

function renderPosts(): void {
    postsContainer.textContent = "";
    const posts = getPosts();

    posts.forEach((post, index) => {
        const article = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = post.title;

        const info = document.createElement("p");
        info.textContent = post.author + ", ";
        info.appendChild(createTime(post.date));

        const text = document.createElement("p");
        text.textContent = post.text;

        const commentSection = document.createElement("section");
        commentSection.classList.add("comments");

        const commentHeading = document.createElement("h4");
        commentHeading.textContent = "Kommentarer";
        commentSection.appendChild(commentHeading);

        post.comments.forEach(comment => {
            const commentText = document.createElement("p");
            commentText.textContent = comment.author + ", ";
            commentText.append(createTime(comment.date), ": " + comment.text);
            commentSection.appendChild(commentText);
        });

        if (loggedInUser) {
            const commentForm = document.createElement("form");

            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.required = true;
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
    window.location.href = "index.html";

});

renderPosts();



