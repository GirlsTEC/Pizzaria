const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler')

dotenv.config();

let app = express();
let publicPath = path.join(__dirname, './public');
let port = process.env.PORT;

app.use(express.json());
app.use(express.static(publicPath));
app.use(cookieParser());
app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(publicPath, './html/TelaInicial.html'));
});
app.get('/cadastro', (req, res) => {
    res.status(200).sendFile(path.resolve(publicPath, './html/TelaCadastro.html'));
});
app.get('/login', (req, res) => {
    res.status(200).sendFile(path.resolve(publicPath, './html/TelaLogin.html'));
});
app.get('/menu', (req, res) => {
    res.status(200).sendFile(path.resolve(publicPath, './html/TelaPedidos.html'));
});
app.get('/perfil', (req, res) => {
    res.status(200).sendFile(path.resolve(publicPath, './html/TelaConta.html'));
});

app.use('/api/cliente/', require('./routes/clienteRoute.js'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})