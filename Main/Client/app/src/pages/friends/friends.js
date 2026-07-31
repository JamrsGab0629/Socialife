import Navigation from "../../components/navigation";
import Layout from "../../layouts/default";

export default function Friends () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="friends-main">
            <div class="${style["friends-header"]}">
                <h2>People</h2>
                <div class="${style["active-count"]}">Active now (5)</div>
            </div>

            <div class="${style["friends-grid"]}">
                <div class="${style["friend-card"]}" onclick="window.location.href='../messages.html'">
                    <div class="${style["avatar-container"]}">
                        <img src="./public/profile/Xep.jpg" alt="Andrei Luis Lucas">
                        <span class="${style["status-indicator"]} ${style["online"]}"></span>
                    </div>
                    <div class="${style["friend-details"]}">
                        <div class="${style["friend-name"]}">Andrei Luis Lucas</div>
                        <div class="${style["friend-status"]}">Active now</div>
                    </div>
                    <button class="${style["chat-shortcut-btn"]}">Message</button>
                </div>

                <div class="${style["friend-card"]}" onclick="window.location.href='../messages.html'">
                    <div class="${style["avatar-container"]}">
                        <img src="./public/profile/dave.png" alt="Dave Lebico">
                        <span class="${style["status-indicator"]} ${style["online"]}"></span>
                    </div>
                    <div class="${style["friend-details"]}">
                        <div class="${style["friend-name"]}">Dave Lebico</div>
                        <div class="${style["friend-status"]}">Active 5m ago</div>
                    </div>
                    <button class="${style["chat-shortcut-btn"]}">Message</button>
                </div>

                <div class="${style["friend-card"]}" onclick="window.location.href='../messages.html'">
                    <div class="${style["avatar-container"]}">
                        <img src="./public/profile/Philip.jpg" alt="Philip parenas">
                        <span class="${style["status-indicator"]} ${style["online"]}"></span>
                    </div>
                    <div class="${style["friend-details"]}">
                        <div class="${style["friend-name"]}">Philip Parenas</div>
                        <div class="${style["friend-status"]}">Active 1h ago</div>
                    </div>
                    <button class="${style["chat-shortcut-btn"]}">Message</button>
                </div>
            </div>
        </div>
    `;
}