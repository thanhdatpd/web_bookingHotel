const mongoose = require("mongoose");
const config = require("../../../config/default");
const multer = require("multer");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const roomModel = require("../../models/roomModel");
const { formatPrice } = require("./../../../libs/utils");
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
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room(req);
  const rooms = await roomModel.find({})
    .sort("-_id")
    .limit(limit)
    .skip(skip)
  res.render("admin/pages/rooms/index", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
    formatPrice,
  });
};
//add room
exports.add = (req, res) => {
  res.render("admin/pages/rooms/add");
};
exports.p_add = (req, res) => {
  upload(req, res,  function (err) {
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
      price: req.body.price,
      services: req.body.services,
      description: req.body.description,
      image: file.filename,
    });
  
     newRoom.save();
    
    return res.redirect("/admin/rooms");
    })
};
//edit room
exports.edit = async (req, res) => {
   const { id } = req.params;
   const room = await roomModel.findById(id);
   res.render("admin/pages/rooms/edit", { room});
};

//edit room
exports.p_edit =  (req, res) => {
  const { id } = req.params;
  upload(req, res, async function (err) {
    // room not choose file to edit
    if (!req.file) {
      const updateRoom = {
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        type: req.body.type,
        services: req.body.services,
        description: req.body.description,
      };
      await roomModel.updateOne({ _id: id }, updateRoom);
    } else {
      if (err instanceof multer.MulterError) {
        res.json("Lỗi định dạng, vui lòng xem lại ảnh");
      } else if (err) {
        res.json("Lỗi server quá tải , vui lòng đợi 1 lát");
      }
      const updateRoom = {
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        type: req.body.type,
        services: req.body.services,
        description: req.body.description,
        image: req.file.filename,
      };
      await roomModel.updateOne({ _id: id }, updateRoom);
    }
  });
 
};


//delete room
exports.delete = async (req, res) => {
   const { id } = req.params;
   await roomModel.deleteOne({ _id: id });
  return res.redirect("/admin/rooms");
}
