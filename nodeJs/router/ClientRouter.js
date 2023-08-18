// sprouter
const router = require('express').Router();
const ClientController = require('../controllers/ClientController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');

module.exports = router
