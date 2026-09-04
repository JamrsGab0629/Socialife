import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";
import style from "./friends.module.css";
import Helper, { FriendsTemplate } from "./friends.helper";
import Service from "./friends.service";

export default async function Friends() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="friends-main" class="${style['friends-main']}">
            <div class="${style["friends-header"]}">
                <h2>People</h2>
                <div id="active-count" class="${style["active-count"]}">Active now</div>
            </div>

            <div id="friends-grid" class="${style["friends-grid"]}"></div>
        </div>
    `;

    const grid = document.getElementById('friends-grid');
    Helper(grid); // bind click delegation once, before any render

    const friends_data = await Service();
    grid.innerHTML = FriendsTemplate(friends_data); // clean re-render, no duplicate nodes

    const activeCountEl = document.getElementById('active-count');
    if (activeCountEl) {
        activeCountEl.textContent = `Active now (${friends_data.length})`;
    }
}
