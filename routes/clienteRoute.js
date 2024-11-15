const Router = require('express');
const controller = require('../controller/clienteController.js');
const validateToken = require('../middleware/validateTokenHandler.js');
const router = Router();

router.get('/', controller.getAllClientes);
router.get('/search/:id', controller.getClienteById);
router.get('/search', controller.getClienteByToken);
router.get('/refresh', controller.refreshLogin);
router.get('/validate', controller.validateToken);
router.post('/create', controller.createCliente);
router.post('/login',  controller.loginCliente);
router.put('/logout', validateToken, controller.logoutCliente)
router.put('/update', validateToken, controller.updateCliente)

module.exports = router;