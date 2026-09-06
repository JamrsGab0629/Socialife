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
