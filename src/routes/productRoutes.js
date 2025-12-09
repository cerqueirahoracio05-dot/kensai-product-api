const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importamos o modelo que acabamos de criar

// @rota    POST /api/produtos
// @desc    Cria um novo produto
router.post('/', async (req, res) => {
    try {
        // Pega os dados que você enviou
        const { nome, descricao, preco, categoria, tamanhos, imagem } = req.body;

        // Cria o produto no banco
        const produto = await Product.create({
            nome,
            descricao,
            preco,
            categoria,
            tamanhos,
            imagem
        });

        // Devolve o produto criado com status 201 (Criado)
        res.status(201).json(produto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @rota    GET /api/produtos
// @desc    Lista todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Product.find(); // O .find() sem argumentos traz tudo
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;