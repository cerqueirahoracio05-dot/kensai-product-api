// Importa as dependências
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao Banco de Dados
connectDB();

const app = express();

app.use(cors());
// Middleware: permite que o Express entenda requisições JSON
app.use(express.json());

// Toda vez que alguém acessar /api/produtos, vai para o nosso arquivo de rotas
app.use('/api/produtos', require('./src/routes/productRoutes'));

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('API da Loja de Roupas em funcionamento!');
});

// Define a porta do servidor
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));