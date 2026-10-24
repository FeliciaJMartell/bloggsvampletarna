"use strict";
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
class BlogComment extends BlogEntry {
    constructor(author, text) {
        super(author, text);
    }
}
class BlogPost extends BlogEntry {
    title;
    comments;
    constructor(title, author, text) {
        super(author, text);
        this.title = title;
        this.comments = [];
    }
}
//TS hittar inte HTML knappen, så säger till att det finns en i min HTML fil
const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postText = document.getElementById("postText");
const logoutKnapp = document.getElementById("logoutKnapp");

function getPosts() {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}
function savePosts(posts) {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}
postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const author = localStorage.getItem("inloggadAnvandare");
    if (!author) {
        window.location.href = "index.html";
        return;
    }
    const newPost = new BlogPost(postTitle.value, author, postText.value);
    const posts = getPosts();
    posts.push(newPost);
    savePosts(posts);
    postForm.reset();
});
logoutKnapp.addEventListener("click", () => {
    localStorage.removeItem("inloggadAnvandare");
    window.location.href = "index.html";
});


