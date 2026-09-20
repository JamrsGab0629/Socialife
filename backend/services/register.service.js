import User from "../model/user.model.js"

export const registerService = async ( body ) => {
    const email = body.email;
    const data = await User.findOne( { where: { email } });

    if(!data) {
        throw new Error("Email hasnt been registered");
    }

    if(data?.is_completed){
        throw new Error("User has already completed form");
    }

    data.first_name = body.firstname;
    data.last_name = body.lastname;
    data.birth_date = body.birthday;
    data.is_actived = true;
    data.is_completed = true;
    await data.save();

    return {
        message: "Eligible for registration",
    }
}