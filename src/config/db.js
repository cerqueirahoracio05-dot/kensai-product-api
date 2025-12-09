const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Veja como ficou mais limpo: apenas a URI, sem o segundo parâmetro
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Erro ao conectar ao DB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;