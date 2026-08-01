const db = require('../Db/db')
const bcrypt = require('bcrypt')

class AccountModel {
    async findByUsername(username) {
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE username = ? LIMIT 1',
            [username]
        );

        return existingUsers.length > 0 ? existingUsers[0] : null;
    }

    async insertAccount(name, username, hashedPassword) {
        const [result] = await db.execute(
            'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
            [name, username, hashedPassword]
        );

        return result[0];
    }
}

module.exports = new AccountModel();