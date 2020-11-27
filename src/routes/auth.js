const router = require('express').Router();
const validation_login_data = require('../middlewares/validation_login_data');
const AuthController = require('../controllers/auth');

router.get('/login',
  validation_login_data,
  AuthController.login);

module.exports = router;
