Postman Testing Instructions
To test your protected endpoints (like Saved Posts) using Postman with your HTTP-only cookie setup:

### Authenticate (Log In):

Method: POST

URL: http://localhost:3000/api/auth/login

Body: Send your user credentials (email/password) as JSON.

```json
{
    "email":"james@gmail.com",
    "password":"hotdog12345"

}


```
Note: Postman will automatically capture and store the returned token cookie in its Cookie Jar (check the "Cookies" link right below the Send button).
---

#### Bookmark a Post (Save):

Method: POST

URL: http://localhost:3000/api/saved-posts/{postId} (Replace {postId} with a valid post UUID)

Headers/Body: None needed (Postman sends the cookie automatically).

---

### Fetch Your Saved Posts Feed:

Method: GET

URL: http://localhost:3000/api/saved-posts?page=1&limit=10

Expected Result: Returns a paginated list of your bookmarked posts with joined post data and metadata.

---

Remove a Bookmark (Unsave):

Method: DELETE

URL: http://localhost:3000/api/saved-posts/{postId}

