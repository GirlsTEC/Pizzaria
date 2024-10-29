const Router = require('express');
const controller = require('../controller/clienteController.js');
const validateToken = require('../middleware/validateTokenHandler.js');
const router = Router();

router.get('/', controller.getAllClientes);
router.get('/search/:id', controller.getClienteById);
router.get('/refresh', controller.refreshLogin);
router.get('/validate', validateToken);
router.post('/create',  controller.createCliente);
router.post('/login',  controller.loginCliente);
router.delete('/logout', controller.logoutCliente)

module.exports = router;