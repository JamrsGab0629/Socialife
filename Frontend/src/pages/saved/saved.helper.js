import Post from "../../components/post/post";
import style_feed from '../../styles/app/feed.module.css';
import Request from '../../core/request';
import { initCommentInteractions } from '../home/home.helper';

export default async function Helper(root){
    const feed = document.createElement('div');
    feed.className = style_feed['feed'];
    root.querySelector('#saved').appendChild(feed);

    feed.textContent = 'Loading saved posts...';

    try {
        const result = await Request({
            param: '/saved-posts',
            method: 'GET',
            args: { page: 1, limit: 20 },
        });
        const savedPosts = Array.isArray(result?.data) ? result.data : [];
        const count = result?.pagination?.totalItems ?? savedPosts.length;
        const countLabel = root.querySelector('[data-saved-count]');

        if (countLabel) {
            countLabel.textContent = `Saved posts (${count})`;
        }

        if (!savedPosts.length) {
            feed.textContent = 'No saved posts yet.';
            return;
        }

        feed.innerHTML = savedPosts
            .map((savedPost) => Post(savedPost.post))
            .join('');

        initCommentInteractions(feed);
    } catch (error) {
        console.error('Failed to load saved posts:', error);
        feed.textContent = 'Unable to load saved posts. Please try again.';
    }
}
