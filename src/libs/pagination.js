// const config = require("../../../config/default")

// exports.pagination = (req) => {
//     const page = parseInt(req.query.page || 1);
//     const limit = config.app.LIMIT;
//     const skip = (page - 1) * limit;
//     const totalDocuments = await userModel.find().countDocuments();
//     const totalPages = Math.ceil(totalDocuments / limit);
//     const range = [];
//     const rangerForDot = [];
//     const detal = 1;
//     const left = page - detal;
//     const right = page + detal;
//     for(let i = 1; i <= totalPages; i++) {
//   if (i === 1 || i === totalPages || (i >= left && i <= right)) {
//     range.push(i);
//   }
// }
// let temp;
// range.map((i) => {
//   if (temp) {
//     if (i - temp === 2) {
//       rangerForDot.push(i - 1);
//     } else if (i - temp !== 1) {
//       rangerForDot.push("...");
//     }
//   }
//   temp = i;
//   rangerForDot.push(i);
// });
//   return { limit, currentPage, skip, next, prev }
// };
