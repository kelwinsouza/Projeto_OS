const path = require('path');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

const veiculoService = {
    async listarPorOS(osId) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');

        try {
            await fs.access(pastaVeiculos);
        } catch {
            return null;
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

        return veiculos;
    },

    async adicionar(osId, dados) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');

        try {
            await fs.access(pastaVeiculos);
        } catch {
            throw new Error('OS não encontrada');
        }

        const pastaVeiculo = path.join(pastaVeiculos, dados.placa);

        try {
            await fs.access(pastaVeiculo);
            throw new Error('Veículo já cadastrado nesta OS.');
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

        return infoVeiculo;
    },

    async buscarPorPlaca(osId, placa) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');
        const pastaVeiculo = path.join(pastaVeiculos, placa);
        const infoPath = path.join(pastaVeiculo, 'info.json');

        try {
            await fs.access(infoPath);
        } catch {
            return null;
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

        return {
            ...info,
            pecas_trocadas: pecasTrocadas,
            pecas_pendentes: pecasPendentes
        };
    },

    async remover(osId, placa) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const pastaVeiculos = path.join(pastaOSId, 'veiculos');
        const pastaVeiculo = path.join(pastaVeiculos, placa);

        try {
            await fs.access(pastaVeiculo);
        } catch {
            return null;
        }

        // Ler info antes de deletar
        const infoPath = path.join(pastaVeiculo, 'info.json');
        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        // Deletar pasta recursivamente
        await fileUtils.deletarPastaRecursivamente(pastaVeiculo);

        return info;
    },

    async buscarHistorico(placa) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');

        try {
            await fs.access(pastaOS);
        } catch {
            return [];
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

        return historico;
    }
};

module.exports = veiculoService;
