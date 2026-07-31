import Navigation from '../../components/navigation';
import Layout from '../../layouts/default';

export default function Home() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="main-feed">
            <div class="${style["stylebar"]}">
                <div class="${style["search-box"]}">
                    <img width="18px" height="18px" src="../public/icon/search.png" alt="search">
                    <input type="text" class="${style["search-input"]}" placeholder="Hinted search text">
                </div>

                <a action-button="timeline" class="${style["icon-btn"]}">
                    <span class="${style["icon-dot"]}">3</span>
                    <img width="30px" src="../public/icon/bell.png" style="filter: invert(20%);" alt="bell">
                </a>
            </div>

            <div class="${style["feed"]}">
                <div class="${style["onmind"]}">
                    <div class="${style["composer-label"]}">What's on your mind?</div>
                    <div class="${style["composer-box"]}" contenteditable="true" data-placeholder="Write something..."></div>
                </div>

                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../public/profile/James.jpg" alt="James Gabriel Santos">
                        <h2>
                            <span class="${style["post-author"]}">James Gabriel Santos</span>
                            <span class="${style["post-time"]}">2 hours ago</span>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../public/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Just finished a great hike! The view from the peak was incredible. Check it
                        out!</div>
                    <div class="${style["post-photo"]}">
                        <img src="../public/post/mountains.jpg" alt="mountain" srcset="">
                    </div>

                    <div class="${style["post-meta"]}">3 comments</div>
                    <div class="${style["comments"]}">
                        <div class="${style["comment"]}">
                            <div class="${style["comment-avatar"]}">
                                <img src="../public/profile/Xep.jpg" alt="Xep">
                            </div>
                            <div><b>Andrei Luis Lucas</b>I'm a great hike!</div>
                        </div>
                        <div class="${style["comment"]}">
                            <div class="${style["comment-avatar"]}">
                                <img src="../public/profile/Xep.jpg" alt="Xep">
                            </div>
                            <div><b>Andrei Luis Lucas</b>Get it out!</div>
                        </div>
                    </div>
                    <div class="${style["post-actions"]}">
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/like.png" alt="comment">
                                Like
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/chat.png" alt="comment">
                                Comment
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/export.png" alt="share">
                                Share
                            </a>
                        </div>
                    </div>
                </div>

                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../public/profile/Xep.jpg" alt="Andrei Luis Lucas">
                        <h2>
                            <span class="${style["post-author"]}">Andrei Luis Lucas</span>
                            <span class="${style["post-time"]}">2 hours ago</span>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../public/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Cooking a bost enoashing dripe, and can bazard with...</div>
                    <div class="${style["post-actions"]}">
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/like.png" alt="comment">
                                Like
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/chat.png" alt="comment">
                                Comment
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/export.png" alt="share">
                                Share
                            </a>
                        </div>
                    </div>
                </div>

                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../public/profile/dave.png" alt="Dave Lebico">
                        <h2>
                            <span class="${style["post-author"]}">Dave Lebico</span>
                            <span class="${style["post-time"]}">2 hours ago</span>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../public/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Anyone up for badminton this weekend? Court's booked for Saturday morning.
                    </div>
                    <div class="${style["post-actions"]}">
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/like.png" alt="comment">
                                Like
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/chat.png" alt="comment">
                                Comment
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/export.png" alt="share">
                                Share
                            </a>
                        </div>
                    </div>
                </div>

                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../public/profile/Lee.jpg" alt="Dave Lebico">
                        <h2>
                            <span class="${style["post-author"]}">Lee James</span>
                            <span class="${style["post-time"]}">8 hours ago</span>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../public/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Finally finished reading that book everyone's been talking about. Worth the
                        hype!</div>
                    <div class="${style["post-actions"]}">
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/like.png" alt="comment">
                                Like
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/chat.png" alt="comment">
                                Comment
                            </a>
                        </div>
                        <div class="${style["action-btn"]}">
                            <a href="">
                                <img src="../public/icon/export.png" alt="share">
                                Share
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="${style["right-col"]}">
            <div class="${style["recommend-box"]}">
                <div class="${style["recommend-title"]}">Friend Recommendations</div>

                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#E8A5A0" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F2C9A0" />
                        <path d="M18 55C18 25 32 10 50 10C68 10 82 25 82 55C74 40 64 34 50 40C36 34 26 40 18 55Z"
                            fill="#4A2E1E" />
                    </svg>
                    <div class="${style["friend-name"]}">Maria Garcia</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#A5C7E8" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F0C39B" />
                        <path d="M20 46C20 22 33 12 50 12C67 12 80 22 80 46C80 30 68 24 50 24C32 24 20 30 20 46Z"
                            fill="#1B1B1B" />
                    </svg>
                    <div class="${style["friend-name"]}">Ben Chen</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#C7A5E8" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#E8B98C" />
                        <path d="M16 58C16 26 30 8 50 8C70 8 84 26 84 58C78 36 66 46 50 46C34 46 22 36 16 58Z"
                            fill="#2E1B0E" />
                    </svg>
                    <div class="${style["friend-name"]}">Sarah Jones</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#A5E8C0" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#E0A876" />
                        <path d="M20 44C20 20 33 10 50 10C67 10 80 20 80 44C74 32 64 30 50 34C36 30 26 32 20 44Z"
                            fill="#1B1410" />
                    </svg>
                    <div class="${style["friend-name"]}">Michael Brown</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#E8D5A5" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F2CDA3" />
                        <path d="M18 50C18 24 32 10 50 10C68 10 82 24 82 50C82 34 70 22 50 22C30 22 18 34 18 50Z"
                            fill="#6B4423" />
                    </svg>
                    <div class="${style["friend-name"]}">Emily Davis</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
            </div>
        </div>
    `;
}