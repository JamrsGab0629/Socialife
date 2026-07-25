import Navigation from "../components/navigation";
import Layout from "../layouts/default";

export default function Friends () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="friends-main">
            <div class="friends-header">
                <h2>People</h2>
                <div class="active-count">Active now (5)</div>
            </div>

            <div class="friends-grid">
                <div class="friend-card" onclick="window.location.href='../messages.html'">
                    <div class="avatar-container">
                        <img src="../images/profile/Xep.jpg" alt="Andrei Luis Lucas">
                        <span class="status-indicator online"></span>
                    </div>
                    <div class="friend-details">
                        <div class="friend-name">Andrei Luis Lucas</div>
                        <div class="friend-status">Active now</div>
                    </div>
                    <button class="chat-shortcut-btn">Message</button>
                </div>

                <div class="friend-card" onclick="window.location.href='../messages.html'">
                    <div class="avatar-container">
                        <img src="../images/profile/dave.png" alt="Dave Lebico">
                        <span class="status-indicator online"></span>
                    </div>
                    <div class="friend-details">
                        <div class="friend-name">Dave Lebico</div>
                        <div class="friend-status">Active 5m ago</div>
                    </div>
                    <button class="chat-shortcut-btn">Message</button>
                </div>

                <div class="friend-card" onclick="window.location.href='../messages.html'">
                    <div class="avatar-container">
                        <img src="../images/profile/Philip.jpg" alt="Philip parenas">
                        <span class="status-indicator online"></span>
                    </div>
                    <div class="friend-details">
                        <div class="friend-name">Philip Parenas</div>
                        <div class="friend-status">Active 1h ago</div>
                    </div>
                    <button class="chat-shortcut-btn">Message</button>
                </div>
            </div>
        </div>
    `;
}