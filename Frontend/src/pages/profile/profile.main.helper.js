import Post from "../../components/post/post";

export const Helper = () => {
    const root = document.getElementById('posts-column');
    if (!root) return;

    Post(root);
}

export default Helper;
