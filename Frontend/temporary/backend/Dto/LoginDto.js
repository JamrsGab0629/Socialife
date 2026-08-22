class LoginDto{
    constructor(body){
        this.username = body.username;
        this.password = body.password;
    }

    isValid() {
        if (!this.username || this.username.lenth < 3) return false;
        if (!this.password || this.password.lenth < 6) return false;
        return true;
    }
}

module.exports = LoginDto;