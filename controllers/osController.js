const osService = require('../services/osService');
const { parseRequestBody } = require('../utils/requestUtils');

const osController = {
    async listarOS(req, res) {
        try {
            const osList = await osService.listarTodas();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(osList));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    },

    async criarOS(req, res) {
        try {
            const dados = await parseRequestBody(req);

            if (!dados.placa || typeof dados.placa !== 'string') {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Placa é obrigatória e deve ser uma string.');
                return;
            }

            const novaOS = await osService.criar(dados);
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(novaOS));
        } catch (erro) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Erro ao processar o JSON: ' + erro.message);
        }
    },

    async verOS(req, res, osId) {
        try {
            const os = await osService.buscarPorId(osId);

            if (!os) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('OS não encontrada');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(os));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    },

    async deletarOS(req, res, osId) {
        try {
            const os = await osService.deletar(osId);

            if (!os) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('OS não encontrada para exclusão.');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                mensagem: 'OS removida com sucesso.',
                os: os
            }));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    }
};

module.exports = osController;
