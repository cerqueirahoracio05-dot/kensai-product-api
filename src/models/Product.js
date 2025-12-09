const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, adicione o nome do produto']
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: [true, 'Por favor, adicione o preço']
    },
    categoria: {
        type: String, // Ex: "Camisetas", "Calças"
        required: true
    },
    tamanhos: {
        type: [String], // Array de strings. Ex: ['P', 'M', 'G', 'GG']
        required: true
    },
    imagem: {
        type: String, // Aqui vai entrar a URL do Cloudinary depois
        required: false // Pode ser opcional no início
    }
}, {
    timestamps: true // Cria automaticamente campos 'createdAt' e 'updatedAt'
});

module.exports = mongoose.model('Product', productSchema);