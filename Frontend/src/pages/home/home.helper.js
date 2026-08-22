import Post from "../../components/post/post";

import style from "./home.module.css";
import style_feed from '../../styles/app/feed.module.css';

export default function Helper(){
    const feed = document.createElement('div');
    feed.className = style_feed['feed'];
    feed.innerHTML = `
        <div class="${style['onmind']}">
            <div class="${style['composer-label']}">What's on your mind?</div>
            <div class="${style['composer-box']}" contenteditable="true" data-placeholder="Write something..."></div>
        </div>
    `
    document.getElementById('main-feed').appendChild(feed);
    
    Post(feed);
}