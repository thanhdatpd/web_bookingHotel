let mongoose = require("mongoose");
const uris = "mongodb://localhost:27017/db_bookingHotel";
mongoose.connect(uris, { useNewUrlParser: true, useUnifiedTopology: true });
let moment = require("moment");
let bookingModel = require("./src/apps/models/bookingModel");
let testModel = require("./src/apps/models/test");


const startAt = "01-12-2020"
const endAt = "07-12-2020";


const check = async () => {
  startAtFormated = moment(startAt + "+0700", "DD-MM-YYYYZ");
  endAtFormated = moment(endAt + "/23:59:59+0700", "DD-MM-YYYY/HH:mm:ssZ");
  let filter = {
    $or: [
      {
        $and: [
          { startAt: { $gte: startAtFormated } },
          { startAt: { $lt: endAtFormated } },
        ],
      },
      {
        $and: [
          { endAt: { $gte: startAtFormated } },
          { endAt: { $lt: endAtFormated } },
        ],
      },
    ],
  };
  
  let t = await testModel.find(filter);

  t.forEach(item => {
    console.log("found", item.startAt, item.endAt);
  })
}
check()




let fa = async() => {
  let a = [
    {
      startAt: new Date(2020, 11, 10),
      endAt: new Date(2020, 11, 12),
      roomId: "1",
    },
    {
      startAt: new Date(2020, 11, 13),
      endAt: new Date(2020, 11, 14),
      roomId: "2",
    },
  ];

  await testModel.insertMany(a);
}

// fa()
