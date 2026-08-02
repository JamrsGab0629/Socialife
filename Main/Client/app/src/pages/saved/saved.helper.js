import Post from "../../components/post/post";

import style_feed from '../../styles/app/feed.module.css';

export default function Helper( main ){
    const feed = document.createElement('div');
    feed.className = style_feed['feed'];
    document.getElementById('saved').appendChild(feed);

    Post( feed );
}