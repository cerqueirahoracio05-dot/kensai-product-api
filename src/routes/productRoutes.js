const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/upload'); 
const { protect } = require('../middleware/authMiddleware');

// @rota    POST /api/produtos
// @desc    Cria um novo produto com imagem
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        // Note que agora recebemos 'categorias' (plural) do req.body
        const { nome, descricao, preco, categorias, colecao, estoque, tamanhos, cores } = req.body;
        
        // ... (lógica da imagem continua igual) ...

        // TRATAMENTO DE ARRAYS
        const listaTamanhos = typeof tamanhos === 'string' ? tamanhos.split(',') : tamanhos;
        const listaCores = typeof cores === 'string' ? cores.split(',') : cores;
        
        // --- NOVIDADE AQUI ---
        // Se vier "Camisa, Promoção", vira ["Camisa", "Promoção"]
        const listaCategorias = typeof categorias === 'string' ? categorias.split(',') : categorias; 

        // ... (lógica do preço continua igual) ...

        const produto = await Product.create({
            nome,
            descricao,
            preco: precoFormatado,
            categorias: listaCategorias, // <--- Salvamos a lista aqui
            colecao,
            estoque,
            tamanhos: listaTamanhos, 
            cores: listaCores,
            imagem: imagemUrl 
        });

        res.status(201).json(produto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @rota    GET /api/produtos
// @desc    Lista todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Product.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @rota    DELETE /api/produtos/:id
// @desc    Deleta um produto pelo ID
router.delete('/:id', protect, async (req, res) => {
    try {
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
        const { nome, descricao, preco, categoria, colecao, estoque, tamanhos, cores } = req.body;
        
        let produto = await Product.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        // Lógica da Imagem
        let imagemUrl = produto.imagem;
        if (req.file && req.file.path) {
            imagemUrl = req.file.path;
        }

        // Tratamentos
        let novosTamanhos = tamanhos;
        if (typeof tamanhos === 'string') novosTamanhos = tamanhos.split(',');

        let novasCores = cores;
        if (typeof cores === 'string') novasCores = cores.split(',');

        let novasCategorias = categorias;
        if (typeof categorias === 'string') novasCategorias = categorias.split(',');

        let novoPreco = preco;
        if (preco) novoPreco = String(preco).replace(',', '.');

        // Atualiza os dados
        produto.nome = nome || produto.nome;
        produto.descricao = descricao || produto.descricao;
        produto.preco = novoPreco || produto.preco;
        produto.categorias = novasCategorias || produto.categorias;
        
        produto.colecao = colecao || produto.colecao;
        produto.estoque = estoque || produto.estoque;
        produto.cores = novasCores || produto.cores;

        produto.tamanhos = novosTamanhos || produto.tamanhos;
        produto.imagem = imagemUrl;

        const produtoAtualizado = await produto.save();
        res.json(produtoAtualizado);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;