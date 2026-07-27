class content {
   constructor(element) {
        this.element = element;
        this.hydrated = false;
    }

    get imgs() {
        return this.element.querySelectorAll("img[data-src]");
    }

    is_visible() {
        if (this.hydrated) return;

        console.log("Is_visible");

        this.imgs.forEach((img) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        this.hydrated = true;
    }

    is_outside() {
        if (!this.hydrated) return;

        console.log("Is_outside");

        this.imgs.forEach((img) => {
            console.log("chnage_post");
            img.src = "../images/placeholder.webp";
        });
        this.hydrated = false;
    }
}

class lazy_populator {
    constructor(document) {
        this.feed = document.getElementsByClassName("feed")[0];
        this.controller = null;
        this.is_loading = false;
        this.post_index = 0; // will add a feature that fetch data
    }

    async next_batch() {
        // Prevent concurrent batch requests
        if (this.is_loading) return [];

        this.is_loading = true;
        this.controller = new AbortController();

        try {
            const response = await fetch("./feed.json", {
                signal: this.controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Fetching batch failed. Status: ${response.status}`);
            }

            // Build DOM elements directly so we can pass references back
            const data = await response.json();
            const createdElements = [];
            const fragment = document.createDocumentFragment();

            // Use Object.entries() to iterate over your feed object
            Object.entries(data).forEach(([post_id, postData]) => {
                const card = document.createElement("div");
                card.className = "post-card";
                card.id = post_id;

                card.innerHTML = `
                        <div class="post-header">
                            <img src="../images/profile/James.jpg" alt="James Gabriel Santos">
                            <h2>
                                <span class="post-author">James Gabriel Santos</span>
                                <span class="post-time">2 hours ago</span>
                            </h2>
                            <a class="action-more" href="#"><img src="../images/icon/more.png" alt="more"></a>
                        </div>

                        <div class="post-text">Just finished a great hike! The view from the peak was incredible. Check it out!</div>

                        <div class="post-photo">
                            <img src="../images/placeholder.webp" alt="mountain" data-src="${postData.img}">
                        </div>

                        <div class="post-meta">3 comments</div>
                        <div class="comments">
                            <div class="comment">
                                <div class="comment-avatar">
                                    <img src="../images/profile/Xep.jpg" alt="Xep">
                                </div>
                                <div><b>Andrei Luis Lucas</b>I'm a great hike!</div>
                            </div>
                            <div class="comment">
                                <div class="comment-avatar">
                                    <img src="../images/profile/Xep.jpg" alt="Xep">
                                </div>
                                <div><b>Andrei Luis Lucas</b>Get it out!</div>
                            </div>
                        </div>
                        <div class="post-actions">
                            <div class="action-btn">
                                <a href="">
                                    <img src="../images/icon/like.png" alt="comment">
                                    Like
                                </a>
                            </div>
                            <div class="action-btn">
                                <a href="">
                                    <img src="../images/icon/chat.png" alt="comment">
                                    Comment
                                </a>
                            </div>
                            <div class="action-btn">
                                <a href="">
                                    <img src="../images/icon/export.png" alt="share">
                                    Share
                                </a>
                            </div>
                        </div> 
                    `;

                fragment.appendChild(card);
                createdElements.push(card);
            });

            if (this.feed) {
                this.feed.appendChild(fragment);
            }

            return createdElements;
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Fetch request aborted");
            } else {
                console.error(error);
                if (this.feed) {
                    this.feed.insertAdjacentHTML(
                        "beforeend",
                        '<h1 style="color: red;">ERROR LOADING POSTS</h1>',
                    );
                }
            }
            return [];
        } finally {
            this.is_loading = false;
            this.controller = null;
        }
    }

    abort_next_fetch() {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { content, lazy_populator };
}
