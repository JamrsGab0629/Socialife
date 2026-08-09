controllers

Responsibility: Handle HTTP requests and responses.

Controllers receive the request, call the appropriate service, and return a response.

Request
   ↓
Controller
   ↓
Service
   ↓
Response

Controllers should not contain large amounts of business logic.