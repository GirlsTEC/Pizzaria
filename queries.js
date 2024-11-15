const addCliente = "INSERT INTO Cliente (nome, email, senha, telefone, endereco) VALUES ($1, $2, $3, $4, $5);";
const getAllClientes = "SELECT * FROM Cliente;";
const getClienteById = "SELECT * FROM Cliente WHERE id = $1;";
const getClienteByEmail = "SELECT * FROM Cliente WHERE email = $1;";
const getClienteByToken = "SELECT * FROM Cliente WHERE refreshToken = $1;";
const checkEmailExiste = "SELECT email FROM Cliente WHERE email = $1;"
const updateRefreshToken = "UPDATE Cliente SET refreshToken = $1 WHERE email = $2;";

module.exports = {
    addCliente,
    updateRefreshToken,
    getAllClientes,
    getClienteById,
    getClienteByEmail,
    getClienteByToken,
    checkEmailExiste,
};