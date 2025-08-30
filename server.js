const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer((req, res) => {
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

    // GET - Listar todas as OS
    if (pathname === '/os' && method === 'GET') {
        listarOS(req, res);
    }
    // POST - Criar nova OS
    else if (pathname === '/os' && method === 'POST') {
        criarOS(req, res);
    }
    // GET - Ver OS específica
    else if (pathname.startsWith('/os/') && method === 'GET') {
        const partes = pathname.split('/');
        const osId = partes[2];
        verOS(req, res, osId);
    }
    // DELETE - Deletar OS
    else if (pathname.startsWith('/os/') && method === 'DELETE') {
        const partes = pathname.split('/');
        const osId = partes[2];
        deletarOS(req, res, osId);
    }
    // GET - Listar veículos de uma OS
    else if (pathname.startsWith('/os/') && pathname.includes('/veiculos') && method === 'GET') {
        const partes = pathname.split('/');
        const osId = partes[2];
        listarVeiculos(req, res, osId);
    }
    // POST - Adicionar veículo a uma OS
    else if (pathname.startsWith('/os/') && pathname.includes('/veiculos') && method === 'POST') {
        const partes = pathname.split('/');
        const osId = partes[2];
        adicionarVeiculo(req, res, osId);
    }
    // GET - Ver veículo específico
    else if (pathname.startsWith('/os/') && pathname.includes('/veiculos/') && method === 'GET') {
        const partes = pathname.split('/');
        const osId = partes[2];
        const placa = partes[4];
        verVeiculo(req, res, osId, placa);
    }
    // DELETE - Remover veículo
    else if (pathname.startsWith('/os/') && pathname.includes('/veiculos/') && method === 'DELETE') {
        const partes = pathname.split('/');
        const osId = partes[2];
        const placa = partes[4];
        removerVeiculo(req, res, osId, placa);
    }
    // GET - Buscar histórico por placa
    else if (pathname.startsWith('/veiculos/') && pathname.includes('/historico') && method === 'GET') {
        const partes = pathname.split('/');
        const placa = partes[2];
        buscarHistorico(req, res, placa);
    }
    // GET - Página inicial
    else if (pathname === '/' && method === 'GET') {
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
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada');
    }
});

server.listen(3004, () => {
    console.log('Servidor rodando em http://localhost:3004');
});

// Funções auxiliares
async function listarOS(req, res) {
    try {
        const pastaOS = path.join(__dirname, 'OS');

        try {
            await fs.access(pastaOS);
        } catch {
            await fs.mkdir(pastaOS);
        }

        const arquivos = await fs.readdir(pastaOS);
        const osList = [];

        for (const arquivo of arquivos) {
            if (arquivo.match(/^\d+$/)) {
                const infoPath = path.join(pastaOS, arquivo, 'info.json');
                try {
                    const conteudo = await fs.readFile(infoPath, 'utf-8');
                    const info = JSON.parse(conteudo);
                    osList.push({ id: arquivo, ...info });
                } catch (erro) {
                    console.log('Erro ao ler OS:', arquivo, erro.message);
                }
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(osList));
    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function criarOS(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const dados = JSON.parse(body);

            if (!dados.placa || typeof dados.placa !== 'string') {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Placa é obrigatória e deve ser uma string.');
                return;
            }

            const pastaOS = path.join(__dirname, 'OS');

            try {
                await fs.access(pastaOS);
            } catch {
                await fs.mkdir(pastaOS);
            }

            // Gerar novo ID de OS
            const arquivos = await fs.readdir(pastaOS);
            let novoId = 1;
            while (arquivos.includes(novoId.toString().padStart(3, '0'))) {
                novoId++;
            }

            const osId = novoId.toString().padStart(3, '0');
            const pastaOSId = path.join(pastaOS, osId);
            await fs.mkdir(pastaOSId);

            const infoOS = {
                placa: dados.placa,
                criadoEm: new Date().toISOString(),
                observacoes: dados.observacoes || ''
            };

            const infoPath = path.join(pastaOSId, 'info.json');
            await fs.writeFile(infoPath, JSON.stringify(infoOS, null, 2));

            // Criar pasta de veículos
            const pastaVeiculos = path.join(pastaOSId, 'veiculos');
            await fs.mkdir(pastaVeiculos);

            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ id: osId, ...infoOS }));

        } catch (erro) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Erro ao processar o JSON: ' + erro.message);
        }
    });
}

