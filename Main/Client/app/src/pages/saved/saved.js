import Navigation from "../../components/navigation";
import Layout from "../../layouts/default";
import style from "./saved.modules.css";
import style from ""
export default function Saved () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="saved" class="saved">
            <div class="${style["saved-header"]}">
                <h2>Saved</h2>
                <div class="${style["saved-count"]}">Saved posts (2)</div>
            </div>

            <div class="${style["feed"]}">
                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../images/profile/dave.png" alt="Dave Profile" class="${style["profile-img"]}">
                        <h2>
                            <div class="${style["post-author"]}">Dave Darryl Lebico</div>
                            <div class="${style["post-time"]}">Saved yesterday</div>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../images/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Pack ohh meme vice ang dating.</div>
                    <div class="${style["post-photo"]}">
                        <img src="../images/post/dave.jpg" alt="Saved Post Content" class="${style["post-photo"]}">
                    </div>
                </div>

                <div class="${style["post-card"]}">
                    <div class="${style["post-header"]}">
                        <img src="../images/profile/lee.jpg" alt="Lee Profile" class="${style["profile-img"]}">
                        <h2>
                            <div class="${style["post-author"]}">Lee James Benigno</div>
                            <div class="${style["post-time"]}">Saved 3 days ago</div>
                        </h2>
                        <a class="${style["action-more"]}" href="#"><img src="../images/icon/more.png" alt="more"></a>
                    </div>
                    <div class="${style["post-text"]}">Dave mah loves.</div>
                    <div class="${style["post-photo"]}">
                        <img src="../images/post/lee.jpg" alt="Saved Post Content" class="${style["post-photo"]}">
                    </div>
                </div>
            </div>
        </div>
    `;
}