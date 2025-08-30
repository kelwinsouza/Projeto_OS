const path = require('path');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

const osService = {
    async listarTodas() {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');

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

        return osList;
    },

    async criar(dados) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');

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

        return { id: osId, ...infoOS };
    },

    async buscarPorId(osId) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);
        const infoPath = path.join(pastaOSId, 'info.json');

        try {
            await fs.access(infoPath);
        } catch {
            return null;
        }

        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        return { id: osId, ...info };
    },

    async deletar(osId) {
        const pastaOS = path.join(__dirname, '..', '..', 'OS');
        const pastaOSId = path.join(pastaOS, osId);

        try {
            await fs.access(pastaOSId);
        } catch {
            return null;
        }

        // Ler info antes de deletar
        const infoPath = path.join(pastaOSId, 'info.json');
        const conteudo = await fs.readFile(infoPath, 'utf-8');
        const info = JSON.parse(conteudo);

        // Deletar pasta recursivamente
        await fileUtils.deletarPastaRecursivamente(pastaOSId);

        return { id: osId, ...info };
    }
};

module.exports = osService;
