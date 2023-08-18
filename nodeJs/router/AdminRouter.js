// sprouter
const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');
const AuthMainAdmin = require('../middleware/AuthMainAdmin');
const AuthAllAdmin = require('../middleware/AuthAllAdmin');
const fileUpload = require('../middleware/fileUpload');
const multiFileUpload = require('../middleware/multiFileUpload');


module.exports = router
