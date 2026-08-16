services

Responsibility: Application and business logic.

Services perform the actual operations required by the application.

For example:

Create user
Calculate financial summary
Process transaction
Validate business rules

This keeps business logic independent from Express-specific code.



http://localhost:3000/api/auth/register


{
    "username": "james123",
    "email": "james@gmail.com",
    "password": "TestPassword123!",
    "first_name": "James",
    "middle_name": "Gabriel",
    "last_name": "Santos",
    "birth_date": "2005-08-21"
}