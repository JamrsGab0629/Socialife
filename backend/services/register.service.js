import User from "../model/user.model.js"

export const registerService = async ( {email} ) => {
    const data = await  User.findOne( { where: {email} , attributes: [ "is_completed" ] });

    if(!data) {
        throw new Error("Email hasnt been registered");
    }

    if(data?.is_completed){
        throw new Error("User has already completed form");
    }

    return {
        message: "Eligible for registration",
    }
}