function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                if (body) {
                    const dados = JSON.parse(body);
                    resolve(dados);
                } else {
                    resolve({});
                }
            } catch (erro) {
                reject(new Error('Erro ao processar o JSON: ' + erro.message));
            }
        });

        req.on('error', (erro) => {
            reject(new Error('Erro na requisição: ' + erro.message));
        });
    });
}

module.exports = {
    parseRequestBody
};
