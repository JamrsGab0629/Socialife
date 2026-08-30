# Socialife Backend API 

A robust Node.js and Express backend service featuring PostgreSQL/Sequelize integration, rate limiting, cookie parsing, and an OTP email verification workflow via Nodemailer.

## ⚙️ Quick Installation (One Command)

Clone the repository and install all required dependencies instantly with the following command:

Must be on root directory.
```sh
npm install bcrypt cookie-parser dotenv express globals jsonwebtoken nodemailer pg pg-hstore sequelize

```
Environment Setup (.env)
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=socialife_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=jwt_secret

```

🏃‍♂️ Running the Server
Navigate to your server directory and start the application:

```bash
cd src/backend/main/server
node server.js

```

🧪 API Usage Guide (Thunder Client: download this on vs code extensions) All endpoints run locally at http://localhost:3000.  

### 1. Register User & Send OTPURL: 

POST /api/auth/register 

Body (JSON):  

```json


{
    "username": "jamesgab0629",
    "email": "exampleemail@gmail.com",
    "password": "securepassword123",
    "first_name": "james",
    "last_name": "santos",
    "birth_date": "2000-01-01"
}
```

### 2. Verify OTP CodeURL: 

POST /api/auth/verify-otp  

Body (JSON):  


```json

{
    "email": "exampleemail@gmail.com",
    "otp": "571786"
}

```

3. Resend OTP Code
URL: POST /api/auth/resend-otp


Body (JSON):

```json

{
    "email": "exampleemail@gmail.com"
}
```

### Log in - Note after you register your already logged in.

URL POST /api/auth/login

BODY (JSON)

```json

{
    "email ":"exampleemail@gmail.com",
    "password": "your password"
}


```


### LOG OUT

URL POST /api/auth/logout
