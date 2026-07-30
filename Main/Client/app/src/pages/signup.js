import Auth_Brand from "../components/auth-brand";
import Final from "../components/signup/final";
import Initial from "../components/signup/initial";
import Verify from "../components/signup/verify";
import Auth from "../layouts/auth";

export default function Signup(params) {
    const { aside, main } = Auth(this.root);
    Auth_Brand(aside);

    const counter = Number(params?.id) || 1;

    if (counter === 1) Initial(main);
    else if (counter === 2) Verify(main);
    else if (counter === 3) Final(main);
}