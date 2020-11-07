const userModel = require("../../models/userModel");
const roomModel = require("../../models/roomModel");
const commentModel = require("../../models/commentModel");
const contactModel = require("../../models/contactModel");

exports.dashboard = async (req, res) => { 
  const totalDocumentsUsers = await userModel.find().countDocuments();
  const totalDocumentsRooms = await roomModel.find().countDocuments();
  const totalDocumentsComments = await commentModel.find().countDocuments();
  const totalDocumentsContacts = await contactModel.find().countDocuments();

  res.render("admin/pages/dashboard", {
    totalDocumentsUsers,
    totalDocumentsRooms,
    totalDocumentsComments,
    totalDocumentsContacts,
  });
};
