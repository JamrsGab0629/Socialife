import Fetch from "./fetch";

describe("/auth/verify-otp", () => {
    const PARAM = "/auth/veirfy-otp";

    it("should throw error for empty args", () => {
        const result = Fetch({ param: PARAM })
        expect(result).toThrow();
    });
});
