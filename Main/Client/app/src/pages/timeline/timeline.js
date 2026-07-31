import Navigation from "../../components/navigation";
import Layout from "../../layouts/default";

export default function Timeline () {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="timeline">
            <div class="${style["timeline-topbar"]}">
                <div class="${style["timeline-title"]}">Notifications</div>
            </div>

            <div class="${style["notif-feed"]}">

                <div class="${style["notif-group-label"]}">New</div>

                <div class="${style["notif-item"]} ${style["unread"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Dave.png" alt="Dave Lebico">
                        <span class="${style["notif-badge-icon"]} ${style["commented"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Dave Darryl Lebico</b> commented on your post</div>
                        <div class="${style["notif-quote"]}">"pa pwet yarn."</div>
                        <div class="${style["notif-time"]}">3 minutes ago</div>
                    </div>
                    <span class="${style["notif-dot"]}"></span>
                </div>

                <div class="${style["notif-item"]} ${style["unread"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Lee.jpg" alt="Lee Benigno">
                        <span class="${style["notif-badge-icon"]} ${style["liked"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Lee James Benigno</b> liked your post</div>
                        <div class="${style["notif-time"]}">12 minutes ago</div>
                    </div>
                    <span class="${style["notif-dot"]}"></span>
                </div>

                <div class="${style["notif-group-label"]}">Earlier</div>

                <div class="${style["notif-item"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Xep.jpg" alt="Xep">
                        <span class="${style["notif-badge-icon"]} ${style["commented"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Andrei Luis Lucas</b> commented on your post</div>
                        <div class="${style["notif-quote"]}">"SYBAU blud"</div>
                        <div class="${style["notif-time"]}">2 hours ago</div>
                    </div>
                </div>

                <div class="${style["notif-item"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Philip.jpg" alt="Philip Parenas">
                        <span class="${style["notif-badge-icon"]} ${style["liked"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Philip Parenas</b> liked your comment</div>
                        <div class="${style["notif-time"]}">6 hours ago</div>
                    </div>
                </div>

                <div class="${style["notif-item"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Lee.jpg" alt="Lee Benigno">
                        <span class="${style["notif-badge-icon"]} ${style["commented"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Lee James Benigno</b> commented on your photo</div>
                        <div class="${style["notif-quote"]}">"Gan is gay"</div>
                        <div class="${style["notif-time"]}">Yesterday</div>
                    </div>
                </div>

                <div class="${style["notif-item"]}">
                    <div class="${style["notif-avatar-wrap"]}">
                        <img src="../images/profile/Nathan.jpg" alt="">
                        <span class="${style["notif-badge-icon"]} ${style["liked"]}"></span>
                    </div>
                    <div class="${style["notif-body"]}">
                        <div class="${style["notif-text"]}"><b>Julian Cagadas</b> liked your post</div>
                        <div class="${style["notif-time"]}">2 days ago</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}