jest.mock("../Db/db", () => ({
    execute: jest.fn()
}));

const AccountModel = require('./AccountModel');
const db = require('../Db/db');

describe('AccountModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findByUsername', ()=>{
        test('Should return user record if user exist', async ()=>{
            const mockRows = [{id: 1, username: 'testuser'}];
            db.execute.mockResolvedValue([mockRows]);

            const result = await AccountModel.findByUsername('testuser');

            expect(db.execute).toHaveBeenCalledWith(
                'SELECT id FROM users WHERE username = ? LIMIT 1',
                ['testuser']
            );

            expect(result).toEqual(mockRows);
        });

        test('should return empty array if user does not exist', async () => {
            db.execute.mockResolvedValue([[]]);

            const result = await AccountModel.findByUsername('missingusername');

            expect(result).toEqual([[]]);
        });
    });

    describe('InsertAccount', () => {
        test('should return insertid on successfull insertion', async () => {
            const mockResults = [{insertId: 42}];
            db.execute.mockResolvedValue([mockResults]);

            const insertId = await AccountModel.insertAccount('Jhon Doe', 'johndoe', 'hashed_pwd');

            expect(db.execute).toHaveBeenCalledWith(
                'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
                ['Jhon Doe', 'johndoe', 'hashed_pwd']
            );

            expect(insertId).toEqual(mockResults);
        });
    });
})