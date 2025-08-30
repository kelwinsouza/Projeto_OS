const http = require('http');
const url = require('url');
const routes = require('../routes');

const server = http.createServer((req, res) => {
    // Middleware de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;

    // Roteamento com suporte a parâmetros dinâmicos
    let route = null;
    for (const r of routes) {
        if (r.method === method) {
            // Converter padrão /os/:id para regex
            const pattern = r.path.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${pattern}$`);
            if (regex.test(pathname)) {
                route = r;
                break;
            }
        }
    }

    if (route) {
        route.handler(req, res, parsedUrl);
    } else {
        // Página inicial
        if (pathname === '/' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Sistema de OS</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1>Sistema de Ordens de Serviço</h1>
                    <p>Servidor rodando em http://localhost:3004</p>
                    <p>Use a API para gerenciar as OS</p>
                </body>
                </html>
            `);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Rota não encontrada');
        }
    }
});

server.listen(3004, () => {
    console.log('Servidor rodando em http://localhost:3004');
});
