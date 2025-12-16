const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    imagem: { type: String, required: true },
    
    // --- NOVIDADES AQUI ---
    estoque: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    categorias: { 
        type: [String], // <--- Agora é uma lista de textos
        required: true 
    },
    colecao: { 
        type: String, 
        required: false 
        // Ex: "Inverno 2025", "Kurohane Drop 1"
    },
    tamanhos: { 
        type: [String], 
        required: true 
    },
    cores: { 
        type: [String], 
        required: true 
        // Ex: ["Preto", "Branco", "Midnight Blue"]
    }
    // ----------------------
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);