const API_BASE = 'http://localhost:3004';

async function fazerRequisicao(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.text();

        if (response.ok) {
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } else {
            throw new Error(`Erro ${response.status}: ${data}`);
        }
    } catch (erro) {
        throw new Error('Erro na requisição: ' + erro.message);
    }
}

function mostrarResultado(elementId, dados) {
    const elemento = document.getElementById(elementId);
    elemento.style.display = 'block';
    elemento.textContent = typeof dados === 'string' ? dados : JSON.stringify(dados, null, 2);
}

async function criarOS() {
    try {
        const placa = document.getElementById('placa').value;
        const observacoes = document.getElementById('observacoes').value;

        if (!placa) {
            alert('Por favor, informe a placa do veículo.');
            return;
        }

        const dados = {
            placa: placa,
            observacoes: observacoes
        };

        const resultado = await fazerRequisicao(`${API_BASE}/os`, {
            method: 'POST',
            body: JSON.stringify(dados)
        });

        mostrarResultado('resultadoCriarOS', resultado);

        // Limpar campos
        document.getElementById('placa').value = '';
        document.getElementById('observacoes').value = '';
    } catch (erro) {
        mostrarResultado('resultadoCriarOS', erro.message);
    }
}

async function listarOS() {
    try {
        const resultado = await fazerRequisicao(`${API_BASE}/os`);
        mostrarResultado('resultadoListarOS', resultado);
    } catch (erro) {
        mostrarResultado('resultadoListarOS', erro.message);
    }
}

async function adicionarVeiculo() {
    try {
        const osId = document.getElementById('osId').value;
        const placa = document.getElementById('veiculoPlaca').value;
        const modelo = document.getElementById('modelo').value;
        const ano = document.getElementById('ano').value;
        const observacoes = document.getElementById('veiculoObservacoes').value;

        if (!osId || !placa) {
            alert('Por favor, informe o ID da OS e a placa do veículo.');
            return;
        }

        const dados = {
            placa: placa,
            modelo: modelo,
            ano: ano,
            observacoes: observacoes
        };

        const resultado = await fazerRequisicao(`${API_BASE}/os/${osId}/veiculos`, {
            method: 'POST',
            body: JSON.stringify(dados)
        });

        mostrarResultado('resultadoAdicionarVeiculo', resultado);

        // Limpar campos
        document.getElementById('osId').value = '';
        document.getElementById('veiculoPlaca').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('ano').value = '';
        document.getElementById('veiculoObservacoes').value = '';
    } catch (erro) {
        mostrarResultado('resultadoAdicionarVeiculo', erro.message);
    }
}

async function listarVeiculos() {
    try {
        const osId = document.getElementById('osIdListar').value;

        if (!osId) {
            alert('Por favor, informe o ID da OS.');
            return;
        }

        const resultado = await fazerRequisicao(`${API_BASE}/os/${osId}/veiculos`);
        mostrarResultado('resultadoListarVeiculos', resultado);
    } catch (erro) {
        mostrarResultado('resultadoListarVeiculos', erro.message);
    }
}

async function buscarHistorico() {
    try {
        const placa = document.getElementById('placaHistorico').value;

        if (!placa) {
            alert('Por favor, informe a placa do veículo.');
            return;
        }

        const resultado = await fazerRequisicao(`${API_BASE}/veiculos/${placa}/historico`);
        mostrarResultado('resultadoHistorico', resultado);
    } catch (erro) {
        mostrarResultado('resultadoHistorico', erro.message);
    }
}

async function deletarOS() {
    try {
        const osId = document.getElementById('osIdDeletar').value;

        if (!osId) {
            alert('Por favor, informe o ID da OS.');
            return;
        }

        if (!confirm(`Tem certeza que deseja deletar a OS ${osId}?`)) {
            return;
        }

        const resultado = await fazerRequisicao(`${API_BASE}/os/${osId}`, {
            method: 'DELETE'
        });

        mostrarResultado('resultadoDeletarOS', resultado);
        document.getElementById('osIdDeletar').value = '';
    } catch (erro) {
        mostrarResultado('resultadoDeletarOS', erro.message);
    }
}
