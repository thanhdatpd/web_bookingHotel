const express = require("express");
const config = require("../config/default");
const userModel = require("../apps/models/userModel");
const servicesModel = require("../apps/models/servicesModel");
const roomModel = require("../apps/models/roomModel");
const commentModel = require("../apps/models/commentModel");
const bookingModel = require("../apps/models/bookingModel");
const contactModel = require("../apps/models/contactModel");

module.exports.user = async (req) => {
   const page = parseInt(req.query.page || 1);
   const limit = config.app.LIMIT;
   const skip = (page - 1) * limit;
   const totalDocuments = await userModel.find().countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};
module.exports.services = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await servicesModel.find().countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};
module.exports.room = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = 12;
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};
module.exports.comment = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await commentModel.find().countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};

module.exports.contact = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await contactModel.find().countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};


module.exports.booking = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await bookingModel.find().countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};

module.exports.room_single = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await roomModel.find({type:"single", status: "empty"}).countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};

module.exports.room_double = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await roomModel
    .find({ type: "double", status: "empty" })
    .countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};
module.exports.room_vip = async (req) => {
  const page = parseInt(req.query.page || 1);
  const limit = config.app.LIMIT;
  const skip = (page - 1) * limit;
  const totalDocuments = await roomModel
    .find({ type: "vip", status: "empty" })
    .countDocuments();
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
  return { limit, skip, range, rangerForDot, page, totalPages };
};
