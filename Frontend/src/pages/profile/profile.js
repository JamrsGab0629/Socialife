import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";

import PicturesHelper from "./profile.pictures.helper";
import MainHelper from "./profile.main.helper";

import style from "./profile.module.css";

export default function Profile(){
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="profile" class="${style['profile']}">
            <section class="${style["banner"]}"></section>

            <section class="${style["profile-header"]}">
                <div class="${style["profile-avatar"]}">
                    <img id="profile-avatar-img" src="/profile/James.jpg" alt="James Gabriel Santos">
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

                    <div class="${style["posts-column"]}" id="posts-column"></div>
                </div>
            </div>

            <div class="${style["tab-content"]}" id="tab-photos">
                <div class="${style["photos-grid"]}" id="master-photos-grid"
                    style="grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
            </div>
        </div>
    `;

    PicturesHelper();
    MainHelper();
}
