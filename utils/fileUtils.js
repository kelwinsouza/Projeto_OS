const fs = require('fs').promises;
const path = require('path');

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

module.exports = {
    deletarPastaRecursivamente
};
