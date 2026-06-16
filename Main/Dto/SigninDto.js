class SigninDto {

    constructor(Name,Username,Password,ConfirmPass){
        if (typeof Name !== "string"){
            throw new Error("Must be letters");
        }
        this.Username = Username;
        this.Password = Password;
        this.ConfirmPass = ConfirmPass;


    }
}

module.exports = SigninDto;