import Final from "../../components/signup/final/final";
import Initial from "../../components/signup/initial/initial";
import Verify from "../../components/signup/verify/verify";

export default function Helper( counter ){
    const step = counter || 1;
    // console.log("debug.signup.helper", this);

    switch(step){
        case 1 : return Initial;
        case 2 : return Verify;
        case 3 : return Final;
        default: return;
    }
};