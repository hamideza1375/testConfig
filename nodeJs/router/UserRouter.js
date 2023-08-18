// sprouter
//appget
const router = require('express').Router();
const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');
const fileUpload = require('../middleware/fileUpload');


module.exports = router;
