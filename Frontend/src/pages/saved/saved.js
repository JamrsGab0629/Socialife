import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";

import style from "./saved.module.css"
import Helper from "./saved.helper";

export default async function Saved () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="saved" class="${style['saved']}">
            <div class="${style["saved-header"]}">
                <h2>Saved</h2>
                <div class="${style["saved-count"]}" data-saved-count>Saved posts</div>
            </div>
        </div>
    `;

    await Helper(main);
}
