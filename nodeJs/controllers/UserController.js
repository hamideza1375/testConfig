const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, ProposalModel, ImageProfileModel, TicketModel, SavedItemModel } = require('../model/UserModel');
const captchapng = require("captchapng");
const nodeCache = require("node-cache");
const appRootPath = require('app-root-path');
// const sharp = require('sharp');
const { ChildItemModel, PaymentModel } = require('../model/ClientModel');
const sendCode = require('../middleware/sendCode');
const { RegisterValidator } = require('../validator/UserValidator');
const cacheCode = new nodeCache({ stdTTL: (60 * 3) - 2, checkperiod: (60 * 3) - 2 })
const cacheSpecification = new nodeCache({ stdTTL: 60 * 15, checkperiod: 60 * 15 })
const cacheSetTimeForSendNewCode = new nodeCache({ stdTTL: (60 * 3) - 2, checkperiod: (60 * 3) - 2 })
var CAPTCHA_NUM = null;

const log = (value) => {console.log(value)}

function UserController() {
 

  this.captcha = (req, res) => {
    CAPTCHA_NUM = req.params.id
    var p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(100, 200, 250, 200);
    p.color(10, 10, 10, 255);
    var img = p.getBase64();
    var imgbase64 = Buffer.from(img, 'base64');
    res.send(imgbase64);
  }

}


module.exports = new UserController();