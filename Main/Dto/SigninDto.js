class SigninDto {

    constructor(name,username,password,confirmPass){
        if (typeof name !== "string"){
            throw new Error("Must be letters");
        }
        this.username = username;
        this.password = password;
        this.confirmPass = confirmPass;


    }
}

module.exports = SigninDto;