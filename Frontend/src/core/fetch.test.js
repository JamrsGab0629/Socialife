import { describe, it, expect, toThrow, toBe } from "vitest";
import Fetch from "./fetch";

describe("/auth/verify-otp", () => {
    const PARAM = "/auth/verify-otp";

    it("should throw error for empty param", async () => {
        expect(async () => { await Fetch({}) }).rejects.toThrow("Complete parameter is needed");
    });

    it("should throw for no matching email", async () => {
        expect(async () => { await Fetch({ param: PARAM, args: { email: "EXAMPLE@email.com", otp: "123456" } }) }).rejects.toThrow("Error fetching: No pending registration found or session expired. status: 400")
    });
});

describe("/auth/login", () => {
    const PARAM = "/auth/login";

    it("should throw error for empy email or password", () => {
        expect(async () => { await Fetch({ param: PARAM, args: {} }) }).rejects.toThrow();
    })

    it("should throw neither email or passwords is correct", () => {
        expect(async () => { await Fetch({ param: PARAM, args: { email: "patlovesjen@gmail.com", password: "1234567890" } }) }).rejects.toThrow("Error fetching: Invalid email or password. status: 400");
    })

    it("should accept", async () => {
        const result = {
            "message": "Login successful!",
            "user": {
                "user_id": "680a261d-13fb-4640-b0bd-694338cf066f",
                "role": "user",
                "auth": "local",
                "username": "XeP",
                "first_name": "Xep",
                "middle_name": null,
                "last_name": "Piliko",
                "birth_date": "2000-01-01",
                "email": "patlovesjen11@gmail.com",
                "createdAt": "2026-08-18T10:31:17.175Z",
                "updatedAt": "2026-08-18T10:31:17.175Z"
            }
        }

        const response = await Fetch({ 
            param: PARAM, 
            args: { email: "patlovesjen11@gmail.com", password: "HelloWorld" }
        });

        expect(response).toStrictEqual(result);
    })
});
