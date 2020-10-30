const userModel = require("../../models/userModel");
const roomModel = require("../../models/roomModel");
const commentModel = require("../../models/commentModel");

exports.dashboard = async (req, res) => { 
  const totalDocumentsUsers = await userModel.find().countDocuments();
  const totalDocumentsRooms = await roomModel.find().countDocuments();
  const totalDocumentsComments = await commentModel.find().countDocuments();

  res.render("admin/pages/dashboard", {
    totalDocumentsUsers,
    totalDocumentsRooms,
    totalDocumentsComments,
  });
};
