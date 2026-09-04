import Service from "./notification.service";

import style from "./notification.module.css";

export default async function Notification(root) {
    const data = await Service();

    let template = "";
    
    data.forEach((d) => {
        const auth = d["author"];

        console.log("debug.notif", d["type"]);

        template += `
            <div class="${style["notif-item"]}">
                <div class="${style["notif-avatar-wrap"]}">
                    <img src="${auth["avatar_url"]}" alt="${auth["username"]}">
                    <span class="${style["notif-badge-icon"]} ${style[d['type']]}"></span>
                </div>
                <div class="${style["notif-body"]}">
                    <div class="${style["notif-text"]}"><b>${auth["username"]}</b>${d["message"]}</div>
                    ${d["type"] === "comment" ? `<div class="${style["notif-quote"]}">${d["content"]}</div>` : ``}
                    <div class="${style["notif-time"]}">${d["datetime"]}</div>
                </div>
                ${!d["isRead"] ? `<span class="${style["notif-dot"]}"></span>` : ``}
            </div>
        `
    });

    root.innerHTML += template;
}
