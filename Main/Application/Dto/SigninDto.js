class SigninDto {
    constructor(body){
        this.name = body.name;
        this.username = body.username;
        this.password = body.password;
        this.confirmPass = body.confirmPass;
    }

    isValid() {
        if (!this.name || !/^[a-zA-Z ]+$/.test(this.name)) return false;
        if (!this.username || this.username.lenth < 3) return false;
        if (!this.password || this.password.lenth < 6) return false;
        return true;
    }
}

module.exports = SigninDto;