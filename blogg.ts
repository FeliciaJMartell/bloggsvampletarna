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

//TS hittar inte HTML knappen, så säger till att det finns en i min HTML fil
const postForm = document.getElementById("postForm") as HTMLFormElement;
const postTitle = document.getElementById("postTitle") as HTMLInputElement;
const postText = document.getElementById("postText") as HTMLTextAreaElement;
const postsContainer = document.getElementById("posts") as HTMLDivElement;

const logoutKnapp = document.getElementById("logoutKnapp") as HTMLButtonElement;


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

function renderPosts(): void {
    postsContainer.textContent = "";
}

logoutKnapp.addEventListener("click", () => {
    localStorage.removeItem("inloggadAnvandare");
    window.location.href = "index.html";

});



