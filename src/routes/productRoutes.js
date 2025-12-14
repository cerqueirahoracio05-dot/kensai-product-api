const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/upload'); // <--- Importamos o config de upload
const { protect } = require('../middleware/authMiddleware');

// @rota    POST /api/produtos
// @desc    Cria um novo produto com imagem
// Adicionamos 'upload.single('file')' aqui. 'file' será o nome do campo no Insomnia.
router.post('/', protect,  upload.single('file'), async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, tamanhos } = req.body;
        
        // Verificação de segurança: se não enviou imagem, avisar
        let imagemUrl = '';
        if (req.file && req.file.path) {
            imagemUrl = req.file.path; // O Cloudinary devolve o link aqui em 'path'
        } else {
            return res.status(400).json({ message: "A imagem é obrigatória!" });
        }

        // Importante: 'tamanhos' pode vir como texto simples do Insomnia (ex: "P,M,G")
        // Precisamos garantir que vire um array se for enviado assim
        const listaTamanhos = typeof tamanhos === 'string' ? tamanhos.split(',') : tamanhos;

        const produto = await Product.create({
            nome,
            descricao,
            preco,
            categoria,
            tamanhos: listaTamanhos, 
            imagem: imagemUrl // Salvamos o link do Cloudinary no banco
        });

        res.status(201).json(produto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- ADICIONE ESTE BLOCO ABAIXO DO ROUTER.POST ---

// @rota    GET /api/produtos
// @desc    Lista todos os produtos
router.get('/', async (req, res) => {
    try {
        // Busca todos os produtos no banco de dados
        const produtos = await Product.find();
        
        // Devolve a lista em formato JSON
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @rota    DELETE /api/produtos/:id
// @desc    Deleta um produto pelo ID
router.delete('/:id', protect, async (req, res) => {
    try {
        // O ID vem da URL (req.params.id)
        const produto = await Product.findByIdAndDelete(req.params.id);

        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        res.json({ message: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @rota    PUT /api/produtos/:id
// @desc    Atualiza um produto (texto e/ou imagem)
router.put('/:id', protect, upload.single('file'), async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, tamanhos } = req.body;
        
        // Busca o produto antigo primeiro
        let produto = await Product.findById(req.params.id);

        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        // --- LÓGICA DE ATUALIZAÇÃO ---
        
        // 1. Se enviou uma NOVA imagem, atualiza o link.
        // Se não enviou imagem, mantém a antiga (produto.imagem).
        let imagemUrl = produto.imagem;
        if (req.file && req.file.path) {
            imagemUrl = req.file.path;
        }

        // 2. Tratamento do preço (vírgula por ponto)
        let novoPreco = preco;
        if (preco) {
             novoPreco = String(preco).replace(',', '.');
        }

        // 3. Tratamento dos tamanhos (se vier string, vira array)
        let novosTamanhos = tamanhos;
        if (typeof tamanhos === 'string') {
            novosTamanhos = tamanhos.split(',');
        }

        // Atualiza os dados no banco
        produto.nome = nome || produto.nome;
        produto.descricao = descricao || produto.descricao;
        produto.preco = novoPreco || produto.preco;
        produto.categoria = categoria || produto.categoria;
        produto.tamanhos = novosTamanhos || produto.tamanhos;
        produto.imagem = imagemUrl;

        // Salva as alterações
        const produtoAtualizado = await produto.save();

        res.json(produtoAtualizado);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;