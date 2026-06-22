const bcrypt = require('bcrypt');
const db = require('../Db/db'); 
const SigninDto = require('../Dto/SigninDto');
const LoginDto = require('../Dto/LoginDto');

class AccountService {
    
    async createAccount(accountData) {
        const dto = new SigninDto(
            accountData.name, 
            accountData.username, 
            accountData.password, 
            accountData.confirmPass
        );

        const [existingUsers] = await db.execute(
            'SELECT id FROM accounts WHERE username = ? LIMIT 1',
            [dto.username]
        );

        if (existingUsers.length > 0) {
            throw new Error("This username is already taken");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        const [result] = await db.execute(
            'INSERT INTO accounts (name, username, password) VALUES (?, ?, ?)',
            [dto.name, dto.username, hashedPassword]
        );
        
        return { 
            success: true,
            message: "Account created successfully", 
            accountId: result.insertId 
        };
    }

    async verifyCredentials(credentials) {
        const dto = new LoginDto(credentials.username, credentials.password);

        const [accounts] = await db.execute(
            'SELECT id, name, username, password FROM accounts WHERE username = ? LIMIT 1',
            [dto.username]
        );

        if (accounts.length === 0) {
            throw new Error("Invalid username or password");
        }

        const account = accounts[0];

        const isMatch = await bcrypt.compare(dto.password, account.password);
        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        return {
            success: true,
            message: "Authentication successful",
            account: { 
                id: account.id, 
                name: account.name, 
                username: account.username 
            }
        };
    }
}

module.exports = new AccountService();