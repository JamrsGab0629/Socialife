### ​1. Create a Post

​URL: POST /api/posts 
​Authentication: Required (Cookie-based)

​Content-Type: multipart/form-data 

​Request Body Fields: 

​caption (Text): Short title or summary (e.g., "Beautiful sunset!")
​content (Text): Main body text or description of the post.

​image (File, Optional): An image file (JPG, PNG) to upload via Cloudinary. If omitted, a text-only post is created.

​Postman Setup:

​Method: POST
​URL: http://localhost:3000/api/posts
​Body Tab -> Select form-data 
​Add keys: caption, content, and optionally image (set type to File). 

​---

### 2. Get Home Feed (All Active Posts)

​URL: GET /api/posts 
​Authentication: Required

Hybrid loading (lazy + eager)
​Query Parameters (Optional): 

​page (number, default: 1) - Page number for pagination. 
​limit (number, default: 10) - Number of posts per page. 

### 3. Get User Profile Feed
​URL: GET /api/posts/user/:userId

​Authentication: Required
​Description: Fetches only the active posts belonging to the specified user.

​Query Parameters (Optional):
​page (number)
​limit (number)

### 4. Deactivate (Soft Delete) a Post
​URL: PATCH /api/posts/:postId/deactivate
​
Authentication: Required
​Description: Sets is_active to false on the post to preserve data integrity without permanent deletion.

### 5.Share a Post
Allows an authenticated user to share an existing active post with a custom caption.

Method: POST

Endpoint URL: http://localhost:3000/api/posts/:postId/share

Required URL Parameter:

postId (string) — Post ID of the target post you want to share.

Headers:

Content-Type: application/json

Body (raw JSON):

```json

{
  "caption": "Check this out!"
}
```

### 6.Get Unified Profile Feed
Fetches a chronologically sorted, mixed timeline of original posts and shared posts.

Method: GET

Endpoint URL: http://localhost:3000/api/profiles/:userId/feed?page=1&limit=10

Required URL Parameter:

userId (string) — User ID of the profile feed owner.

Query Parameters (Optional):

page (number)

limit (number)


### 7. Get Friend Stats (Lightweight Profile Stats)
Quickly fetches a targeted, minimal payload containing just the user's name and friend count.

Method: GET

Endpoint URL: http://localhost:3000/api/profiles/:userId/friend-stats

Required URL Parameter:

userId (string) — User ID of the profile stats you want to fetch.