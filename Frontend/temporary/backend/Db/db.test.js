const db = require("./db");

describe("DB", () => {
    afterAll(async () => {
        await db.execute("DELETE FROM `social_media`.`accounts` WHERE username LIKE 'test%'");
    })
    describe("Select", () => {
        it("should return a spacific data if user exist", async () => {
            const username = "gabriel2026";

            const [result] = await db.execute(
                "SELECT id FROM `social_media`. `accounts` user WHERE username = ? LIMIT 1",
                [username]
            );

            expect(result).toBeDefined();
            expect(result).toEqual([{id: 1}]);
        });

        it("should return nothing if user does not exixt", async () => {
            const username = "xep1234";

            const [result] = await db.execute(
                "SELECT id FROM `social_media`. `accounts` user WHERE username = ? LIMIT 1",
                [username]
            );

            expect(result).toBeDefined();
            expect(result).toEqual([]);
        });
    });

    describe("Insert", () => {
        it("should return an insertId if succesful", async () => {
            const name = "test";
            const username = "test_test";
            const password = "test_pwd_hashed";

            const [result] = await db.execute(
               // dito may error kanina
"INSERT INTO `social_media`.`accounts` (name, username, password)  VALUES ( ? , ? , ? )",
                [name, username, password]
            );

            expect(result).toBeDefined();
            expect(result.insertId).toBeGreaterThan(0);
        });

        it("should return code: '23505' if unsuccesful", async () => {
            const name = "test2";
            const username = "duplicate_user_test";
            const password = "test2_pwd_hashed";

            try {
                const [result] = await db.execute(
                    "INSERT INTO `social_media` . `accounts` (name, username, password)  VALUES ( ? , ? , ? )",
                    [name, username, password]
                );
            } catch (error){
                console.error(error);
            }

            try{
                const [result] = await db.execute(
                    "INSERT INTO `social_media` . `accounts` (name, username, password)  VALUES ( ? , ? , ? )",
                    [name, username, password]
                );
            } catch (error){
                expect(error).toBeDefined();
                expect(error.errno).toBe(1062);
                expect(error.code).toBe('ER_DUP_ENTRY');
            }
        });
    });
});
