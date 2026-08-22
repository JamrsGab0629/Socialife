jest.mock('../Model/AccountModel', () => ({
    findByUsername: jest.fn(),
    insertAccount: jest.fn()
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

const AccountModel = require('../Model/AccountModel');
const bcrypt = require('bcrypt');
const service = require('./AccountServices');

describe('AccountService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('CreateAccount', () => {
        test('should succesfully create an account if username is available', async () => {
            const dto = {name: "John", username: "john_dih", password: "password"};

            AccountModel.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_pwd');
            AccountModel.insertAccount.mockResolvedValue({insertId: 101});

            const result = await service.createAccount(dto);

            expect(result).toEqual({
                success: true,
                message: "Account created successfully",
                accountId: 101
            });

            expect(AccountModel.insertAccount).toHaveBeenCalledWith('John', 'john_dih', 'hashed_pwd');
        });

        test('should throw error if username is taken', async () => {
            const dto = {name: "John", username: "john_dih", password: "password"};

            AccountModel.findByUsername.mockResolvedValue({id: 1, username: 'john_dih'});

            await expect(service.createAccount(dto)).rejects.toThrow("This username is already taken");
        });
    });

    describe('Verify Credentials', () => {
        test("Should succesfully log in", async () =>  {
            const dto = {username: "john_dih", password: "password"};

            AccountModel.findByUsername.mockResolvedValue({id: 1, name: 'John', username: 'john_dih'});
            bcrypt.compare.mockResolvedValue(true);

            const result = await service.verifyCredentials(dto);

            expect(result).toEqual({
                success: true,
                message: "Authentication successful",
                account: {
                    id: 1,
                    name: 'John',
                    username: 'john_dih'
                }
            });
        });

        test("Should call throw Invalid username or passord if user is not found", async () => {
            const dto = {username: "john_dih", password: "password"};

            AccountModel.findByUsername.mockResolvedValue(null);

            await expect(service.verifyCredentials(dto)).rejects.toThrow("Invalid username or password");
        });

        test ("Should call throe invalid username or password if password is incorrect", async () => {
            const dto = {username: "john_dih", password: "password"};

            AccountModel.findByUsername({id: 1, name: "John", username: "john_dih"});

            bcrypt.compare.mockResolvedValue(false);

            await expect(service.verifyCredentials(dto)).rejects.toThrow("Invalid username or password");
        });
    });
});