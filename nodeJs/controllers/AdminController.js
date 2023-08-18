// appcontas
// spfa
// app200
// apprenderparams
const fs = require("fs");
const appRootPath = require("app-root-path");
const { CategoryModel, ChildItemModel, PaymentModel, SpecificationsSoldModel, CommenteModel } = require("../model/ClientModel");
const { NotifeeModel, PostPriceModel, SellerModel, SliderModel } = require("../model/AdminModel");
const { UserModel, ProposalModel, TicketModel, SavedItemModel } = require("../model/UserModel");
var interval
const log = (value) => {console.log(value)}
function AdminController() {


}


module.exports = new AdminController();