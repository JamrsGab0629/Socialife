import Auth_Brand from "../../components/auth-brand/auth-brand";
import Final from "../../components/signup/final/final";
import Initial from "../../components/signup/initial/initial";
import Verify from "../../components/signup/verify/verify";
import Auth from "../../layouts/auth/auth";

export default function Signup( params ) {
    const { aside, main } = Auth(this.root);
    Auth_Brand(aside);

    // console.log("debug.Signup", this, params);

    const counter = Number(params?.id) || 1;

    if (counter === 1) Initial(main);
    else if (counter === 2) Verify(main);
    else if (counter === 3) Final(main);
}