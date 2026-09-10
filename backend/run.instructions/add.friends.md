### 1 Send Friend Request (As User A)
Method: POST

URL: http://localhost:3000/api/friends/request/{User_B_Id}
---
### 2 View Pending Requests (As User B)

Method: GET

URL: http://localhost:3000/api/friends/requests/pending

### 3 Accept the Request (As User B)

Method: PATCH

URL: http://localhost:3000/api/friends/accept/{User_A_Id}

### 4 View Friends List (As Either User)

Method: GET

URL: http://localhost:3000/api/friends


### 5 How to test the Delete Friend endpoint in Postman:
Method: DELETE

URL: http://localhost:3000/api/friends/{Friend_User_Id} (Replace {Friend_User_Id} with the UUID of the friend you want to remove)