const userModel = require("../../models/userModel");
const roomModel = require("../../models/roomModel");
const commentModel = require("../../models/commentModel");
const contactModel = require("../../models/contactModel");
const billModel = require("../../models/billModel");
const { formatPrice } = require("./../../../libs/utils");

exports.dashboard = async (req, res) => { 
  const totalDocumentsUsers = await userModel.find().countDocuments();
  const totalDocumentsRooms = await roomModel.find().countDocuments();
  const totalDocumentsComments = await commentModel.find().countDocuments();
  const totalDocumentsContacts = await contactModel.find().countDocuments();
  const bills = await billModel.find()
  let totals = bills.reduce((total, bill) => {
    return total + parseInt(bill.price)
  }, 0);
  res.render("admin/pages/dashboard", {
    totalDocumentsUsers,
    totalDocumentsRooms,
    totalDocumentsComments,
    totalDocumentsContacts,
    totals,
    formatPrice,
  });
};
