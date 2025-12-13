const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/upload'); // <--- Importamos o config de upload

// @rota    POST /api/produtos
// @desc    Cria um novo produto com imagem
// Adicionamos 'upload.single('file')' aqui. 'file' será o nome do campo no Insomnia.
router.post('/', upload.single('file'), async (req, res) => {
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

module.exports = router;