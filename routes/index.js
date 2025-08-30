const osController = require('../controllers/osController');
const veiculoController = require('../controllers/veiculoController');

const routes = [
    // Rotas para OS
    {
        path: '/os',
        method: 'GET',
        handler: osController.listarOS
    },
    {
        path: '/os',
        method: 'POST',
        handler: osController.criarOS
    },
    {
        path: '/os/:id',
        method: 'GET',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            osController.verOS(req, res, osId);
        }
    },
    {
        path: '/os/:id',
        method: 'DELETE',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            osController.deletarOS(req, res, osId);
        }
    },
    {
        path: '/os/:id/veiculos',
        method: 'GET',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            veiculoController.listarVeiculos(req, res, osId);
        }
    },
    {
        path: '/os/:id/veiculos',
        method: 'POST',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            veiculoController.adicionarVeiculo(req, res, osId);
        }
    },
    {
        path: '/os/:id/veiculos/:placa',
        method: 'GET',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            const placa = parsedUrl.pathname.split('/')[4];
            veiculoController.verVeiculo(req, res, osId, placa);
        }
    },
    {
        path: '/os/:id/veiculos/:placa',
        method: 'DELETE',
        handler: (req, res, parsedUrl) => {
            const osId = parsedUrl.pathname.split('/')[2];
            const placa = parsedUrl.pathname.split('/')[4];
            veiculoController.removerVeiculo(req, res, osId, placa);
        }
    },
    {
        path: '/veiculos/:placa/historico',
        method: 'GET',
        handler: (req, res, parsedUrl) => {
            const placa = parsedUrl.pathname.split('/')[2];
            veiculoController.buscarHistorico(req, res, placa);
        }
    }
];

module.exports = routes;
