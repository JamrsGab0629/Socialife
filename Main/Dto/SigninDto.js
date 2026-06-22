class SigninDto {
    constructor(name,username,password,confirmPass){
        this.name = name;
        this.username = username;
        this.password = password;
        this.confirmPass = confirmPass;
    }
}

module.exports = SigninDto;