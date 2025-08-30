# Sistema de Ordens de Serviço (OS)

Sistema para gerenciamento de ordens de serviço para veículos, com arquitetura organizada em camadas.

## 🚀 **COMO USAR - GUIA RÁPIDO**

### **1. Iniciar o Sistema**
```bash
# Instalar dependências (primeira vez)
npm install

# Executar o servidor
npm start
```
**Servidor rodará em:** `http://localhost:3004`

### **2. Acessar a Interface**
- **Abra o arquivo `index.html`** no navegador
- **OU acesse:** `http://localhost:3004`

### **3. Funcionalidades Principais**

#### 📋 **Criar Nova OS**
1. Digite a **placa do veículo** (ex: ABC1234)
2. Adicione **observações** (opcional)
3. Clique em **"Criar OS"**
4. Sistema criará automaticamente a OS 001

#### 🚗 **Adicionar Veículo a uma OS**
1. Digite o **ID da OS** (ex: 001)
2. Preencha **placa, modelo, ano, observações**
3. Clique em **"Adicionar Veículo"**

#### 📊 **Consultas Disponíveis**
- **Listar todas as OS** - Ver todas as ordens criadas
- **Listar veículos de uma OS** - Ver veículos de OS específica
- **Buscar histórico por placa** - Histórico completo de um veículo
- **Deletar OS** - Remover ordem de serviço

### **4. Exemplo de Uso Completo**
1. **Criar OS 001** para veículo ABC1234
2. **Adicionar veículo** com modelo "Civic 2020"
3. **Criar OS 002** para veículo XYZ5678
4. **Buscar histórico** da placa ABC1234 (mostrará OS 001)

---

## 🏗️ Estrutura do Projeto

```
Projeto_OS/
├── controllers/          # Controladores da aplicação
│   ├── osController.js   # Controlador para OS
│   └── veiculoController.js # Controlador para veículos
├── middlewares/          # Middlewares
│   └── cors.js          # Middleware de CORS
├── routes/               # Definição de rotas
│   └── index.js         # Configuração de todas as rotas
├── services/             # Lógica de negócio
│   ├── osService.js     # Serviços para OS
│   └── veiculoService.js # Serviços para veículos
├── utils/                # Utilitárias
│   ├── fileUtils.js     # Utilitárias para arquivos
│   └── requestUtils.js  # Utilitárias para requisições
├── public/               # Arquivos estáticos
│   ├── css/             # Estilos CSS
│   │   └── styles.css   # Estilos principais
│   └── js/              # JavaScript do frontend
│       └── app.js       # Lógica da interface
├── server/               # Servidor principal
│   └── index.js         # Arquivo principal do servidor
├── OS/                   # Dados das ordens de serviço
├── index.html            # Interface principal
├── package.json          # Configurações do projeto
└── README.md             # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### Execução
```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

O servidor estará rodando em `http://localhost:3004`

## 📋 Funcionalidades

### Ordens de Serviço (OS)
- ✅ Criar nova OS
- ✅ Listar todas as OS
- ✅ Visualizar OS específica
- ✅ Deletar OS

### Veículos
- ✅ Adicionar veículo a uma OS
- ✅ Listar veículos de uma OS
- ✅ Visualizar veículo específico
- ✅ Remover veículo de uma OS
- ✅ Buscar histórico por placa

## 🔌 API Endpoints

### OS
- `GET /os` - Listar todas as OS
- `POST /os` - Criar nova OS
- `GET /os/:id` - Ver OS específica
- `DELETE /os/:id` - Deletar OS

### Veículos
- `GET /os/:id/veiculos` - Listar veículos de uma OS
- `POST /os/:id/veiculos` - Adicionar veículo a uma OS
- `GET /os/:id/veiculos/:placa` - Ver veículo específico
- `DELETE /os/:id/veiculos/:placa` - Remover veículo de uma OS
- `GET /veiculos/:placa/historico` - Buscar histórico por placa

## 🎨 Interface

A interface é responsiva e organizada em seções:
- Formulário para criar OS
- Listagem de OS
- Gerenciamento de veículos
- Busca de histórico
- Exclusão de OS

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js (HTTP nativo)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Arquitetura**: MVC com separação de responsabilidades
- **Armazenamento**: Sistema de arquivos (JSON)

## 📁 Armazenamento de Dados

Os dados são armazenados em arquivos JSON na estrutura:
```
OS/
├── 001/
│   ├── info.json
│   └── veiculos/
│       └── ABC1234/
│           ├── info.json
│           ├── pecas-trocadas.json
│           └── pecas-pendentes.json
├── 002/
│   └── ...
└── ...
```

## 🚧 Melhorias Futuras

- [ ] Autenticação e autorização
- [ ] Banco de dados (PostgreSQL/MongoDB)
- [ ] Upload de imagens
- [ ] Relatórios e estatísticas
- [ ] Notificações em tempo real
- [ ] API para aplicativos móveis

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes. 