import Post from "../../components/post/post";
import style_feed from '../../styles/app/feed.module.css';
import Request from '../../core/request';
import { initCommentInteractions } from '../home/home.helper';
import { InfiniteScroll } from '../../helpers/utils/InfiniteScroll';

export default async function Helper(root) {
    const feed = document.createElement('div');
    feed.className = style_feed['feed'];

    const sentinel = document.createElement('div');
    sentinel.style.height = '20px';

    const empty = document.createElement('div');
    empty.textContent = 'No saved posts yet.';
    empty.hidden = true;

    const saved = root.querySelector('#saved');
    saved.append(feed, sentinel, empty);

    const countLabel = root.querySelector('[data-saved-count]');

    // Comments, likes, save/unsave, etc. are delegated on the feed, so this covers every loaded page
    initCommentInteractions(feed);

    new InfiniteScroll({
        container: feed,
        sentinel,
        limit: 10,
        loadMore: async ({ page, limit }) => {
            const result = await Request({
                param: '/saved-posts',
                method: 'GET',
                args: { page, limit },
            });

            const items = Array.isArray(result?.data) ? result.data : [];

            if (page === 1) {
                const count = result?.pagination?.totalItems ?? items.length;
                if (countLabel) countLabel.textContent = `Saved posts (${count})`;
                if (items.length === 0) empty.hidden = false;
            }

            return result;
        },
        renderItems: (savedPosts, container) => {
            container.insertAdjacentHTML(
                'beforeend',
                savedPosts.map((savedPost) => Post(savedPost.post)).join('')
            );
        },
    });
}