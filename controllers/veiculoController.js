const veiculoService = require('../services/veiculoService');
const { parseRequestBody } = require('../utils/requestUtils');

const veiculoController = {
    async listarVeiculos(req, res, osId) {
        try {
            const veiculos = await veiculoService.listarPorOS(osId);

            if (veiculos === null) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('OS não encontrada');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(veiculos));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    },

    async adicionarVeiculo(req, res, osId) {
        try {
            const dados = await parseRequestBody(req);

            if (!dados.placa || typeof dados.placa !== 'string') {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Placa é obrigatória e deve ser uma string.');
                return;
            }

            const novoVeiculo = await veiculoService.adicionar(osId, dados);
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(novoVeiculo));
        } catch (erro) {
            if (erro.message.includes('já cadastrado')) {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end(erro.message);
            } else if (erro.message.includes('não encontrada')) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(erro.message);
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Erro ao processar o JSON: ' + erro.message);
            }
        }
    },

    async verVeiculo(req, res, osId, placa) {
        try {
            const veiculo = await veiculoService.buscarPorPlaca(osId, placa);

            if (!veiculo) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Veículo não encontrado');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(veiculo));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    },

    async removerVeiculo(req, res, osId, placa) {
        try {
            const veiculo = await veiculoService.remover(osId, placa);

            if (!veiculo) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Veículo não encontrado para exclusão.');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                mensagem: 'Veículo removido com sucesso.',
                veiculo: veiculo
            }));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    },

    async buscarHistorico(req, res, placa) {
        try {
            const historico = await veiculoService.buscarHistorico(placa);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ placa, historico }));
        } catch (erro) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor: ' + erro.message);
        }
    }
};

module.exports = veiculoController;
