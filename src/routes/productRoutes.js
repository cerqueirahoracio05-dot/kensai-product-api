const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/upload'); 
const { protect } = require('../middleware/authMiddleware');

// @rota    POST /api/produtos
// @desc    Cria um novo produto com imagem
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        // CORREÇÃO: Recebendo 'categorias' (plural)
        const { nome, descricao, preco, categorias, colecao, estoque, tamanhos, cores } = req.body;
        
        let imagemUrl = '';
        if (req.file && req.file.path) {
            imagemUrl = req.file.path;
        } else {
            return res.status(400).json({ message: "A imagem é obrigatória!" });
        }

        // TRATAMENTO DE ARRAYS (Transforma string "P,M" em array ["P","M"])
        const listaTamanhos = typeof tamanhos === 'string' ? tamanhos.split(',') : tamanhos;
        const listaCores = typeof cores === 'string' ? cores.split(',') : cores;
        const listaCategorias = typeof categorias === 'string' ? categorias.split(',') : categorias; 

        // TRATAMENTO DE PREÇO
        let precoFormatado = preco;
        if (preco) {
             precoFormatado = String(preco).replace(',', '.');
        }

        const produto = await Product.create({
            nome,
            descricao,
            preco: precoFormatado,
            categorias: listaCategorias, 
            colecao,
            estoque,
            tamanhos: listaTamanhos, 
            cores: listaCores,
            imagem: imagemUrl 
        });

        res.status(201).json(produto);
    } catch (error) {
        console.error(error); // Ajuda a ver o erro no terminal
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
        // CORREÇÃO AQUI: Mudei 'categoria' para 'categorias'
        const { nome, descricao, preco, categorias, colecao, estoque, tamanhos, cores } = req.body;
        
        let produto = await Product.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        // Lógica da Imagem
        let imagemUrl = produto.imagem;
        if (req.file && req.file.path) {
            imagemUrl = req.file.path;
        }

        // Tratamentos de Arrays
        let novosTamanhos = tamanhos;
        if (typeof tamanhos === 'string') novosTamanhos = tamanhos.split(',');

        let novasCores = cores;
        if (typeof cores === 'string') novasCores = cores.split(',');

        let novasCategorias = categorias;
        // Verifica se 'categorias' existe antes de tentar dar split
        if (typeof categorias === 'string') {
            novasCategorias = categorias.split(',');
        } 
        // Se categorias vier undefined (não enviou nada), mantém a antiga depois

        let novoPreco = preco;
        if (preco) novoPreco = String(preco).replace(',', '.');

        // Atualiza os dados
        produto.nome = nome || produto.nome;
        produto.descricao = descricao || produto.descricao;
        produto.preco = novoPreco || produto.preco;
        
        // Se enviou novas categorias, usa as novas, senão mantém as velhas
        if (novasCategorias) {
            produto.categorias = novasCategorias;
        }
        
        produto.colecao = colecao || produto.colecao;
        produto.estoque = estoque || produto.estoque;
        produto.cores = novasCores || produto.cores;
        produto.tamanhos = novosTamanhos || produto.tamanhos;
        produto.imagem = imagemUrl;

        const produtoAtualizado = await produto.save();
        res.json(produtoAtualizado);

    } catch (error) {
        console.error(error); // Importante para ver o erro no terminal
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;