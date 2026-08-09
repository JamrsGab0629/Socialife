middleware

Responsibility: Handle reusable request-processing logic.

Middleware runs between the incoming request and the final route handler.

Examples:

Rate limiting
Authentication
Validation
Error handling
Logging

Middleware can be registered using:

app.use(middleware);

or applied to specific routes.