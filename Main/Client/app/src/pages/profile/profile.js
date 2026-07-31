import Navigation from "../../components/navigation";
import Layout from "../../layouts/default";
import style from "./profile.css"

export default function Profile(){
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="profile">
            <section class="${style["banner"]}"></section>

            <section class="${style["profile-header"]}">
                <div class="${style["profile-avatar"]}">
                    <img src="../images/profile/James.jpg" alt="James Gabriel Santos">
                </div>
                <div class="${style["profile-info"]}">
                    <h1>James Gabriel Santos</h1>
                    <div class="${style["friends-count"]}">215 friends</div>
                </div>
                <div class="${style["profile-actions"]}">
                    <button class="${style["btn-primary"]}">
                        Follow
                    </button>
                </div>
            </section>

            <nav class="${style["profile-tabs"]}" id="desktop-tabs">
                <button class="${style["tab"]} ${style["active"]}" role="tab" aria-selected="true" data-tab="all">All</button>
                <button class="${style["tab"]}" role="tab" aria-selected="false" data-tab="photos">Photos</button>
                <button class="${style["tab"]}" role="tab" aria-selected="false" data-tab="settings">Settings</button>
            </nav>

            <div class="${style["tab-content"]} ${style["active"]}" id="tab-all">
                <div class="${style["all-tab-grid"]}">

                    <div class="${style["photos-section"]}">
                        <div class="${style["photos-header"]}">
                            <h3>Photos</h3>
                            <a href="#" id="see-all-photos-lnk">See all photos ></a>
                        </div>
                        <div class="${style["photos-grid"]}" id="all-photos-preview"></div>
                    </div>

                    <div class="${style["posts-column"]}">

                        <div class="${style["post-card"]}">
                            <div class="${style["post-header"]}">
                                <img src="../images/profile/James.jpg" alt="James Gabriel Santos">
                                <h2>
                                    <span class="${style["post-author"]}">James Gabriel Santos</span>
                                    <span class="${style["post-time"]}">2 hours ago</span>
                                </h2>
                                <a class="${style["action-more"]}" href="#"><img src="../images/icon/more.png" alt="more"></a>
                            </div>
                            <div class="${style["post-text"]}">
                                Just finished a great hike! The view from the peak was incredible. Check it out!
                            </div>
                            <div class="${style["post-photo"]}">
                                <img src="../images/post/mountains.jpg" alt="mountain">
                            </div>

                            <div class="${style["post-meta"]}">3 comments</div>
                            <div class="${style["comments"]}">
                                <div class="${style["comment"]}">
                                    <div class="${style["comment-avatar"]}">
                                        <img src="../images/profile/Xep.jpg" alt="Xep">
                                    </div>
                                    <div><b>Andrei Luis Lucas</b>I'm a great hike!</div>
                                </div>
                                <div class="${style["comment"]}">
                                    <div class="${style["comment-avatar"]}">
                                        <img src="../images/profile/Xep.jpg" alt="Xep">
                                    </div>
                                    <div><b>Andrei Luis Lucas</b>Get it out!</div>
                                </div>
                            </div>
                            <div class="${style["post-actions"]}">
                                <div class="${style["action-btn"]}">
                                    <a href="">
                                        <img src="../images/icon/like.png" alt="like">
                                        Like
                                    </a>
                                </div>
                                <div class="${style["action-btn"]}">
                                    <a href="">
                                        <img src="../images/icon/chat.png" alt="comment">
                                        Comment
                                    </a>
                                </div>
                                <div class="${style["action-btn"]}">
                                    <a href="">
                                        <img src="../images/icon/export.png" alt="share">
                                        Share
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="${style["tab-content"]}" id="tab-photos">
                <div class="${style["photos-grid"]}" id="master-photos-grid"
                    style="grid-template-columns: repeat(3, 1fr); gap: 8px;">
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                    <div class="${style["photo-placeholder"]}"><span class="material-symbols-outlined">image</span></div>
                </div>
            </div>

            <div class="${style["tab-content"]}" id="tab-settings">
                <div
                    style="background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #d0d3d9; text-align: center; color: #6c6f76; font-size: 16px;">
                    <span class="material-symbols-outlined"
                        style="font-size: 48px; color: #b0b3b8; display: block; margin-bottom: 12px;">settings</span>
                    Settings page (placeholder)
                </div>
            </div>
        </div>
    `;
}