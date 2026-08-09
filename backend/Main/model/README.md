model

Responsibility: Handle data access.

Models communicate with the database and perform database operations.

Examples:

Get users
Get user by ID
Create user
Update user
Delete user

Example:

const getUserById = async (id) => {
    // Database query
};

The model is responsible for how data is retrieved or stored, while the service is responsible for what the application does with that data.