async function verOS(req, res, osId) {
    try {
        const pastaOS = path.join(__dirname, 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const infoPath = path.join(pastaOSId, 'info.json');

        try {
            await fs.access(infoPath);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('OS não encontrada');
            return;
        }

        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ id: osId, ...info }));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function deletarOS(req, res, osId) {
    try {
        const pastaOS = path.join(__dirname, 'OS');
        const pastaOSId = path.join(pastaOS, osId);

        try {
            await fs.access(pastaOSId);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('OS não encontrada para exclusão.');
            return;
        }

        // Ler info antes de deletar
        const infoPath = path.join(pastaOSId, 'info.json');
        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        // Deletar pasta recursivamente
        await deletarPastaRecursivamente(pastaOSId);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            mensagem: 'OS removida com sucesso.',
            os: { id: osId, ...info }
        }));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function deletarPastaRecursivamente(pasta) {
    const arquivos = await fs.readdir(pasta);

    for (const arquivo of arquivos) {
        const caminhoCompleto = path.join(pasta, arquivo);
        const stat = await fs.stat(caminhoCompleto);

        if (stat.isDirectory()) {
            await deletarPastaRecursivamente(caminhoCompleto);
        } else {
            await fs.unlink(caminhoCompleto);
        }
    }

    await fs.rmdir(pasta);
}

async function listarVeiculos(req, res, osId) {
    try {
        const pastaOS = path.join(__dirname, 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');

        try {
            await fs.access(pastaVeiculos);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('OS não encontrada');
            return;
        }

        const arquivos = await fs.readdir(pastaVeiculos);
        const veiculos = [];

        for (const arquivo of arquivos) {
            const infoPath = path.join(pastaVeiculos, arquivo, 'info.json');
            try {
                const conteudo = await fs.readFile(infoPath, 'utf-8');
                const info = JSON.parse(conteudo);
                veiculos.push({ placa: arquivo, ...info });
            } catch (erro) {
                console.log('Erro ao ler veículo:', arquivo, erro.message);
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(veiculos));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function adicionarVeiculo(req, res, osId) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const dados = JSON.parse(body);

            if (!dados.placa || typeof dados.placa !== 'string') {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Placa é obrigatória e deve ser uma string.');
                return;
            }

            const pastaOS = path.join(__dirname, 'OS');
            const pastaOSId = path.join(pastaOS, osId);
            const pastaVeiculos = path.join(pastaOSId, 'veiculos');

            try {
                await fs.access(pastaVeiculos);
            } catch {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('OS não encontrada');
                return;
            }

            const pastaVeiculo = path.join(pastaVeiculos, dados.placa);

            try {
                await fs.access(pastaVeiculo);
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end('Veículo já cadastrado nesta OS.');
                return;
            } catch {
                // Pasta não existe, pode criar
            }

            await fs.mkdir(pastaVeiculo);

            const infoVeiculo = {
                placa: dados.placa,
                modelo: dados.modelo || '',
                ano: dados.ano || '',
                criadoEm: new Date().toISOString(),
                observacoes: dados.observacoes || ''
            };

            const infoPath = path.join(pastaVeiculo, 'info.json');
            await fs.writeFile(infoPath, JSON.stringify(infoVeiculo, null, 2));

            // Criar arquivos de peças
            await fs.writeFile(path.join(pastaVeiculo, 'pecas-trocadas.json'), '[]');
            await fs.writeFile(path.join(pastaVeiculo, 'pecas-pendentes.json'), '[]');

            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(infoVeiculo));

        } catch (erro) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Erro ao processar o JSON: ' + erro.message);
        }
    });
}

