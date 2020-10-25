const mongoose = require("mongoose");
const config = require("../../../config/default");
const multer = require("multer");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const roomModel = require("../../models/roomModel");
const joi = require("joi");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images/uploads/rooms/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file max 5MB
  },
}).single("image");

//get room
exports.room = async (req, res, next) => {
  const page = parseInt(req.query.page || 1);
  const limit = 2;
  const skip = (page - 1) * limit;
  const totalDocuments = await roomModel.find().countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);
  const range = [];
  const rangerForDot = [];
  const detal = 1;
  const left = page - detal;
  const right = page + detal;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }
  let temp;
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1);
      } else if (i - temp !== 1) {
        rangerForDot.push("...");
      }
    }
    temp = i;
    rangerForDot.push(i);
  });
  const rooms = await roomModel.find({})
    .sort("-_id")
    .limit(limit)
    .skip(skip)
  res.render("admin/pages/rooms/index", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
  });
};
//add room
exports.add = (req, res) => {
  res.render("admin/pages/rooms/add");
};
exports.p_add = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json("Lỗi định dạng, vui lòng xem lại ảnh"); 
    } else if (err) {
      res.json("Lỗi server quá tải , vui lòng đợi 1 lát");   
    }
    const file = req.file;
    const bodySchema = joi
      .object({
        
      })
      .unknown();
    const value =  bodySchema.validateAsync(req.body).catch((err) => err);

    if (value instanceof Error) {
      return res.redirect("/admin/rooms/add");
    }
    const newRoom = new roomModel({
      name: req.body.name,
      size: req.body.size,
      type: req.body.type,
      services: req.body.services,
      description: req.body.description,
      image: file.filename,
    });
  
     newRoom.save();

    return res.redirect("/admin/rooms");
    })
};
//edit user
exports.edit = async (req, res) => {
   const { id } = req.params;
   const room = await roomModel.findById(id);
   res.render("admin/pages/rooms/edit", { room});
};


//delete room
exports.delete = async (req, res) => {
   const { id } = req.params;
   await roomModel.deleteOne({ _id: id });
  return res.redirect("/admin/rooms");
}
