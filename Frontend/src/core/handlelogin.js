import Fetch from "./fetch";

const PARAM = "/auth/login";

export default async function HandleLogin(form) {
    // console.log("debug.handlelogin", form);
    try {
        const format = {
            email: form.email,
            password: form.pass
        }

        const data = await Fetch({ param: PARAM, args: format })

        return data;
    } catch (error) {
        return { error: error };
    }
}