# Sistema de Ordens de Serviço (OS)

Sistema para gerenciamento de ordens de serviço de oficina mecânica, desenvolvido com Node.js usando apenas módulos internos.

## Funcionalidades

- ✅ Criar novas OS
- ✅ Adicionar veículos às OS
- ✅ Listar todas as OS
- ✅ Listar veículos de uma OS específica
- ✅ Buscar histórico completo de um veículo por placa
- ✅ Deletar OS
- ✅ Validação de dados duplicados
- ✅ Persistência em arquivos JSON

## Estrutura de Pastas

```
OS/
├── 001/
│   ├── info.json (dados da OS)
│   └── veiculos/
│       └── ABC1234/
│           ├── info.json (dados do veículo)
│           ├── pecas-trocadas.json
│           └── pecas-pendentes.json
├── 002/
│   └── ...
└── 003/
    └── ...
```

## Como Usar

### 1. Iniciar o Servidor

```bash
cd NODE_COD_01/PROJETO
node server.js
```

O servidor estará rodando em `http://localhost:3004`

### 2. Acessar a Interface

Abra o arquivo `index.html` no navegador ou acesse `http://localhost:3004`

### 3. Endpoints da API

#### Criar Nova OS
```
POST /os
{
  "placa": "ABC1234",
  "observacoes": "Troca de óleo e filtros"
}
```

#### Listar Todas as OS
```
GET /os
```

#### Adicionar Veículo a uma OS
```
POST /os/001/veiculos
{
  "placa": "ABC1234",
  "modelo": "Civic",
  "ano": "2020",
  "observacoes": "Veículo em bom estado"
}
```

#### Listar Veículos de uma OS
```
GET /os/001/veiculos
```

#### Buscar Histórico por Placa
```
GET /veiculos/ABC1234/historico
```

#### Deletar OS
```
DELETE /os/001
```

## Exemplo de Uso

1. **Criar OS 001** para o veículo ABC1234
2. **Criar OS 002** para o veículo XYZ5678
3. **Criar OS 003** para o mesmo veículo ABC1234 (nova visita)
4. **Buscar histórico** da placa ABC1234 - retornará OS 001 e OS 003

## Características

- **Sem dependências externas**: Usa apenas módulos internos do Node.js
- **Persistência local**: Todos os dados ficam salvos em arquivos JSON
- **Validação**: Verifica se OS já existe antes de criar
- **Histórico completo**: Busca todas as OS de um veículo específico
- **Interface web**: Interface simples para testar todas as funcionalidades

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **http** - Servidor HTTP nativo
- **fs.promises** - Manipulação de arquivos
- **path** - Manipulação de caminhos
- **url** - Parsing de URLs

## Baseado nos Códigos

Este projeto foi desenvolvido baseado nos códigos existentes:
- `FASE_1/index.js` - Sistema de cadastro de usuários
- `FASE_2/GET.JS` - Servidor HTTP com API REST

Mantendo a mesma estrutura, padrões e módulos utilizados nos códigos originais. 