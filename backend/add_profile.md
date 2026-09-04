Profile Picture Upload API Documentation
Endpoint Overview
Route: PUT /api/profiles/picture

Access Control: Protected route (requires an active authentication cookie from a prior login request).

Storage Provider: Cloudinary integration for cloud media hosting.

Request Body Specifications
Content Type: multipart/form-data

Form Field Key: image (must match the backend Multer single-file middleware configuration).

Accepted Formats: Standard image file formats including PNG, JPG, and JPEG.

How to Test in Postman
Set the HTTP method dropdown to PUT and paste your local server endpoint URL (http://localhost:3000/api/profiles/picture).

Go to the Body tab and select the form-data option.

Hover over the key type dropdown, change it from Text to File, and type image into the key text box.

Click Select Files in the value column to attach an image from your local file explorer, then click Send.

Expected Response
Success Status: 200 OK

Response Payload: Returns a JSON object containing confirmation along with the updated profile_url property pointing to the uploaded asset on Cloudinary.