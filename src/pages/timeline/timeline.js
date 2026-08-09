import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";
import Helper from "./timeline.helper";

import style from "./timeline.module.css";

export default function Timeline () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="timeline" class="timeline">
            <div class="${style["timeline-topbar"]}">
                <div class="${style["timeline-title"]}">Notifications</div>
            </div>
        </div>
    `;

    Helper.bind(main)();
}