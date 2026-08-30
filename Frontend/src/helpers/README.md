# THis is for api endpoints

# Status? Created

## POST /api/auth/login
>input 
>    email, password
>output
>    message, user -password, token
---

## POST /api/auth/signup
>input
>    username, email, password
>output
>    message
---

## POST /api/auth/verify-otp
>input
>    email, otp
>output
>    message
---

## POST /api/auth/resend-otp
>input
>    email
>output
>    message
---

## POST /api/auth/register
>input
>    email, firstname, lastname, birthday
>output
>    message
---

## GET /api/auth/state
>input
>    email
>output
>    message, is_actived, is_verified, is_complete
---

# Status? In Production

## GET /api/admin/get-users
> input
>    
>output
>    [users -password]
---

## POST /api/content/publish-post
>input 
>    user_id, caption, content
>output
>    message
---

## PUST /api/content/unpublish-post
>input
>   post_id
>output
>   message
---

## PUT /api/content/modify-post
>input
>   post_id, caption
>output
>   message
---

## POST /api/content/reshare-post
>Input
>   author_id, post_id
>output
>   message
---

## PUT /api/content/unshare-post
>input
>   authro_id, post_id
>output
>   message
---

## POST /api/photos/publish-photo-data
>input
>   post_id, user_id, url
>output
>   message
---

## GET /api/photos/fetch-photos-from-post
>input
>   post_id
>output
>   message, [url]
---

## GET /api/content/fetch-photos-from-user
>input
>   user_id
>output
>   message, [url]
---

## GET /api/content/fetch-posts
>input
>    user_id
>output
>    [post]
---

## GET /api/content/fetch-post
>input
>    user_id
>output
>    post
---

## POST /api/content/publish-comment
>input 
>    post_id, user_id, comment
>output
>    message
---

## GET /api/content/fetch-comments
>input
>    post_id
>outpput
>    [comments]
---

## POST /api/continent/publish-like
>input
>    post_id, user_id
>output
>    message
---

## PUT /api/content/unpublish-like
>input
>    post_id, user_id
>output
>    message
---

## POST /api/timeline/publish-notifications
>Input
>   user_id, author_id, type, content
>Output
>   message
---

## GET /api/timeline/fetch-posts
>Input
>   user_id
>Output
>   message, [timeline]
---

## POST /api/friendship/publish-freind-request
>Input
>   requester_id, addressee_id
>Output
>   message
---

## PUT /api/friendhsip/unpublish-friend-request
>Input
>   requester_id, addressee_id
>Output
>   message
---

## PUT /api/friendship/decline-friend-request
>Input
>   addressee_id
>Output
>   message
---

## PUT /api/friendship/accept-friend-request
>Input
>   addressee_id
>Output
>   message
---

## GET /api/users/fetch-user
>Input
>   username
>Output
>   message, user_id, first_name, last_name, birthdate
---

## PUT /api/users/modify-profile-picture
>Input
>   user_id, url
>Output
>   message
---

## GET /api/users/fetch-friends
>Input
>   user_id
>Output
>   message, [requester_id]
---

## POST /api/session/crate-session
>Input
>   user_id, token, expires_at
>Output
>   message
---

## PUT /api/session/update-session
>Input
>   user_id, token, expires_at
>Output
>   message
---

## DELETE /api/session/delete-session
>Input
>   user_id
>Output
>   Message
---

# WILL BE STORED LOCALLY TO USER

## POST /api/users/saved-post
input
    post_id
output
    message
---

## GET /api/users/fetch-saves
input
    
output
    [post_id]
---
 