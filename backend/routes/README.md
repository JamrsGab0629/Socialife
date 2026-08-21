Routes

Responsibility: Define API endpoints.

Routes determine which controller should handle a request.

Example:

router.get("/", userController.getUsers);
router.post("/", userController.createUser);

Routes should mainly handle URL and HTTP method mapping, not business logic.