async function verVeiculo(req, res, osId, placa) {
    try {
        const pastaOS = path.join(__dirname, 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');
        const pastaVeiculo = path.join(pastaVeiculos, placa);
        const infoPath = path.join(pastaVeiculo, 'info.json');

        try {
            await fs.access(infoPath);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Veículo não encontrado');
            return;
        }

        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        // Ler peças trocadas e pendentes
        const pecasTrocadasPath = path.join(pastaVeiculo, 'pecas-trocadas.json');
        const pecasPendentesPath = path.join(pastaVeiculo, 'pecas-pendentes.json');

        let pecasTrocadas = [];
        let pecasPendentes = [];

        try {
            const conteudoTrocadas = await fs.readFile(pecasTrocadasPath, 'utf-8');
            pecasTrocadas = JSON.parse(conteudoTrocadas);
        } catch (erro) {
            console.log('Erro ao ler peças trocadas:', erro.message);
        }

        try {
            const conteudoPendentes = await fs.readFile(pecasPendentesPath, 'utf-8');
            pecasPendentes = JSON.parse(conteudoPendentes);
        } catch (erro) {
            console.log('Erro ao ler peças pendentes:', erro.message);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            ...info,
            pecas_trocadas: pecasTrocadas,
            pecas_pendentes: pecasPendentes
        }));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function removerVeiculo(req, res, osId, placa) {
    try {
        const pastaOS = path.join(__dirname, 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');
        const pastaVeiculo = path.join(pastaVeiculos, placa);

        try {
            await fs.access(pastaVeiculo);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Veículo não encontrado para exclusão.');
            return;
        }

        // Ler info antes de deletar
        const infoPath = path.join(pastaVeiculo, 'info.json');
        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        // Deletar pasta recursivamente
        await deletarPastaRecursivamente(pastaVeiculo);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            mensagem: 'Veículo removido com sucesso.',
            veiculo: info
        }));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
}

async function buscarHistorico(req, res, placa) {
    try {
        const pastaOS = path.join(__dirname, 'OS');

        try {
            await fs.access(pastaOS);
        } catch {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ placa, historico: [] }));
            return;
        }

        const arquivos = await fs.readdir(pastaOS);
        const historico = [];

        for (const arquivo of arquivos) {
            if (arquivo.match(/^\d+$/)) {
                const pastaOSId = path.join(pastaOS, arquivo);
                const pastaVeiculos = path.join(pastaOSId, 'veiculos');
                const pastaVeiculo = path.join(pastaVeiculos, placa);

                try {
                    await fs.access(pastaVeiculo);

                    // Ler info da OS
                    const infoOSPath = path.join(pastaOSId, 'info.json');
                    const conteudoOS = await fs.readFile(infoOSPath, 'utf-8');
                    const infoOS = JSON.parse(conteudoOS);

                    // Ler info do veículo
                    const infoVeiculoPath = path.join(pastaVeiculo, 'info.json');
                    const conteudoVeiculo = await fs.readFile(infoVeiculoPath, 'utf-8');
                    const infoVeiculo = JSON.parse(conteudoVeiculo);

                    // Ler peças trocadas e pendentes
                    const pecasTrocadasPath = path.join(pastaVeiculo, 'pecas-trocadas.json');
                    const pecasPendentesPath = path.join(pastaVeiculo, 'pecas-pendentes.json');

                    let pecasTrocadas = [];
                    let pecasPendentes = [];

                    try {
                        const conteudoTrocadas = await fs.readFile(pecasTrocadasPath, 'utf-8');
                        pecasTrocadas = JSON.parse(conteudoTrocadas);
                    } catch (erro) {
                        console.log('Erro ao ler peças trocadas:', erro.message);
                    }

                    try {
                        const conteudoPendentes = await fs.readFile(pecasPendentesPath, 'utf-8');
                        pecasPendentes = JSON.parse(conteudoPendentes);
                    } catch (erro) {
                        console.log('Erro ao ler peças pendentes:', erro.message);
                    }

                    historico.push({
                        os: arquivo,
                        data: infoOS.criadoEm,
                        placa: infoVeiculo.placa,
                        modelo: infoVeiculo.modelo,
                        ano: infoVeiculo.ano,
                        observacoes: infoVeiculo.observacoes,
                        pecas_trocadas: pecasTrocadas,
                        pecas_pendentes: pecasPendentes
                    });

                } catch (erro) {
                    // Veículo não encontrado nesta OS, continuar
                }
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ placa, historico }));

    } catch (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor: ' + erro.message);
    }
} 