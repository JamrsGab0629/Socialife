class SigninDto {
    constructor(body){
        this.name = name;
        this.username = username;
        this.password = password;
        this.confirmPass = confirmPass;
    }

    isValid() {
        if (!this.name || !/^[a-zA-Z ]+$/.test(this.name)) return false;
        if (!this.username || this.username.lenth < 3) return false;
        if (!this.password || this.password.lenth < 6) return false;
        return true;
    }
}

module.exports = SigninDto;