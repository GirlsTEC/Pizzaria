const pool = require('../db.js');
const queries = require('../queries.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllClientes = (req, res) => {
    // Pega todos os clientes no bdd
    pool.query(queries.getAllClientes, (error, results) => {
        if (error) throw error;
        console.log('Pegou todos os Clientes')
        return res.status(200).json(results.rows);
    })
};

const getClienteById = (req, res) => {
    let id = parseInt(req.params.id);

    pool.query(queries.getClienteById, [id], (error, results) => {
        if (error) return res.status(500).send({message: 'Erro ao achar o Cliente'});
        if (!results.rows.length) return res.status(404).send({message: 'Cliente não encontrado'});
        console.log('Pegou cliente do id ' + id)
        return res.status(200).json(results.rows);
    })
};

const getClienteByToken = (req, res) => {
    const {refreshToken} = req.cookies;

    pool.query(queries.getClienteByToken, [refreshToken], (error, results) => {
        if (error) return res.status(500).send({message: 'Erro ao achar o Cliente'});
        if (!results.rows.length) return res.status(404).send({message: 'Cliente não encontrado'});
        console.log('Pegou cliente');
        const user = {
            nome: results.rows[0].nome,
            email: results.rows[0].email,
            telefone: results.rows[0].telefone,
            endereco: results.rows[0].endereco,
        };
        return res.status(200).send(user);
    })
};

const createCliente = (req, res) => {
    const {nome, senha, email, telefone, endereco} = req.body;

    if (!nome || !senha || !email || !telefone || !endereco) {
        return res.status(400).send({message: 'Preencha Todos os Campos!'})
    }
    // checa a já existência do $email
    pool.query(queries.checkEmailExiste, [email], (error, results) => {
        if (results.rows.length) {
            return res.status(400).send({message: 'O E-mail já existe'});
        }

        //Hash Password
        const hashedSenha = bcrypt.hashSync(senha, 10);

        // cria clientes no db
        pool.query(queries.addCliente, [nome, email, hashedSenha, telefone, endereco], (error, results) => {
            if (error) {
                console.error('Erro ao adicionar cliente:', error);
                return res.status(500).send({message: 'Erro ao adicionar cliente'});
            }
            return res.status(201).send({message: 'Cliente Criado com Sucesso!'});
        });
    })
};

const updateCliente = (req, res) => {
    const { nome, senha, telefone, endereco } = req.body;
    const { email } = req.user;
    let query = 'UPDATE Cliente SET';

    pool.query(queries.getClienteByEmail, [email], (error, results) => {
        if (error) return res.status(500).send({message: 'Erro ao achar o Cliente'});
        if (!results.rows.length) return res.status(404).send({message: 'Cliente não encontrado'});
        let count = 0

        const user = results.rows[0];
        if (nome !== user.nome && nome !== '') {
            ++count;
            query = query.concat(" nome = '", nome, "',");
        }
        if (senha !== user.senha && senha !== '') {
            ++count;
            query = query.concat(" senha = '", senha, "',");
        }
        if (telefone !== user.telefone && telefone !== '') {
            ++count;
            query = query.concat(" telefone = '", telefone,"',");
        }
        if (endereco !== user.endereco && endereco !== '') {
            ++count;
            query = query.concat(" endereco = '", endereco, "'");
        }
        if(query.endsWith(',')) query = query.slice(0, -1);
        query = query.concat("WHERE email = '", email, "';");
        console.log(query);
        console.log(queries.getClienteByEmail);
        if (!count) return res.status(400).send({message: 'Não há necessidade de atualizar'});
        pool.query(query, (error, results) => {
            if (error) return res.status(500).send({message: 'Erro ao atualizar o Cliente'});

            return res.status(201).send({message: 'Cliente atualizado com sucesso'})
        })
    })
}

const loginCliente = (req, res) => {
    const {email, senha} = req.body;
    if (!email || !senha) {
        return res.status(400).send({message: 'Preencha Todos os Campos!'});
    }

    pool.query(queries.getClienteByEmail, [email], (error, results) => {
            if (!results.rows.length) return res.status(404).send({message: 'Cliente não existe'});
            let user = results.rows[0];
            const hash = bcrypt.compareSync(senha, user.senha)
            if (!user || !hash) return res.status(401).send({message: 'Email ou Senha não é válida'});
            user = {
                username: results.rows[0].nome,
                email: results.rows[0].email,
                id: results.rows[0].id,
            };
            const accessToken = criaAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '1d'});

            pool.query(queries.updateRefreshToken, [refreshToken, email], (error, results) => {
                if (error) return res.status(500).send({message: 'Erro ao adicionar refresh token'});
                return res.status(200).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                }).json({token: accessToken});
            });
        }
    );
}

const logoutCliente = (req, res) => {
    const {email} = req.user;
    pool.query(queries.updateRefreshToken, [null, email], (err, results) => {
        if (err) return res.status(500).send({message: 'Erro ao logout cliente'});
        return res.status(200).clearCookie('refreshToken').send({message: 'Cliente fez log-off'});
    });
}

const refreshLogin = (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) return res.status(401).send({message: 'Token não existe'});

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).send({message: 'Token não válido'});
        delete user.iat;
        delete user.exp;
        const accessToken = criaAccessToken(user);
        return res.status(200).json({token: accessToken, message: 'Token Recarregado com sucesso'});
    })
}

const validateToken = (req, res) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        if (!token) return res.status(401).send({message: 'Cliente não autorizado ou token está vazio'});
        jwt.verify(token, process.env.ACCESS_TOKEN, (err) => {
            if (err) {
                return res.status(401).send({message: 'Cliente não autorizado'});
            }
            return res.status(200).send({message: 'Token autorizado'});
        });
    }
}

const criaAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '20m'})
}

module.exports = {
    createCliente,
    getAllClientes,
    getClienteById,
    getClienteByToken,
    loginCliente,
    logoutCliente,
    refreshLogin,
    validateToken,
    updateCliente,
}