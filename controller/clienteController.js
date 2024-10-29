const pool = require('../db.js');
const queries = require('../queries.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllClientes = (req, res) => {
    // pega todos os clientes no bdd
    pool.query(queries.getAllClientes, (error, results) => {
        if (error) throw error;
        console.log("Pegou todos os Clientes")
        return res.status(200).json(results.rows);
    })
};

const getClienteById = (req, res) => {
    let id = parseInt(req.params.id);

    pool.query(queries.getClienteById, [id], (error, results) => {
        if (error) return res.status(500).send("Erro ao achar o Cliente");
        if (!results.rows.length) return res.status(404).send('Cliente não encontrado');
        console.log("Pegou cliente do id " + id)
        return res.status(200).json(results.rows);
    })
};

const createCliente = (req, res) => {
    const {nome, senha, email, telefone, endereco} = req.body;

    if (!nome || !senha || !email || !telefone || !endereco) {
        return res.status(400).send("Preencha Todos os Campos!")
    }
    // checa a já existência do $email
    pool.query(queries.checkEmailExiste, [email], (error, results) => {
        if (results.rows.length) {
            return res.status(400).send("O E-mail já existe");
        }

        //Hash Password
        const hashedSenha = bcrypt.hashSync(senha, 10);

        // cria clientes no db
        pool.query(queries.addCliente, [nome, email, hashedSenha, telefone, endereco], (error, results) => {
            if (error) {
                console.error("Erro ao adicionar cliente:", error);
                return res.status(500).send("Erro ao adicionar cliente");
            }
            return res.status(201).send("Cliente Criado com Sucesso!");
        });
    })
};

const loginCliente = (req, res) => {
    const {email, senha} = req.body;
    if (!email || !senha) {
        return res.status(400).send("Preencha Todos os Campos!");
    }

    pool.query(queries.getClienteByEmail, [email], (error, results) => {
            if (!results.rows.length) return res.status(404).send('Cliente não existe');
            let user = results.rows[0];
            const hash = bcrypt.compareSync(senha, user.senha)
            if (!user || !hash) return res.status(401).send("Email ou Senha não é válida");
            user = {
                username: results.rows[0].nome,
                email: results.rows[0].email,
                id: results.rows[0].id,
            };
            const accessToken = criaAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);

            pool.query(queries.updateRefreshToken, [refreshToken, email], (error, results) => {
                if (error) return res.status(500).send("Erro ao adicionar refresh token");
                return res.status(200).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                }).json({ token: accessToken});
            });
        }
    );
}

const logoutCliente = (req, res) => {
    const {email} = req.body;
    pool.query(queries.updateRefreshToken, [null, email], (err, results) => {
        if(err) return res.status(500).send("Erro ao logout cliente");
        return res.status(200).send("Cliente fez log-off");
    });
}

const refreshLogin = (req, res) => {
    const { refreshToken } = req.cookies;
    if(!refreshToken) return res.status(401).send("Token não existe");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.status(403).send("Token não válido");

        const accessToken = criaAccessToken(user);
        return res.status(200).json({ token: accessToken });
    })
}

const criaAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: "5m"})
}

module.exports = {
    createCliente,
    getAllClientes,
    getClienteById,
    loginCliente,
    logoutCliente,
    refreshLogin,
}