import Notification from "../../components/notification/notification";
import style from "./timeline.module.css";

export default function Helper(){
    const feed = document.createElement("div");
    feed.classList = style["notif-feed"];
    console.log("debug.timeline.h", this);
    this.appendChild(feed);
    
    Notification( feed );
}