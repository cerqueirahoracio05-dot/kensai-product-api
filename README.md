# 👕 API - Loja de Roupas (E-commerce)

API RESTful desenvolvida em Node.js para gerenciar o catálogo de produtos de um e-commerce de moda. O sistema inclui upload de imagens, autenticação de administradores e gerenciamento completo de produtos (CRUD).

## 🚀 Tecnologias Utilizadas

- **Node.js** & **Express**: Servidor e rotas.
- **MongoDB** & **Mongoose**: Banco de dados NoSQL.
- **JWT (JSON Web Token)**: Autenticação e proteção de rotas.
- **Cloudinary** & **Multer**: Armazenamento e upload de imagens na nuvem.
- **BcryptJS**: Criptografia de senhas.
- **Cors**: Permissão de acesso para o Frontend.

## ⚙️ Funcionalidades

- **Publico:**
  - Listar todos os produtos (`GET`).
- **Privado (Admin):**
  - Login administrativo.
  - Cadastrar novos produtos com imagem (`POST`).
  - Editar produtos existentes (`PUT`).
  - Remover produtos (`DELETE`).

## 🛠️ Como Rodar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** e o **Git** instalados.

### 2. Instalação
Clone o repositório e instale as dependências:

```bash
# Clone este repositório
git clone https://github.com/cerqueirahoracio05-dot/kensai-product-api
# Entre na pasta
cd loja-api

# Instale as dependências
npm install