const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        if(!token) return res.status(401).send("Cliente não autorizado ou token está vazio");
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).send("Cliente não autorizado");
            }
            console.log(decoded);
            req.user = decoded.user;
            next();
        });
    }
}

module.exports = validateToken;