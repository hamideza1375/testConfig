// appcontas
// spfa
// app200
const node_geocoder = require('node-geocoder');
const { CategoryModel, ChildItemModel, PaymentModel, CommenteModel, QuitsSellerModel, SpecificationsSoldModel } = require('../model/ClientModel')
const { NotifeeModel, AddressVoucherModel, SliderModel, PostPriceModel, SellerModel } = require('../model/AdminModel')
const { UserModel, SavedItemModel } = require('../model/UserModel')
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);
const nodeCache = require("node-cache");
const { ConfirmPaymentShama } = require('../validator/ClientValidator');
const mongoose = require('mongoose');
const cache = new nodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 30 })
/** * @param {express.Request} req * @param {express.Response} res * @param {() => void} next * @returns {void} */
const log = (value) => {console.log(value)}
function ClientController() {


}

module.exports = new ClientController()