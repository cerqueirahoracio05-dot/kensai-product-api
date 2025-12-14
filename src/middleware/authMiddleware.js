const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Verifica se o cabeçalho tem "Bearer eyJhbGci..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pega apenas o código do token (remove a palavra 'Bearer')
            token = req.headers.authorization.split(' ')[1];

            // Decodifica o token usando nossa senha secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busca o usuário no banco (sem a senha) e anexa ao pedido (req.user)
            req.user = await User.findById(decoded.id).select('-senha');

            next(); // Pode passar!
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Não autorizado, token falhou' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

module.exports = { protect };