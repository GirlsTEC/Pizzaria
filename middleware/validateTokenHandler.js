const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        if(!token) return res.status(401).send({message: "Cliente não autorizado ou token está vazio"});
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).send({message: "Cliente não autorizado"});
            }

            req.user = decoded;
            next();
        });
    } else {
        return res.status(404).send({message: 'Token Inexistente'});
    }
}

module.exports = validateToken;