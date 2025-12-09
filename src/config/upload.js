const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// 1. Configura as credenciais do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define onde e como salvar (Storage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'loja-roupas', // Nome da pasta que será criada no seu Cloudinary
        allowedFormats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
    },
});

// 3. Cria a instância do Multer pronta para uso
const upload = multer({ storage: storage });

module.exports = upload;