const http = require('http');
const accountService = require('./services/AccountService');

function getBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    });
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/api/accounts/create') {
        try {
            const body = await getBody(req);
            const result = await accountService.createAccount(body);
            
            res.writeHead(201);
            return res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    if (req.method === 'POST' && req.url === '/api/accounts/verify') {
        try {
            const body = await getBody(req);
            const result = await accountService.verifyCredentials(body);
            
            res.writeHead(200);
            return res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(3000, () => console.log(" Vanilla server responding on port 3000"));