const bcrypt = require('bcrypt');

const accountModel = require("../Model/AccountModel");

class AccountService {
    async createAccount(dto) {
        const account = await accountModel.findByUsername(dto.username);

        if (account){
            throw new Error("This username is already taken");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        const insertId = await accountModel.insertAccount(dto.name, dto.username, hashedPassword);

        return {
            success: true,
            message: "Account created successfully",
            accountId: insertId.insertId
        };
    }

    async verifyCredentials(dto) {
        const account = await accountModel.findByUsername(dto.username);

        if (!account) {
            throw new Error("Invalid username or password");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        const isMatch = await bcrypt.compare(hashedPassword, account.password)

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