const http = require('http');
const url = require('url');
const accountService = require('../Service/AccountService');
const LoginDto = require('../Dto/LoginDto');
const SigninDto = require('../Dto/SigninDto');

function getBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    });
}

const server = http.createServer(async (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;

    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && path === '/api/accounts/create') {
        try {
            const body = await getBody(req);
            const dto = new SigninDto(body);

            if (!dto.isValid()){
                throw new Error("SigninDto is invalid");
            }

            const result = await accountService.createAccount(dto);

            res.writeHead(201);
            return res.end(JSON.stringify(result));
        } catch (err) {
            if (err.message === "This username is already taken"){
                res.writeHead(409);
            } else if (err.message === "SigninDto is invalid") {
                res.writeHead(400);
            } else {
                res.writeHead(500);
            }

            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    if (req.method === 'POST' && path === '/api/accounts/verify') {
        try {
            const body = await getBody(req);
            const dto = new LoginDto(body);

            if (!dto.isValid()){
                throw new Error("LoginDto is invalid");
            }

            const result = await accountService.verifyCredentials(dto);

            res.writeHead(200);
            return res.end(JSON.stringify(result));
        } catch (err) {
            if (err.message === "Invalid username or password") {
                res.writeHead(401);
            } else if (err.message === "LoginDto is invalid") {
                res.writeHead(400);
            } else {
                res.writeHead(500);
            }

            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(3000, () => console.log(" Vanilla server responding on port 3000"));