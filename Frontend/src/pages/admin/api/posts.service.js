// posts.service.js — mocked network layer for the Posts view.
const MOCK_POSTS = [
  { id: 1, author: "Maria Santos", handle: "@mariasantos", content: "Sunset views from the rooftop tonight, can't get over this city skyline...", created: "May 29, 2025", status: "active" },
  { id: 2, author: "John Dela Cruz", handle: "@johndelacruz", content: "New personal record at the gym this morning. Consistency really pay...", created: "May 28, 2025", status: "active" },
  { id: 3, author: "spam_account", handle: "@spam_account", content: "CLICK HERE for free followers instantly, limited time offer!!!", created: "May 28, 2025", status: "removed" },
  { id: 4, author: "Alexa Rivera", handle: "@alexarivera", content: "Finally finished the mural downtown, three weeks of work paid off.", created: "May 27, 2025", status: "active" },
  { id: 5, author: "Mark Reyes", handle: "@markreyes", content: "Unpopular opinion but I think this new update broke more than it fixed.", created: "May 26, 2025", status: "active" },
  { id: 6, author: "Diane Lopez", handle: "@dianelopez", content: "Weekend hike turned into an impromptu picnic. Ten out of ten.", created: "May 25, 2025", status: "active" },
  { id: 7, author: "fake_profile", handle: "@fake_profile", content: "Reposted content flagged by multiple users for misleading claims.", created: "May 24, 2025", status: "removed" },
  { id: 8, author: "Carlo Villanueva", handle: "@carlov", content: "Coffee shop recommendations for a quiet Sunday, drop them below.", created: "May 23, 2025", status: "active" },
];

export function fetch_posts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_POSTS)), 400);
  });
}

export function set_post_status(id, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = MOCK_POSTS.find((p) => p.id === id);
      if (!post) return reject(new Error("Post not found"));
      post.status = status;
      resolve(structuredClone(post));
    }, 300);
  });
}
