import Auth_Brand from "../../components/auth-brand/auth-brand";
import Auth from "../../layouts/auth/auth";
import Helper from "./signup.helper";

export default function Signup( params ) {
    const { aside, main } = Auth(this.root);
    Auth_Brand(aside);

    const counter = Number(params?.id) || 1;

    const helper = Helper.bind(this);
    const component = helper(counter);

    if(typeof component === "function"){
        component(main);
    }
}