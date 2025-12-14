const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função auxiliar para gerar o Token
const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // O login dura 30 dias
    });
};

// @rota    POST /api/users/login
// @desc    Autenticar usuário e pegar token
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (usuario && (await usuario.matchPassword(senha))) {
            res.json({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                token: gerarToken(usuario._id), // <--- AQUI ESTÁ O CRACHÁ
            });
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @rota    POST /api/users
// @desc    Cadastrar um novo admin (Usaremos só uma vez)
router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const usuarioExiste = await User.findOne({ email });

        if (usuarioExiste) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const usuario = await User.create({
            nome,
            email,
            senha
        });

        if (usuario) {
            res.status(201).json({
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                token: gerarToken(usuario._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;