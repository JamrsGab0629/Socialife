// posts.js
import style from "./posts.module.css";
import style_btn from "../../../styles/admin/btn.module.css";
import style_badge from "../../../styles/admin/badge.module.css";
import { init_posts_view } from "./posts.helper";
import MainLayout from "../../../layouts/admin/main";
import Navigation from "../../../components/admin.dashboard/navigation/navigation";

export default function Posts() {
  const { navigation, main } = MainLayout(this.root);
  Navigation(navigation, 'posts');

  main.innerHTML = `
    <div class="${style["page-header"]}">
      <h1>Posts</h1>
      <p>Review and moderate posts across Socialife</p>
    </div>
    <div class="${style["card"]}">
      <div class="${style["toolbar"]}">
        <input type="text" id="postSearch" class="${style["search-input"]}" placeholder="Search posts by author or content" />
        <select id="postStatusFilter" class="${style["filter-select"]}">
          <option value="all">All posts</option>
          <option value="active">Active</option>
          <option value="removed">Removed</option>
        </select>
      </div>
      <table class="${style["table"]}">
        <thead>
          <tr><th>Author</th><th>Content</th><th>Created</th><th>Status</th><th></th></tr>
        </thead>
        <tbody id="postsTableBody"></tbody>
      </table>
      <div class="${style["pagination"]}">
        <span id="postsCount"></span>
      </div>
    </div>
  `;

  init_posts_view({ style, style_btn, style_badge });
}
