const router = require("express").Router();
const req = require("express/lib/request");
const multer = require("multer");
const Auth = require("../Middleware/Auth");
const AutoGame = require("../Model/AutoGame");
const Game = require("../Model/Games");
const RunningGame = require("../Model/RunningGame");
const Gamedelete = require("../Model/Gamesdelete");
const myTransaction = require("../Model/myTransaction");
const User = require("../Model/User");
const activity = require("../Model/activity");
const appserver = require("../server");
const AdminEaring = require("../Model/AdminEaring");
const path = require("path");
const ReferralHis = require("../Model/referral");
const Transactions = require("../Model/transaction");
const { saveNotification } = require("../saveNotification");
const sharp = require("sharp");
const fs = require("fs");
const { default: axios } = require("axios");

let InProcessSubmit = false;
let InProcessRequest = false;

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

var name11 = generateRandomString(8);
var name12 = generateRandomString(8);
var name21 = generateRandomString(8);
var name22 = generateRandomString(8);
var name31 = generateRandomString(8);
var name32 = generateRandomString(8);
var name41 = generateRandomString(8);
var name42 = generateRandomString(8);
var name51 = generateRandomString(8);
var name52 = generateRandomString(8);
var name61 = generateRandomString(8);
var name62 = generateRandomString(8);
var name71 = generateRandomString(8);
var name72 = generateRandomString(8);
var name81 = generateRandomString(8);
var name82 = generateRandomString(8);
var name91 = generateRandomString(8);
var name92 = generateRandomString(8);
var name101 = generateRandomString(8);
var name102 = generateRandomString(8);
var name111 = generateRandomString(8);
var name112 = generateRandomString(8);
var name121 = generateRandomString(8);
var name122 = generateRandomString(8);
var amount1 = 50;
var amount2 = 50;
var amount3 = 200;
var amount4 = 500;
var amount5 = 750;
var amount6 = 150;
var amount7 = 100;
var amount8 = 50;
var amount9 = 500;
var amount10 = 550;
var amount11 = 100;
var amount12 = 300;

var avtar1 = "public/avtar/avtar1.png";
var avtar2 = "public/avtar/avtar2.png";
var avtar3 = "public/avtar/avtar3.png";
var avtar4 = "public/avtar/avtar4.png";
var avtar5 = "public/avtar/avtar5.png";
var avtar6 = "public/avtar/avtar6.png";
var avtar7 = "public/avtar/avtar5.png";
var avtar8 = "public/avtar/avtar2.png";
var avtar9 = "public/avtar/avtar6.png";
var avtar10 = "public/avtar/avtar1.png";
var avtar11 = "public/avtar/avtar3.png";
var avtar12 = "public/avtar/avtar4.png";

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/gamedoc");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000000,
  },
});

//Game_Ammount <= 10000
router.post("/challange/create", Auth, async (req, res) => {
  const { Game_type, Game_Ammount } = req.body;

  try {
    //  return res.send({
    //                 msg: 'Site is under Maintenance',
    //                 status: false,
    //                 data: []
    //               });
    //      if(req.user.id != '63b5340bc5d2b82e4652b216'){
    // return res.send({
    //                                 msg: 'RK Ludo Server is currently down for maintainance. please wait for 15 min.',
    //                                 status: false,
    //                                 data: []
    //                               });
    // }

    const user = await User.findById(req.user.id).select("Wallet_balance -_id");

    if (Game_Ammount >= 50 && Game_Ammount <= 100000) {
      if (Game_Ammount % 50 === 0) {
        if (user.Wallet_balance >= req.body.Game_Ammount) {
          let prevGame = await RunningGame.find({
            $or: [
              {
                $or: [
                  { Status: "requested", Created_by: req.user.id },
                  { Status: "requested", Accepetd_By: req.user.id },
                ],
              },
              {
                $or: [
                  {
                    Status: "conflict",
                    Created_by: req.user.id,
                    Creator_Status: null,
                  },
                  {
                    Status: "conflict",
                    Accepetd_By: req.user.id,
                    Acceptor_status: null,
                  },
                ],
              },
              {
                $or: [
                  {
                    Status: "pending",
                    Created_by: req.user.id,
                    Creator_Status: null,
                  },
                  {
                    Status: "pending",
                    Accepetd_By: req.user.id,
                    Acceptor_status: null,
                  },
                ],
              },
              {
                $or: [
                  { Status: "running", Created_by: req.user.id },
                  { Status: "running", Accepetd_By: req.user.id },
                ],
              },
            ],
          }).count();

          // await RunningGame.deleteMany({_id:"64480ad2a6aeb9b3e80dab93"})
          //game battle limit...
          let newGame = await RunningGame.find({
            $or: [{ $and: [{ Status: "new" }, { Created_by: req.user.id }] }],
          }).count();

          if (newGame < 2) {
            if (prevGame == 0) {
              let sameGame = await RunningGame.find({
                $or: [
                  {
                    $and: [
                      { Status: "new" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                  {
                    $and: [
                      { Status: "requested" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                  {
                    $and: [
                      { Status: "running" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                ],
              }).count();

              if (sameGame == 0) {
                const game = new RunningGame({
                  Game_type,
                  Game_Ammount,
                  Created_by: req.user.id,
                });
                await game.save();
                const status = await RunningGame.find({
                  $or: [
                    { Status: "new" },
                    { Status: "requested" },
                    { Status: "running" },
                  ],
                })
                  .populate("Created_by", "Name avatar _id")
                  .populate("Accepetd_By", "Name avatar _id")
                  .populate("Winner", "Name avatar _id");

                const io = req.app.get("socketio");

                io.emit("gamelist", status);

                const status1 = await RunningGame.findById(game._id)
                  .populate("Created_by", "Name avatar _id")
                  .populate("Accepetd_By", "Name avatar _id")
                  .populate("Winner", "Name avatar _id");
                io.emit("gamecreate", status1);

                res.send(game);
                setTimeout(
                  async (ID) => {
                    const battle = await RunningGame.findById(ID);
                    if (battle != null) {
                      if (battle.Status == "new") {
                        await battle.delete();
                        const status = await RunningGame.find({
                          $or: [
                            { Status: "new" },
                            { Status: "requested" },
                            { Status: "running" },
                          ],
                        })
                          .populate("Created_by", "Name avatar _id")
                          .populate("Accepetd_By", "Name avatar _id")
                          .populate("Winner", "Name avatar _id");
                        io.emit("gamelist", status);
                      }
                    }
                  },
                  120000,
                  game._id
                );
              } else {
                return res.send({
                  msg: "you can not create same amount challenge.",
                  status: false,
                  data: [],
                });
              }
            } else {
              return res.send({
                msg: "you have already enrolled",
                status: false,
                data: [],
              });
            }
          } else {
            return res.send({
              msg: "You can set maximum 2 battle.",
              status: false,
              data: [],
            });
          }
        } else {
          return res.send({
            msg: "Insufficient balance",
            status: false,
            data: [],
          });
        }
      } else {
        return res.send({
          msg: "Set Battle in denomination of 50",
          status: false,
          data: [],
        });
      }
    } else {
      return res.send({
        msg: "Game amount should be Greater then 50 and less then 100000",
        status: false,
        data: [],
      });
    }
    //Technical Issue, Try after an hour! Game amount should be Greater then 50 and less then 10000
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/challange/auto/create", Auth, async (req, res) => {
  const { Game_type, Game_Ammount } = req.body;

  try {
    const io = req.app.get("socketio");
    //      if(req.user.id != '63b5340bc5d2b82e4652b216'){
    // return res.send({
    //                                 msg: 'RK Ludo Server is currently down for maintainance. please wait for 15 min.',
    //                                 status: false,
    //                                 data: []
    //                               });
    // }

    const user = await User.findById(req.user.id).select("Wallet_balance -_id");

    if (Game_Ammount >= 50 && Game_Ammount <= 100000) {
      if (Game_Ammount % 50 === 0) {
        if (user.Wallet_balance >= req.body.Game_Ammount) {
          let prevGame = await RunningGame.find({
            $or: [
              {
                $or: [
                  { Status: "requested", Created_by: req.user.id },
                  { Status: "requested", Accepetd_By: req.user.id },
                ],
              },
              {
                $or: [
                  {
                    Status: "conflict",
                    Created_by: req.user.id,
                    Creator_Status: null,
                  },
                  {
                    Status: "conflict",
                    Accepetd_By: req.user.id,
                    Acceptor_status: null,
                  },
                ],
              },
              {
                $or: [
                  {
                    Status: "pending",
                    Created_by: req.user.id,
                    Creator_Status: null,
                  },
                  {
                    Status: "pending",
                    Accepetd_By: req.user.id,
                    Acceptor_status: null,
                  },
                ],
              },
              {
                $or: [
                  { Status: "running", Created_by: req.user.id },
                  { Status: "running", Accepetd_By: req.user.id },
                ],
              },
            ],
          }).count();

          // await RunningGame.deleteMany({_id:"64480ad2a6aeb9b3e80dab93"})
          //game battle limit...
          let newGame = await RunningGame.find({
            $or: [{ $and: [{ Status: "new" }, { Created_by: req.user.id }] }],
          }).count();

          if (newGame < 2) {
            if (prevGame == 0) {
              let sameGame = await RunningGame.find({
                $or: [
                  {
                    $and: [
                      { Status: "new" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                  {
                    $and: [
                      { Status: "requested" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                  {
                    $and: [
                      { Status: "running" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                ],
              }).count();

              if (sameGame == 0) {
                const auto_game = await AutoGame.findOne({
                  Game_Ammount: req.body.Game_Ammount,
                });
                if (auto_game) {
                  const url = "http://64.227.172.251:5004/bot/getcode";

                  await axios
                    .get(url)
                    .then(async (room_res) => {
                      console.error("romecode auto genrate 1", room_res.data);
                      // console.error('romecode genrate 1',room_res.data.room_code);
                      if (room_res.status == 200) {
                        const Room_code = room_res.data.roomcode
                          ? room_res.data.roomcode
                          : null;
                        //  const Room_code = (room_res.data.room_code)?room_res.data.room_code:null;
                        //  const Room_code = 12345678;
                        var addActivityaa = new activity({
                          User_id: auto_game.User,
                          Req_type: "game",
                          txn_msg:
                            JSON.stringify(room_res.data) +
                            " auto hold_balance added 1, gameId: " +
                            Room_code +
                            "",
                          actionBy: "656d7ae7bfa73b0a2e8581d0",
                          ip: "192.168.0.0",
                          createdAt: currdate(),
                        });
                        await addActivityaa.save();

                        if (Room_code && Room_code != null) {
                          const game1 = new RunningGame({
                            _id: auto_game._id,
                            Game_type,
                            Game_Ammount,
                            Created_by: auto_game.User,
                            Accepetd_By: req.user.id,
                            Status: "running",
                            Room_code: Room_code,
                          });
                          await game1.save();

                          const {
                            Winner_closingbalance,
                            Loser_closingbalance,
                          } = await deduct_wallet(
                            game1.Accepetd_By,
                            game1.Created_by,
                            game1.Game_Ammount,
                            game1
                          );
                          game1.Winner_closingbalance = Winner_closingbalance;
                          game1.Loser_closingbalance = Loser_closingbalance;
                          await prevRequested(
                            game1.Created_by,
                            game1.Accepetd_By
                          );
                          await prevCreated(
                            game1.Created_by,
                            game1.Accepetd_By
                          );
                          game1.lock = false;
                          await game1.save();

                          const runningCount = await RunningGame.aggregate([
                            {
                              $group: {
                                _id: "$Game_Ammount",
                                count: {
                                  $sum: 1,
                                },
                                users: {
                                  $push: {
                                    Created_by: "$Created_by",
                                    Accepetd_By: "$Accepetd_By",
                                  },
                                },
                              },
                            },
                            {
                              $project: {
                                _id: 0,
                                amount: "$_id",
                                users: 1,
                                count: 1,
                              },
                            },
                          ]);
                          const auto_gameCount = await AutoGame.aggregate([
                            {
                              $group: {
                                _id: "$Game_Ammount",
                                count: {
                                  $sum: 1,
                                },
                                users: {
                                  $push: {
                                    users: "$User",
                                  },
                                },
                              },
                            },
                            {
                              $project: {
                                _id: 0,
                                amount: "$_id",
                                users: 1,
                                count: 1,
                              },
                            },
                          ]);
                          await AutoGame.deleteOne({ _id: auto_game._id });
                          io.emit("gameCount", {
                            auto_gameCount: auto_gameCount,
                            runningCount: runningCount,
                          });
                          io.emit("matchstart", game1);

                          res.status(200).send({
                            status: true,
                            msg: "Match Started",
                            data: game1,
                            auto_gameCount: auto_gameCount,
                            runningCount: runningCount,
                          });
                        } else {
                          await RunningGame.findOneAndUpdate(
                            { _id: req.params.id, lock: true },
                            { $set: { lock: false } },
                            { returnOriginal: false }
                          );
                          res
                            .status(200)
                            .send({ status: false, msg: "No game found" });
                        }
                      }
                    })
                    .catch(async (err) => {
                      console.log("room err", err);
                      res.status(200).send({ status: false, msg: err.message });
                    });
                } else {
                  const game = new AutoGame({
                    Game_type,
                    Game_Ammount,
                    User: req.user.id,
                  });
                  await game.save();

                  const runningCount = await RunningGame.aggregate([
                    {
                      $group: {
                        _id: "$Game_Ammount",
                        count: {
                          $sum: 1,
                        },
                        users: {
                          $push: {
                            Created_by: "$Created_by",
                            Accepetd_By: "$Accepetd_By",
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        amount: "$_id",
                        users: 1,
                        count: 1,
                      },
                    },
                  ]);
                  const auto_gameCount = await AutoGame.aggregate([
                    {
                      $group: {
                        _id: "$Game_Ammount",
                        count: {
                          $sum: 1,
                        },
                        users: {
                          $push: {
                            users: "$User",
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        amount: "$_id",
                        users: 1,
                        count: 1,
                      },
                    },
                  ]);
                  io.emit("gameCount", {
                    auto_gameCount: auto_gameCount,
                    runningCount: runningCount,
                  });

                  res.send(game);
                  setTimeout(
                    async (ID) => {
                      const battle = await AutoGame.findById(ID);
                      if (battle != null) {
                        if (battle.Status == "new") {
                          await AutoGame.deleteOne({ _id: ID });
                        }
                      }
                    },
                    120000,
                    game._id
                  );
                }
              } else {
                return res.send({
                  msg: "you can not create same amount challenge.",
                  status: false,
                  data: [],
                });
              }
            } else {
              return res.send({
                msg: "you have already enrolled",
                status: false,
                data: [],
              });
            }
          } else {
            return res.send({
              msg: "You can set maximum 2 battle.",
              status: false,
              data: [],
            });
          }
        } else {
          return res.send({
            msg: "Insufficient balance",
            status: false,
            data: [],
          });
        }
      } else {
        return res.send({
          msg: "Set Battle in denomination of 50",
          status: false,
          data: [],
        });
      }
    } else {
      return res.send({
        msg: "Game amount should be Greater then 50 and less then 100000",
        status: false,
        data: [],
      });
    }
    //Technical Issue, Try after an hour! Game amount should be Greater then 50 and less then 10000
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/completed", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "completed" }).countDocuments();

    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

async function prevCreated(creator, acceptor) {
  const games = await RunningGame.deleteMany({
    Status: "new",
    lock: false,
    Created_by: creator,
  });

  const games1 = await RunningGame.deleteMany({
    Status: "new",
    lock: false,
    Created_by: acceptor,
  });
}
async function prevRequested(creator, acceptor) {
  // for creator
  const creatorGames = await RunningGame.findOneAndUpdate(
    { Status: "requested", lock: false, Accepetd_By: creator },
    { $set: { lock: true } },
    { returnOriginal: false }
  );

  if (creatorGames && creatorGames.length) {
    creatorGames.forEach(async (ele) => {
      ele.Accepetd_By = null;
      ele.Status = "new";
      ele.lock = false;
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }

  const creatorGames1 = await RunningGame.deleteMany({
    Status: "requested",
    lock: false,
    Created_by: creator,
  });

  // for acceptor
  const acceptorGames = await RunningGame.findOneAndUpdate(
    { Status: "requested", Accepetd_By: acceptor, lock: false },
    { $set: { lock: true } },
    { returnOriginal: false }
  );

  if (acceptorGames && acceptorGames.length) {
    acceptorGames.forEach(async (ele) => {
      ele.Accepetd_By = null;
      ele.Status = "new";
      ele.lock = false;
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }

  const acceptorGames1 = await RunningGame.deleteMany({
    Status: "requested",
    Created_by: acceptor,
    lock: false,
  });
}
router.get("/challange/active", Auth, async (req, res) => {
  try {
    const admin = await RunningGame.find({ Status: "new" }).countDocuments();

    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/running", Auth, async (req, res) => {
  try {
    const admin = await RunningGame.find({
      Status: "running",
    }).countDocuments();

    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/cancelled", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "cancelled" }).countDocuments();

    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/admin/challange/all", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await RunningGame.countDocuments({});
    const status = await RunningGame.find()
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    //res.status(200).send(status)
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/admin/challange/dashboard/all", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;

  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await RunningGame.countDocuments({
      $or: [
        { Status: "new" },
        { Status: "running" },
        { Status: "conflict" },
        { Status: "requested" },
        { Status: "pending" },
      ],
    });
    const status = await RunningGame.find({
      $or: [
        { Status: "new" },
        { Status: "running" },
        { Status: "conflict" },
        { Status: "requested" },
        { Status: "pending" },
      ],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    //res.status(200).send(status)
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/get_challange/user/:id", Auth, async (req, res) => {
  try {
    const status0 = await RunningGame.find({
      $or: [{ Created_by: req.params.id }, { Accepetd_By: req.params.id }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 });
    const status1 = await Game.find({
      $or: [{ Created_by: req.params.id }, { Accepetd_By: req.params.id }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 });
    const status = status0.concat(status1);
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/challange/completed_challange", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Game.countDocuments({
      $and: [{ Status: "completed" }],
    });
    const status = await Game.find({ $and: [{ Status: "completed" }] })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/challange/conflict_challange", Auth, async (req, res) => {
  try {
    const status = await RunningGame.find({ $and: [{ Status: "conflict" }] })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/challange/cancelled_challange", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Game.countDocuments({
      $and: [{ Status: "cancelled" }],
    });
    const status = await Game.find({ $and: [{ Status: "cancelled" }] })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/challange/running_challange", Auth, async (req, res) => {
  try {
    const status = await RunningGame.find({
      $or: [{ Status: "running" }, { Status: "drop" }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/challange/new_challange", Auth, async (req, res) => {
  try {
    const status = await RunningGame.find({ $and: [{ Status: "new" }] })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/all", Auth, async (req, res) => {
  try {
    const status = await RunningGame.find({
      $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/some", Auth, async (req, res) => {
  try {
    const status = await RunningGame.find({
      $or: [
        { $or: [{ Status: "conflict" }] },
        { $or: [{ Status: "running" }] },
        { $or: [{ Status: "panding" }] },
      ],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/:id", Auth, async (req, res) => {
  try {
    let admin = await RunningGame.findById(req.params.id)
      .populate("Created_by", "Name avatar _id hold_balance")
      .populate("Accepetd_By", "Name avatar _id hold_balance")
      .populate("Winner", "Name avatar _id")
      .populate("action_by");
    if (!admin) {
      admin = await Game.findById(req.params.id)
        .populate("Created_by", "Name avatar _id hold_balance")
        .populate("Accepetd_By", "Name avatar _id hold_balance")
        .populate("Winner", "Name avatar _id")
        .populate("action_by");
    }
    res.status(200).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/challange/roomcode/:id", Auth, async (req, res) => {
  try {
    const user = req.user.id;
    const game = await RunningGame.findById(req.params.id);
    console.error(game.Game_type, "game.Game_type");
    // if((game.Game_type != 'ludo-classic-rich-manual') || (game.Game_type != "ludo-classic-lite-manual")){
    //                      return res.send({
    //                     msg: 'Comming Soon',
    //                     status: false,
    //                     data: []
    //                   });
    // }

    if (game.Created_by == user && game.Status == "running") {
      const game1 = await RunningGame.findByIdAndUpdate(
        req.params.id,
        { Room_code: req.body.Room_code },
        { new: true }
      );

      const openBattle = await RunningGame.find({
        $or: [
          { Status: "new" },
          { Status: "requested" },
          { Status: "running" },
        ],
      })
        .populate("Created_by")
        .populate("Accepetd_By")
        .populate("Winner");
      const runningBattle = await RunningGame.find({
        $or: [
          { Status: "running" },
          { Status: "pending" },
          { Status: "conflict" },
        ],
      })
        .populate("Created_by", "Name avatar _id")
        .populate("Accepetd_By", "Name avatar _id")
        .populate("Winner", "Name avatar _id");
      const data = { openBattle: openBattle, runningBattle: runningBattle };

      const io = req.app.get("socketio");
      io.emit("acceptor_seen", data);
      io.emit("updateroomcode", game1);
      res.status(200).send(game1);
    } else {
      res.status(200).send("Sorry");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch(
  "/challange/requested/running/:gameType/:id",
  Auth,
  async (req, res) => {
    try {
      const user = req.user.id;

      const game = await RunningGame.findOneAndUpdate(
        { _id: req.params.id, lock: false },
        { $set: { lock: true } },
        { returnOriginal: false }
      );
      if (!game) {
        console.log("Conflict detected - please try again." + req.user.id);
        return res.status(200).send({
          status: false,
          msg: "Conflict detected - please try again.",
        });
      }

      setTimeout(
        async (GameID) => {
          const running = await RunningGame.findOneAndUpdate(
            { _id: req.params.id, lock: true },
            { $set: { lock: false } },
            { returnOriginal: false }
          );
        },
        4000,
        req.params.id
      );

      //check mismatch and hold
      const mismatchValue =
        req.user.Wallet_balance -
        (req.user.wonAmount -
          req.user.loseAmount +
          req.user.totalDeposit +
          req.user.referral_earning +
          req.user.totalBonus -
          (req.user.totalWithdrawl +
            req.user.referral_wallet +
            req.user.withdraw_holdbalance +
            req.user.hold_balance +
            req.user.totalPenalty));

      if (mismatchValue != 0) {
        res.status(200).send({
          status: false,
          msg: "Game Mismatch Exist. Please connect with support",
        });
      } else if (req.user.hold_balance < 0) {
        res.status(200).send({
          status: false,
          msg: "Wallet balance on hold. Please complete your game or connect with support",
        });
      } else if (
        game &&
        game.Created_by == user &&
        game.Status == "requested"
      ) {
        if (req.user.Wallet_balance < game.Game_Ammount) {
          return res
            .status(200)
            .send({ status: false, msg: "low wallet balance." });
        }
        let url = "http://64.227.172.251:5004/bot/getcode";
        const gameType = req.params.gameType;
        if (gameType == "ludo-classic-lite") {
          url = "http://ludoking.rkgames.online/bot/getcode";
        } else if (gameType == "ludo-classic-rich") {
          url = "http://ludoking.rkgames.online/bot/getcode";
        } else if (gameType == "Ludo Host") {
          url = "http://64.227.172.251:5004/bot/getcode";
        }

        await axios
          .get(url)

          .then(async (room_res) => {
            console.error("romecode genrate 1", room_res.data, gameType);
            // console.error('romecode genrate 1',room_res.data.room_code);
            if (room_res.status == 200) {
              const Room_code = room_res.data.roomcode
                ? room_res.data.roomcode
                : null;
              //  const Room_code = (room_res.data.room_code)?room_res.data.room_code:null;
              //  const Room_code = 12345678;
              var addActivityaa = new activity({
                User_id: game.Created_by,
                Req_type: "game",
                txn_msg:
                  JSON.stringify(room_res.data) +
                  " hold_balance added 1, gameId: " +
                  game._id +
                  "",
                actionBy: "656d7ae7bfa73b0a2e8581d0",
                ip: "192.168.0.0",
                createdAt: currdate(),
              });
              await addActivityaa.save();

              if (game != null && Room_code && Room_code != null) {
                const game1 = await RunningGame.findByIdAndUpdate(
                  req.params.id,
                  { Status: "running" }
                )
                  .where("Status")
                  .equals("requested")
                  .where("Accepetd_By")
                  .ne(null);
                if (game1) {
                  game1.Room_code = Room_code;
                  const { Winner_closingbalance, Loser_closingbalance } =
                    await deduct_wallet(
                      game1.Accepetd_By,
                      game1.Created_by,
                      game1.Game_Ammount,
                      game1
                    );
                  game1.Winner_closingbalance = Winner_closingbalance;
                  game1.Loser_closingbalance = Loser_closingbalance;
                  await prevRequested(game.Created_by, game.Accepetd_By);
                  await prevCreated(game.Created_by, game.Accepetd_By);
                  game1.lock = false;
                  await game1.save();

                  const status = await RunningGame.find({
                    $or: [
                      { Status: "new" },
                      { Status: "requested" },
                      { Status: "running" },
                    ],
                  })
                    .populate("Created_by", "Name avatar _id")
                    .populate("Accepetd_By", "Name avatar _id")
                    .populate("Winner", "Name avatar _id");
                  const io = req.app.get("socketio");
                  io.emit("startAcepptor", status);

                  res
                    .status(200)
                    .send({ status: true, msg: "Match Started", data: game1 });
                } else {
                  res
                    .status(200)
                    .send({ status: false, msg: "No roomcode found" });
                }
              } else {
                await RunningGame.findOneAndUpdate(
                  { _id: req.params.id, lock: true },
                  { $set: { lock: false } },
                  { returnOriginal: false }
                );
                res.status(200).send({ status: false, msg: "No game found" });
              }
            }
          })
          .catch(async (err) => {
            await RunningGame.findOneAndUpdate(
              { _id: req.params.id, lock: true },
              { $set: { lock: false } },
              { returnOriginal: false }
            );
            console.log("room err", err);
            res.status(200).send({ status: false, msg: err.message });
          });
      } else {
        await RunningGame.findOneAndUpdate(
          { _id: req.params.id, lock: true },
          { $set: { lock: false } },
          { returnOriginal: false }
        );
        console.error("No game found !");
        return res.status(200).send({ status: false, msg: "No game found !" });
      }
    } catch (e) {
      await RunningGame.findOneAndUpdate(
        { _id: req.params.id, lock: true },
        { $set: { lock: false } },
        { returnOriginal: false }
      );
      res.status(400).send({ status: false, msg: e.message });
    }
  }
);
router.patch("/challange/requested/running/:id", Auth, async (req, res) => {
  try {
    const user = req.user.id;

    const game = await RunningGame.findOneAndUpdate(
      { _id: req.params.id, lock: false },
      { $set: { lock: true } },
      { returnOriginal: false }
    );
    if (!game) {
      console.log("Conflict detected - please try again." + req.user.id);
      return res
        .status(200)
        .send({ status: false, msg: "Conflict detected - please try again." });
    }

    setTimeout(
      async (GameID) => {
        const running = await RunningGame.findOneAndUpdate(
          { _id: req.params.id, lock: true },
          { $set: { lock: false } },
          { returnOriginal: false }
        );
      },
      4000,
      req.params.id
    );

    //check mismatch and hold
    const mismatchValue =
      req.user.Wallet_balance -
      (req.user.wonAmount -
        req.user.loseAmount +
        req.user.totalDeposit +
        req.user.referral_earning +
        req.user.totalBonus -
        (req.user.totalWithdrawl +
          req.user.referral_wallet +
          req.user.withdraw_holdbalance +
          req.user.hold_balance +
          req.user.totalPenalty));

    if (mismatchValue != 0) {
      res.status(200).send({
        status: false,
        msg: "Game Mismatch Exist. Please connect with support",
      });
    } else if (req.user.hold_balance < 0) {
      res.status(200).send({
        status: false,
        msg: "Wallet balance on hold. Please complete your game or connect with support",
      });
    } else if (game && game.Created_by == user && game.Status == "requested") {
      if (req.user.Wallet_balance < game.Game_Ammount) {
        return res
          .status(200)
          .send({ status: false, msg: "low wallet balance." });
      }
      const game1 = await RunningGame.findByIdAndUpdate(req.params.id, {
        Status: "running",
      })
        .where("Status")
        .equals("requested")
        .where("Accepetd_By")
        .ne(null);
      if (game1) {
        game1.Room_code = 0;
        const { Winner_closingbalance, Loser_closingbalance } =
          await deduct_wallet(
            game1.Accepetd_By,
            game1.Created_by,
            game1.Game_Ammount,
            game1
          );
        game1.Winner_closingbalance = Winner_closingbalance;
        game1.Loser_closingbalance = Loser_closingbalance;
        await prevRequested(game.Created_by, game.Accepetd_By);
        await prevCreated(game.Created_by, game.Accepetd_By);
        game1.lock = false;
        await game1.save();

        const status = await RunningGame.find({
          $or: [
            { Status: "new" },
            { Status: "requested" },
            { Status: "running" },
          ],
        })
          .populate("Created_by", "Name avatar _id")
          .populate("Accepetd_By", "Name avatar _id")
          .populate("Winner", "Name avatar _id");
        const io = req.app.get("socketio");
        io.emit("startAcepptor", status);

        res
          .status(200)
          .send({ status: true, msg: "Match Started", data: game1 });
      } else {
        res.status(200).send({ status: false, msg: "No game found" });
      }
    } else {
      await RunningGame.findOneAndUpdate(
        { _id: req.params.id, lock: true },
        { $set: { lock: false } },
        { returnOriginal: false }
      );
      console.error("No game found !");
      return res.status(200).send({ status: false, msg: "No game found !" });
    }
  } catch (e) {
    await RunningGame.findOneAndUpdate(
      { _id: req.params.id, lock: true },
      { $set: { lock: false } },
      { returnOriginal: false }
    );
    res.status(400).send({ status: false, msg: e.message });
  }
});

router.get("/challange/unlock/:id/:type", async (req, res) => {
  if (req.params.type == "list") {
    const running = await RunningGame.find({ lock: true });
    if (!running) {
      res
        .status(200)
        .send({ status: false, msg: "Conflict detected - please try again." });
    } else {
      res.status(200).send({ status: false, msg: "lock game", data: running });
    }
  } else if (req.params.type == "update") {
    const running = await RunningGame.updateMany(
      { lock: true },
      { $set: { lock: false } }
    );

    res.status(200).send({
      status: false,
      msg: "Conflict detected - please try again.",
      data: running,
    });
  } else {
    const running = await RunningGame.findOneAndUpdate(
      { _id: req.params.id, lock: true },
      { $set: { lock: false } },
      { returnOriginal: false }
    );
    if (!running) {
      res
        .status(200)
        .send({ status: false, msg: "Conflict detected - please try again." });
    }
  }
});

router.post(
  "/challange/result/:id",
  Auth,
  upload.array("file"),
  async (req, res) => {
    try {
      const running = await RunningGame.findOneAndUpdate(
        { _id: req.params.id, lock: false },
        { $set: { lock: true } },
        { returnOriginal: false }
      )
        .populate("creator", "Name _id firebaseToken")
        .populate("acceptor", "Name _id firebaseToken");

      if (!running) {
        res.status(200).send({
          status: false,
          msg: "Conflict detected - please try again.",
        });
      }

      setTimeout(
        async (GameID) => {
          const running = await RunningGame.findOneAndUpdate(
            { _id: req.params.id, lock: true },
            { $set: { lock: false } },
            { returnOriginal: false }
          );
        },
        3000,
        req.params.id
      );

      //remove duplicate
      const existNew = await Game.countDocuments(
        { _id: req.params.id },
        { limit: 1 }
      );
      var addActivity3 = new activity({
        User_id: req.user.id,
        Req_type: "game",
        txn_msg: JSON.stringify(existNew),
        actionBy: "656d7ae7bfa73b0a2e8581d0",
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        createdAt: currdate(),
      });
      await addActivity3.save();
      if (existNew != 0) {
        await RunningGame.findByIdAndDelete(req.params.id);
        var addActivity = new activity({
          User_id: req.user.id,
          Req_type: "game",
          txn_msg: "game delete on result repost. GameId:" + req.params.id,
          actionBy: "656d7ae7bfa73b0a2e8581d0",
          ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          createdAt: currdate(),
        });
        await addActivity.save();
        return res
          .status(200)
          .send({ status: false, msg: "Result Already Post." });
      } else {
        if (
          running &&
          running.Status != "cancelled" &&
          running.Status != "completed"
        ) {
          const reqUser = req.user.id;
          // console.error(running.Room_code,req.body.status,'result')
          if (
            (running.Room_code == null || running.Room_code == "") &&
            (req.body.status == "lose" || req.body.status == "winn")
          ) {
            running.lock = false;
            await running.save();
            return res.status(200).send({
              status: false,
              msg: "You cannot win or lose when room code not available. Please cancel this game.",
            });
          }

          //player status update
          const field =
            running.Created_by == reqUser
              ? "Creator_Status"
              : running.Accepetd_By == reqUser
              ? "Acceptor_status"
              : undefined;
          const fieldUpdatedAt =
            running.Created_by == reqUser
              ? "Creator_Status_Updated_at"
              : running.Accepetd_By == reqUser
              ? "Acceptor_status_Updated_at"
              : undefined;
          running[field] = req.body.status;
          running[fieldUpdatedAt] = Date.now();

          //if scrnshot comes with status
          if (req.files) {
            const file =
              running.Created_by == reqUser
                ? "Creator_Screenshot"
                : running.Accepetd_By == reqUser
                ? "Acceptor_screenshot"
                : undefined;
            let path = "";
            req.files.forEach(function (files) {
              path = path + files.path + " , ";
            });
            path = path.substring(0, path.lastIndexOf(" , "));
            running[file] = path;
          }

          // if (req.files && typeof req.files[0] !== 'undefined') {
          //     const file = (running.Created_by == reqUser) ? 'Creator_Screenshot' : ((running.Accepetd_By == reqUser) ? 'Acceptor_screenshot' : undefined);

          //     fs.access("./public/gamedoc/", (error) => {
          //         if (error) {
          //           fs.mkdirSync("./public/gamedoc/");
          //         }
          //       });
          //       const { buffer, originalname } = req.files[0];
          //       const uniqueSuffix = Date.now() + "-1-" + Math.round(Math.random() * 1e9);

          //       const ref = `${uniqueSuffix}.webp`;
          //       await sharp(buffer)
          //         .webp({ quality: 20 })
          //         .toFile("./public/gamedoc/" + ref);
          //         game[file]= "./public/gamedoc/" + ref
          // }

          // if game cancelled and reason comes
          if (req.body.status == "cancelled") {
            const reason =
              running.Created_by == reqUser
                ? "Creator_Status_Reason"
                : running.Accepetd_By == reqUser
                ? "Acceptor_status_reason"
                : undefined;
            running[reason] = req.body.reason;
          }

          if (
            running.Creator_Status == null ||
            running.Acceptor_status == null
          ) {
            // running.Status = 'pending';
            const updateResult = await RunningGame.findByIdAndUpdate(
              req.params.id,
              { Status: "pending" }
            )
              .where("Status")
              .equals("running");

            if (updateResult != null) {
              setTimeout(
                async (GameID) => {
                  const game = await RunningGame.findById(GameID);
                  if (game != null)
                    if (game.Status == "pending") {
                      game.Status = "conflict";
                      await game.save();
                    }
                },
                300000,
                req.params.id
              );
              running.lock = false;
              await running.save();
              res.status(200).send(updateResult);
            }
          } else if (
            running.Creator_Status == "lose" &&
            running.Acceptor_status == "cancelled"
          ) {
            // running.Status = "cancelled";
            // let updateResult = await running.findByIdAndUpdate(req.params.id, { Status: 'cancelled' }).where("Status").equals('running');
            // if (updateResult == null) {
            //     updateResult = await running.findByIdAndUpdate(req.params.id, { Status: 'cancelled' }).where("Status").equals('pending');
            // }
            // if (updateResult == null) {
            //     updateResult = await running.findByIdAndUpdate(req.params.id, { Status: 'cancelled' }).where("Status").equals('conflict');
            // }
            running.Status = "cancelled";
            running.Table_id = running._id.toString();
            const updateResult = new Game(running.toObject());
            if (updateResult != null) {
              // const { Winner_closingbalance, Loser_closingbalance } = await add_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount)

              // add wallet start
              const user1 = await User.findById(running.Accepetd_By);
              const user2 = await User.findById(running.Created_by);
              user2.Wallet_balance += running.Game_Ammount;
              user1.Wallet_balance += running.Game_Ammount;
              //                     activity.create([{
              //     order_id: 'Customer2',
              //     User_id: 10,
              //     amount: running.Game_Ammount,
              //     Req_type: 'unhold',
              //     txn_msg: running.Game_Ammount+' re',
              // },
              // { name: 'Customer3', orderCount: 20 }])
              //   .then(result => {
              //     console.log(result)
              // })
              // user2.withdrawAmount += running.Game_Ammount;
              // user1.withdrawAmount += running.Game_Ammount;
              user2.withdrawAmount += running.creatorWithdrawDeducted;
              user1.withdrawAmount += running.acceptorWithdrawDeducted;
              user1.hold_balance -= running.Game_Ammount;
              user2.hold_balance -= running.Game_Ammount;
              await user2.save();
              await user1.save();
              // add wallet end

              updateResult.Winner_closingbalance += running.Game_Ammount;
              updateResult.Loser_closingbalance += running.Game_Ammount;
              var status = await updateResult.save();
              await RunningGame.findByIdAndDelete(running._id);

              // Notification
              const other = [];
              const userinfo = [];
              userinfo.push(running.creator);
              userinfo.push(running.acceptor);
              other["type"] = "game";
              const notification_type = "firebase";
              const title =
                "Roomcode " + running.Room_code + " match cancelled ❌";
              const body =
                "Oh no! Your match 🎲 has been canceled. But don't give up just yet! find 😎 your next match and earn🤑🤑 big";
              const send_to = "users";
              const msg_type = "game";
              const sendto_array = userinfo;

              saveNotification(
                notification_type,
                title,
                body,
                send_to,
                msg_type,
                sendto_array,
                other
              );

              res.status(200).send(updateResult);
            }
          } else if (
            running.Creator_Status == "cancelled" &&
            running.Acceptor_status == "lose"
          ) {
            // running.Status = "cancelled";
            running.Status = "cancelled";

            const updateResult = new Game(running.toObject());
            updateResult.Table_id = running._id.toString();
            if (updateResult != null) {
              // const { Winner_closingbalance, Loser_closingbalance } = await add_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount)
              // add wallet start
              const user1 = await User.findById(running.Accepetd_By);
              const user2 = await User.findById(running.Created_by);
              user2.Wallet_balance += running.Game_Ammount;
              user1.Wallet_balance += running.Game_Ammount;
              // user2.withdrawAmount += running.Game_Ammount;
              // user1.withdrawAmount += running.Game_Ammount;
              user2.withdrawAmount += running.creatorWithdrawDeducted;
              user1.withdrawAmount += running.acceptorWithdrawDeducted;
              user1.hold_balance -= running.Game_Ammount;
              user2.hold_balance -= running.Game_Ammount;
              await user2.save();
              await user1.save();
              // add wallet end

              updateResult.Winner_closingbalance += running.Game_Ammount;
              updateResult.Loser_closingbalance += running.Game_Ammount;
              var status = await updateResult.save();
              await RunningGame.findByIdAndDelete(running._id);
              // Notification
              const other = [];
              const userinfo = [];
              userinfo.push(running.creator);
              userinfo.push(running.acceptor);
              other["type"] = "game";
              const notification_type = "firebase";
              const title =
                "Roomcode " + running.Room_code + " match cancelled ❌";
              const body =
                "Oh no! Your match 🎲 has been canceled. But don't give up just yet! find 😎 your next match and earn🤑🤑 big";
              const send_to = "users";
              const msg_type = "game";
              const sendto_array = userinfo;

              saveNotification(
                notification_type,
                title,
                body,
                send_to,
                msg_type,
                sendto_array,
                other
              );
              res.status(200).send(updateResult);
            }
          } else if (
            running.Creator_Status == "cancelled" &&
            running.Acceptor_status == "cancelled"
          ) {
            // running.Status = "cancelled";
            running.Status = "cancelled";

            const updateResult = new Game(running.toObject());
            updateResult.Table_id = running._id.toString();
            if (updateResult != null) {
              // const { Winner_closingbalance, Loser_closingbalance } = await add_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount)
              // add wallet start
              const user1 = await User.findById(running.Accepetd_By);
              const user2 = await User.findById(running.Created_by);
              user2.Wallet_balance += running.Game_Ammount;
              user1.Wallet_balance += running.Game_Ammount;

              var addActivity = new activity({
                User_id: user2._id,
                Req_type: "game",
                txn_msg:
                  user2.Name +
                  " hold_balance removed 5, gameId:" +
                  running._id +
                  ". current hold balance " +
                  user2.hold_balance +
                  " Wallet_balance:" +
                  user2.Wallet_balance,
                actionBy: "656d7ae7bfa73b0a2e8581d0",
                ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                createdAt: currdate(),
              });
              await addActivity.save();

              var addActivity1 = new activity({
                User_id: user1._id,
                Req_type: "game",
                txn_msg:
                  user1.Name +
                  " hold_balance removed 5, gameId:" +
                  running._id +
                  ". current hold balance " +
                  user1.hold_balance +
                  " Wallet_balance:" +
                  user1.Wallet_balance,
                actionBy: "656d7ae7bfa73b0a2e8581d0",
                ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                createdAt: currdate(),
              });
              await addActivity1.save();

              // user2.withdrawAmount += running.Game_Ammount;
              // user1.withdrawAmount += running.Game_Ammount;
              user2.withdrawAmount += running.creatorWithdrawDeducted;
              user1.withdrawAmount += running.acceptorWithdrawDeducted;
              user1.hold_balance -= running.Game_Ammount;
              user2.hold_balance -= running.Game_Ammount;

              await user2.save();
              await user1.save();
              var addActivity3 = new activity({
                User_id: user2._id,
                Req_type: "game",
                txn_msg:
                  user2.Name +
                  " hold_balance removed done 5, gameId:" +
                  running._id +
                  ". current hold balance " +
                  user2.hold_balance +
                  " Wallet_balance:" +
                  user2.Wallet_balance,
                actionBy: "656d7ae7bfa73b0a2e8581d0",
                ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                createdAt: currdate(),
              });
              await addActivity3.save();

              var addActivity4 = new activity({
                User_id: user1._id,
                Req_type: "game",
                txn_msg:
                  user1.Name +
                  " hold_balance removed done 5, gameId:" +
                  running._id +
                  ". current hold balance " +
                  user1.hold_balance +
                  " Wallet_balance:" +
                  user2.Wallet_balance,
                actionBy: "656d7ae7bfa73b0a2e8581d0",
                ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                createdAt: currdate(),
              });
              await addActivity4.save();
              // add wallet end
              updateResult.Winner_closingbalance += running.Game_Ammount;
              updateResult.Loser_closingbalance += running.Game_Ammount;
              var status = await updateResult.save();
              await RunningGame.findByIdAndDelete(running._id);
              // Notification
              const other = [];
              const userinfo = [];
              userinfo.push(running.creator);
              userinfo.push(running.acceptor);
              other["type"] = "game";
              const notification_type = "firebase";
              const title =
                "Roomcode " + running.Room_code + " match cancelled ❌";
              const body =
                "Oh no! Your match 🎲 has been canceled. But don't give up just yet! find 😎 your next match and earn🤑🤑 big";
              const send_to = "users";
              const msg_type = "game";
              const sendto_array = userinfo;

              saveNotification(
                notification_type,
                title,
                body,
                send_to,
                msg_type,
                sendto_array,
                other
              );
              res.status(200).send(updateResult);
            }
          } else if (
            running.Creator_Status == "lose" &&
            running.Acceptor_status == "lose"
          ) {
            // running.Status = "cancelled";
            running.Status = "cancelled";

            const updateResult = new Game(running.toObject());
            updateResult.Table_id = running._id.toString();
            if (updateResult != null) {
              // const { Winner_closingbalance, Loser_closingbalance } = await add_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount)
              // add wallet start
              const user1 = await User.findById(running.Accepetd_By);
              const user2 = await User.findById(running.Created_by);
              user2.Wallet_balance += running.Game_Ammount;
              user1.Wallet_balance += running.Game_Ammount;
              // user2.withdrawAmount += running.Game_Ammount;
              // user1.withdrawAmount += running.Game_Ammount;
              user2.withdrawAmount += running.creatorWithdrawDeducted;
              user1.withdrawAmount += running.acceptorWithdrawDeducted;
              user1.hold_balance -= running.Game_Ammount;
              user2.hold_balance -= running.Game_Ammount;
              // if(user2.hold_balance <0 ){
              //     console.error('user 2 hold is negative', user2._id+', '+user2.hold_balance+', '+running._id+', '+user2.Wallet_balance)
              // }
              // if(user1.hold_balance <0 ){
              //     console.error('user 2 hold is negative', user1._id+', '+user1.hold_balance+', '+running._id+', '+user1.Wallet_balance)
              // }
              await user2.save();
              await user1.save();
              // add wallet end
              updateResult.Winner_closingbalance += running.Game_Ammount;
              updateResult.Loser_closingbalance += running.Game_Ammount;

              var status = await updateResult.save();
              await RunningGame.findByIdAndDelete(running._id);
              // Notification
              const other = [];
              const userinfo = [];
              userinfo.push(running.creator);
              userinfo.push(running.acceptor);
              other["type"] = "game";
              const notification_type = "firebase";
              const title =
                "Roomcode " + running.Room_code + " match cancelled ❌";
              const body =
                "Oh no! Your match 🎲 has been canceled. But don't give up just yet! find 😎 your next match and earn🤑🤑 big";
              const send_to = "users";
              const msg_type = "game";
              const sendto_array = userinfo;

              saveNotification(
                notification_type,
                title,
                body,
                send_to,
                msg_type,
                sendto_array,
                other
              );
              res.status(200).send(updateResult);
            }
          } else if (
            (running.Creator_Status == "winn" &&
              running.Acceptor_status == "winn") ||
            (running.Creator_Status == "cancelled" &&
              running.Acceptor_status == "winn") ||
            (running.Creator_Status == "winn" &&
              running.Acceptor_status == "cancelled")
          ) {
            // deduct_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount)

            running.Status = "conflict";
            running.Table_id = running._id.toString();
            running.lock = false;
            // let updateResult = new Game(running);
            var status = await running.save();

            // Notification
            const other = [];
            const userinfo = [];
            userinfo.push(running.creator);
            userinfo.push(running.acceptor);
            other["type"] = "game";
            const notification_type = "firebase";
            const title =
              "Roomcode " + running.Room_code + " match on conflict 😬";
            const body =
              "We're sorry, but there was a conflict with your match 🎲. But still you can play next match. ⏭️ let's start new.";
            const send_to = "users";
            const msg_type = "game";
            const sendto_array = userinfo;

            saveNotification(
              notification_type,
              title,
              body,
              send_to,
              msg_type,
              sendto_array,
              other
            );
            res.status(200).send(status);
          } else if (
            (running.Creator_Status == "winn" &&
              running.Acceptor_status == "lose") ||
            (running.Creator_Status == "lose" &&
              running.Acceptor_status == "winn")
          ) {
            // running.Status = 'completed';

            running.Status = "completed";
            running.Table_id = running._id.toString();
            const updateResult = new Game(running.toObject());
            if (updateResult != null) {
              // let winner,losser;
              // winner loser statemenet
              // running.Creator_Status=='winn'? (winner= running.Created_by,losser=running.Accepetd_By): running.Acceptor_status=='winn'?(winner= running.Accepetd_By,losser=running.Created_by):undefined;

              //  const { winnAmount, earnAdmin } = adminProfit(running.Game_Ammount,winner);

              if (
                running.Creator_Status == "winn" &&
                running.Acceptor_status == "lose"
              ) {
                const { winnAmount, earnAdmin } = await adminProfit(
                  running.Game_Ammount,
                  running.Created_by
                );
                // const {Winner_closingbalance} =
                // await update_wallet(running.Created_by, running.Accepetd_By, running.Game_Ammount, winnAmount);
                await update_wallet(
                  running.Created_by,
                  running.Accepetd_By,
                  running.Game_Ammount,
                  winnAmount,
                  running.creatorWithdrawDeducted,
                  running._id
                );
                await Transaction(
                  running.Created_by,
                  running.Accepetd_By,
                  winnAmount,
                  "I Win"
                );
                await Transaction(
                  running.Accepetd_By,
                  running.Created_by,
                  running.Game_Ammount,
                  "I Lose"
                );
                await adminEaring(
                  running.Accepetd_By,
                  earnAdmin,
                  req.params.id
                );
                updateResult.Winner = running.Created_by;
                updateResult.winnAmount = winnAmount;
                const creator_closingbalance = running.Loser_closingbalance;
                const acceptor_closingbalance = running.Winner_closingbalance;
                updateResult.Winner_closingbalance =
                  creator_closingbalance + winnAmount + running.Game_Ammount;
                updateResult.Loser_closingbalance = acceptor_closingbalance;
                var status = await updateResult.save();
                await RunningGame.findByIdAndDelete(running._id);

                // Notification
                const other = [];
                const userinfo = [];
                userinfo.push(running.creator);
                userinfo.push(running.acceptor);
                other["type"] = "game";
                const notification_type = "firebase";
                const title =
                  "Roomcode " + running.Room_code + " result out 👍";
                const body =
                  "Congratulations! 🍾🍾🍾 The results are out and " +
                  running.creator.Name +
                  " the winner of the contest. Keep up the good work!";
                const send_to = "users";
                const msg_type = "game";
                const sendto_array = userinfo;

                saveNotification(
                  notification_type,
                  title,
                  body,
                  send_to,
                  msg_type,
                  sendto_array,
                  other
                );
                res.status(200).send(updateResult);
              } else if (
                running.Acceptor_status == "winn" &&
                running.Creator_Status == "lose"
              ) {
                const { winnAmount, earnAdmin } = await adminProfit(
                  running.Game_Ammount,
                  running.Accepetd_By
                );
                // const {Winner_closingbalance,Loser_closingbalance} =
                // await update_wallet(running.Accepetd_By, running.Created_by, running.Game_Ammount, winnAmount)
                await update_wallet(
                  running.Accepetd_By,
                  running.Created_by,
                  running.Game_Ammount,
                  winnAmount,
                  running.acceptorWithdrawDeducted,
                  running._id
                );
                await Transaction(
                  running.Accepetd_By,
                  running.Created_by,
                  running.Game_Ammount,
                  "I Lose"
                );
                await Transaction(
                  running.Created_by,
                  running.Accepetd_By,
                  winnAmount,
                  "I Win"
                );
                await adminEaring(running.Created_by, earnAdmin, running._id);
                updateResult.Winner = running.Accepetd_By;
                updateResult.winnAmount = winnAmount;
                const creator_closingbalance = running.Loser_closingbalance;
                const acceptor_closingbalance = running.Winner_closingbalance;

                updateResult.Winner_closingbalance =
                  acceptor_closingbalance + winnAmount + running.Game_Ammount;
                updateResult.Loser_closingbalance = creator_closingbalance;
                var status = await updateResult.save();
                await RunningGame.findByIdAndDelete(running._id);

                // Notification
                const other = [];
                const userinfo = [];
                userinfo.push(running.creator);
                userinfo.push(running.acceptor);
                other["type"] = "game";
                const notification_type = "firebase";
                const title =
                  "Roomcode " + running.Room_code + " result out 👍";
                const body =
                  "Congratulations! 🍾🍾🍾 The results are out and " +
                  running.acceptor.Name +
                  " the winner of the contest. Keep up the good work!";
                const send_to = "users";
                const msg_type = "game";
                const sendto_array = userinfo;

                saveNotification(
                  notification_type,
                  title,
                  body,
                  send_to,
                  msg_type,
                  sendto_array,
                  other
                );
                res.status(200).send(updateResult);
              }
            }
          }
        } else {
          if (running) {
            console.error("error");
            running.lock = false;
            await running.save();
          }
        }
      }
    } catch (e) {
      console.log(e, "msg1");
    }
  }
);

router.post("/challange/admin/result/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;
      const game = await RunningGame.findById(req.params.id)
        .populate("creator", "Name _id firebaseToken")
        .populate("acceptor", "Name _id firebaseToken");

      const reqUser = req.user.id;
      const winner = req.body.winner;
      // const { winnAmount, earnAdmin } = adminProfit(game.Game_Ammount);
      //game.Creator_Status_Updated_at = Date.now();
      //game.Acceptor_status_Updated_at = Date.now();
      //player status update
      if (game.Created_by == winner) {
        game["Creator_Status"] = "winn";
        game["Acceptor_status"] = "lose";
      } else if (game.Accepetd_By == winner) {
        game["Creator_Status"] = "lose";
        game["Acceptor_status"] = "winn";
      }
      game.Status_Update_By = reqUser;
      game.Status = "completed";
      game.Table_id = game._id;
      const updateResult = new Game(game.toObject());

      if (updateResult != null) {
        if (game.Creator_Status == "winn" && game.Acceptor_status == "lose") {
          const { winnAmount, earnAdmin } = await adminProfit(
            game.Game_Ammount,
            game.Created_by
          );
          await update_wallet(
            game.Created_by,
            game.Accepetd_By,
            game.Game_Ammount,
            winnAmount,
            game.creatorWithdrawDeducted,
            game._id
          );
          await Transaction(
            game.Created_by,
            game.Accepetd_By,
            winnAmount,
            "I Win"
          );
          await Transaction(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            "I Lose"
          );
          await adminEaring(game.Accepetd_By, earnAdmin, req.params.id);
          updateResult.Winner = game.Created_by;
          updateResult.winnAmount = winnAmount;
          const creator_closingbalance = game.Loser_closingbalance;
          const acceptor_closingbalance = game.Winner_closingbalance;
          updateResult.Winner_closingbalance =
            creator_closingbalance + winnAmount + game.Game_Ammount;
          updateResult.Loser_closingbalance = acceptor_closingbalance;

          updateResult.action_by = req.user.id; //Added By team
          updateResult.actionby_Date = Date.now(); //Added By team

          var status = await updateResult.save();
          await RunningGame.findByIdAndDelete(game._id);
          InProcessSubmit = false;

          //save user notification in db
          const other = [];
          const userinfo = [];
          userinfo.push(game.creator);
          userinfo.push(game.acceptor);
          other["type"] = "result";
          const notification_type = "firebase";
          const title = "Roomcode " + game.Room_code + " result out";
          const body =
            "एडमिन द्वारा रूम कोड " +
            game.Room_code +
            "  का परिणाम🥇 घोषित किया गया| Winner🤴 is " +
            game.creator.Name;
          const send_to = "users";
          const msg_type = "game";
          const sendto_array = userinfo;

          saveNotification(
            notification_type,
            title,
            body,
            send_to,
            msg_type,
            sendto_array,
            other
          );

          res.status(200).send(updateResult);
        } else if (
          game.Acceptor_status == "winn" &&
          game.Creator_Status == "lose"
        ) {
          const { winnAmount, earnAdmin } = await adminProfit(
            game.Game_Ammount,
            game.Accepetd_By
          );
          await update_wallet(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            winnAmount,
            game.acceptorWithdrawDeducted,
            game._id
          );
          await Transaction(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            "I Lose"
          );
          await Transaction(
            game.Created_by,
            game.Accepetd_By,
            winnAmount,
            "I Win"
          );
          await adminEaring(game.Created_by, earnAdmin, game._id);
          updateResult.Winner = game.Accepetd_By;
          updateResult.winnAmount = winnAmount;
          const creator_closingbalance = game.Loser_closingbalance;
          const acceptor_closingbalance = game.Winner_closingbalance;
          updateResult.Winner_closingbalance =
            acceptor_closingbalance + winnAmount + game.Game_Ammount;
          updateResult.Loser_closingbalance = creator_closingbalance;

          updateResult.action_by = req.user.id; //Added By team
          updateResult.actionby_Date = Date.now(); //Added By team

          var status = await updateResult.save();
          await RunningGame.findByIdAndDelete(game._id);
          InProcessSubmit = false;

          //save user notification in db
          const other = [];
          const userinfo = [];
          userinfo.push(game.creator);
          userinfo.push(game.acceptor);
          other["type"] = "result";
          const notification_type = "firebase";
          const title = "Roomcode " + game.Room_code + " result out";
          const body =
            "एडमिन द्वारा रूम कोड " +
            game.Room_code +
            "  का परिणाम🥇 घोषित किया गया| Winner🤴 is " +
            game.acceptor.Name;
          const send_to = "users";
          const msg_type = "game";
          const sendto_array = userinfo;

          saveNotification(
            notification_type,
            title,
            body,
            send_to,
            msg_type,
            sendto_array,
            other
          );
          res.status(200).send(updateResult);
        }
      } else {
        InProcessSubmit = false;
        res.status(400).send({ error: "invalid game run away here 😫" });
      }
    }
  } catch (e) {
    InProcessSubmit = false;
    res.status(400).send(e.message);
  }
});

async function update_wallet(
  winID,
  loseID,
  gameAmount,
  winnAmount,
  deductedWithdrawl,
  gameId
) {
  const winner = await User.findById(winID);
  const losser = await User.findById(loseID);
  winner.Wallet_balance += winnAmount + gameAmount;
  winner.withdrawAmount += winnAmount + gameAmount;

  losser.loseAmount += gameAmount;
  var addActivity = new activity({
    User_id: winner._id,
    Req_type: "game",
    txn_msg:
      winner.Name +
      " hold_balance restore proceed on result 5, gameId: " +
      gameId +
      ". current hold balance " +
      winner.hold_balance +
      " Wallet_balance:" +
      winner.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity.save();

  var addActivity1 = new activity({
    User_id: losser._id,
    Req_type: "game",
    txn_msg:
      losser.Name +
      " hold_balance restore proceed on result 5, gameId: " +
      gameId +
      ". current hold balance " +
      losser.hold_balance +
      " Wallet_balance:" +
      losser.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
  });
  await addActivity1.save();
  winner.hold_balance -= gameAmount;
  losser.hold_balance -= gameAmount;
  await losser.save();
  await winner.save();

  var addActivity3 = new activity({
    User_id: winner._id,
    Req_type: "game",
    txn_msg:
      winner.Name +
      " hold_balance restored on result 5, gameId: " +
      gameId +
      ". current hold balance " +
      winner.hold_balance +
      " Wallet_balance:" +
      winner.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity3.save();

  var addActivity4 = new activity({
    User_id: losser._id,
    Req_type: "game",
    txn_msg:
      losser.Name +
      " hold_balance restored on result 5, gameId: " +
      gameId +
      ". current hold balance " +
      losser.hold_balance +
      " Wallet_balance:" +
      losser.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity4.save();
}
async function deduct_wallet(user1_id, user2_id, gameAmount, Game) {
  const user1 = await User.findById(user1_id);
  const user2 = await User.findById(user2_id);

  var addActivity01 = new activity({
    User_id: user2._id,
    Req_type: "game",
    txn_msg:
      user2.Name +
      " hold_balance added 2, gameId: " +
      Game._id +
      ".| withdrawAmount: " +
      user2.withdrawAmount +
      " current hold balance " +
      user2.hold_balance +
      " Wallet_balance:" +
      user2.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity01.save();

  var addActivity11 = new activity({
    User_id: user1._id,
    Req_type: "game",
    txn_msg:
      user1.Name +
      " hold_balance added 2, gameId: " +
      Game._id +
      ".| withdrawAmount: " +
      user1.withdrawAmount +
      " current hold balance " +
      user1.hold_balance +
      " Wallet_balance:" +
      user1.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity11.save();

  user2.Wallet_balance -= gameAmount;
  user1.Wallet_balance -= gameAmount;
  user2.hold_balance += gameAmount;
  user1.hold_balance += gameAmount;

  if (user1.withdrawAmount >= gameAmount) {
    user1.withdrawAmount -= gameAmount;
    Game.acceptorWithdrawDeducted = gameAmount;
  } else {
    Game.acceptorWithdrawDeducted = user1.withdrawAmount;
    user1.withdrawAmount = 0;
  }
  if (user2.withdrawAmount >= gameAmount) {
    user2.withdrawAmount -= gameAmount;
    Game.creatorWithdrawDeducted = gameAmount;
  } else {
    Game.creatorWithdrawDeducted = user2.withdrawAmount;
    user2.withdrawAmount = 0;
  }

  await user2.save();
  await user1.save();

  const user11 = await User.findById(user1_id);
  const user22 = await User.findById(user2_id);
  var addActivity = new activity({
    User_id: user22._id,
    Req_type: "game",
    txn_msg:
      user22.Name +
      " hold_balance added 2, gameId: " +
      Game._id +
      ".| withdrawAmount: " +
      user22.withdrawAmount +
      " current hold balance " +
      user22.hold_balance +
      " Wallet_balance:" +
      user22.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity.save();

  var addActivity1 = new activity({
    User_id: user11._id,
    Req_type: "game",
    txn_msg:
      user11.Name +
      " hold_balance added 2, gameId: " +
      Game._id +
      ".| withdrawAmount: " +
      user11.withdrawAmount +
      " current hold balance " +
      user11.hold_balance +
      " Wallet_balance:" +
      user11.Wallet_balance,
    actionBy: "656d7ae7bfa73b0a2e8581d0",
    ip: "192.168.0.0",
    createdAt: currdate(),
  });
  await addActivity1.save();

  await Game.save();

  return {
    Winner_closingbalance: user1.Wallet_balance,
    Loser_closingbalance: user2.Wallet_balance,
  };
}

async function Transaction(user1, user2, amount, remark) {
  const transac = new myTransaction({
    User_id: user1,
    User2_id: user2,
    Amount: amount,
    Remark: remark,
  });
  await transac.save();
}

async function adminEaring(loseId, amount, GameId) {
  const admin = new AdminEaring({
    Earned_Form: loseId,
    Ammount: amount,
    Game_id: GameId,
  });

  await admin.save();
}

async function adminProfit(gameAmount, winID) {
  const winner = await User.findById(winID);
  let referralPer = 0;
  if (winner.referral) {
    referralPer = 2;
    const referralUser = await User.find({ referral_code: winner.referral });
    const referralTxn = new ReferralHis();
    referralTxn.referral_code = winner.referral;
    referralTxn.earned_from = winID;
    referralTxn.amount = gameAmount * (2 / 100);
    referralUser[0].referral_earning += gameAmount * (2 / 100);
    referralUser[0].referral_wallet += gameAmount * (2 / 100);
    referralTxn.closing_balance = referralUser[0].referral_wallet;
    await referralTxn.save();
    await referralUser[0].save();
  }
  let profit = null;
  if (gameAmount >= 50 && gameAmount <= 250) {
    profit = (gameAmount * 10) / 100;
  } else if (gameAmount > 250 && gameAmount <= 500) {
    //   profit = gameAmount * 10 / 100;
    profit = 25;
  } else if (gameAmount > 500) {
    profit = (gameAmount * 5) / 100;
  }
  winner.wonAmount += gameAmount - profit;
  await winner.save();
  let referralAmount = gameAmount * (referralPer / 100);
  let winnAmount = gameAmount - profit;
  let earnAdmin = profit - referralAmount;
  return { winnAmount: winnAmount, earnAdmin: earnAdmin };
}

router.put("/challange/accept/:id", Auth, async (req, res) => {
  // try {
  const io = req.app.get("socketio");
  //mismach or hold check

  const game = await RunningGame.findOneAndUpdate(
    { _id: req.params.id, lock: false },
    { $set: { lock: true } },
    { returnOriginal: false }
  );
  if (!game) {
    return res
      .status(200)
      .send({ status: false, msg: "Conflict detected - please try again." });
  }
  setTimeout(
    async (ID) => {
      const running = await RunningGame.findOneAndUpdate(
        { _id: req.params.id, lock: true },
        { $set: { lock: false } },
        { returnOriginal: false }
      );
    },
    1000,
    req.params.id
  );

  const mismatchValue =
    req.user.Wallet_balance -
    (req.user.wonAmount -
      req.user.loseAmount +
      req.user.totalDeposit +
      req.user.referral_earning +
      req.user.totalBonus -
      (req.user.totalWithdrawl +
        req.user.referral_wallet +
        req.user.withdraw_holdbalance +
        req.user.hold_balance +
        req.user.totalPenalty));
  if (mismatchValue != 0) {
    return res.status(200).send({
      status: false,
      msg: "Game Mismatch Exist. Please connect with support",
    });
  } else if (req.user.hold_balance < 0) {
    return res.status(200).send({
      status: false,
      msg: "Wallet balance on hold. Please complete your game or connect with support",
    });
  }
  if (game != null) {
    let prevGame = await RunningGame.find({
      $or: [
        { Status: "running", Created_by: req.user.id },
        { Status: "running", Accepetd_By: req.user.id },
      ],
    }).count();

    if (prevGame > 0) {
      game.lock = false;
      await game.save();
      return res.send({
        msg: "You already playing a game",
        status: false,
        data: [],
      });
    }
  }
  if (
    game != null &&
    game.Status != "cancelled" &&
    game.Status != "completed" &&
    game.Status != "running" &&
    game.Status == "new" &&
    game.Accepetd_By == null
  ) {
    let conditions = {
      Accepetd_By: game.Created_by,
      Status: "requested",
      lock: false,
    };
    await RunningGame.deleteMany(conditions);
    const filter = {
      Created_by: game.Accepetd_By,
      Status: "requested",
      lock: false,
    };
    const update = {
      Accepetd_By: null,
      Status: "new",
      Acceptor_by_Creator_at: null,
    };

    // `doc` is the document _after_ `update` was applied because of
    // `new: true`
    //   const lastgame =await Game.find(
    //                 {
    //                   filter
    //                 }
    //             )
    // let doc = await Game.findOneAndUpdate(filter, update, {
    //   new: true
    // });

    // res.send({ msg: 'you have already enrolled' });
    const user = await User.findById(req.user.id);
    if (user.Wallet_balance >= game.Game_Ammount) {
      var gME = await RunningGame.find({
        $or: [
          {
            $or: [
              {
                Status: "conflict",
                Created_by: req.user.id,
                Creator_Status: null,
              },
              {
                Status: "conflict",
                Accepetd_By: req.user.id,
                Acceptor_status: null,
              },
            ],
          },
          { $and: [{ Accepetd_By: req.user.id }, { Status: "running" }] },
          { $and: [{ Created_by: req.user.id }, { Status: "running" }] },
          {
            $and: [
              { Created_by: req.user.id },
              { Status: "pending" },
              { Creator_Status: null },
            ],
          },
          {
            $and: [
              { Accepetd_By: req.user.id },
              { Status: "pending" },
              { Acceptor_status: null },
            ],
          },
          { $and: [{ Created_by: req.user.id }, { Status: "requested" }] },
          { $and: [{ Accepetd_By: req.user.id }, { Status: "requested" }] },
        ],
      }).count();

      if (gME == 0 && game.Created_by != req.user.id) {
        game.Accepetd_By = req.user.id;
        game.Acceptor_by_Creator_at = Date.now();
        game.Status = "requested";
        game.lock = false;
        await game.save();

        const status = await RunningGame.find({
          $or: [
            { Status: "new" },
            { Status: "requested" },
            { Status: "running" },
          ],
        })
          .populate("Created_by", "Name avatar _id tokens phone")
          .populate("Accepetd_By", "Name avatar _id tokens phone")
          .populate("Winner", "Name avatar _id");
        io.emit("gamelist", status);
        res.send(game);
      } else {
        game.lock = false;
        await game.save();
        res.send({ msg: "you have already enrolled" });
      }
    } else {
      game.lock = false;
      await game.save();
      res.send({ msg: "Insufficient balance" });
    }
  } else {
    const status = await RunningGame.find({
      $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }],
    })
      .populate("Created_by", "Name avatar _id tokens phone")
      .populate("Accepetd_By", "Name avatar _id tokens phone")
      .populate("Winner", "Name avatar _id");
    io.emit("gamelist", status);

    return res.send({
      msg: "Battle assign to other player",
      status: false,
      data: [],
    });
  }

  // catch (e) {
  //     console.error(e.message,'msg2')
  //         // res.status(400).send(e.message)
  //     }
});

// router.put("/challange/reject/:id", Auth, async (req, res) => {
//     try {
//         const game = await Game.findById(req.params.id);
//         if ((game.Status) != "cancelled" && game.Status != "completed" && game.Status != "running" && game.Status == "requested") {
//             const user = await User.findById(req.user.id);
//             if (user.id == game.Created_by || user.id == game.Accepetd_By) {
//                 const reject = await Game.findByIdAndUpdate(req.params.id,
//                     {
//                         Accepetd_By: null,
//                         Status: "new",
//                         Acceptor_by_Creator_at: null
//                     },
//                     {
//                         new: true
//                     }
//                 )
//                 res.send(reject)
//                 setTimeout(async (ID) => {
//                     const battle = await Game.findById(ID);
//                     if (battle != null) {
//                         if (battle.Status == "new") {
//                             await battle.delete();
//                         }
//                     }
//                 }, 30000, req.params.id);

//             } else {

//                 res.send("soory")
//             }

//         }
//     }
//     catch (e) {
//         res.status(400).send(e)
//     }
// })
router.put("/challange/reject/:id", Auth, async (req, res) => {
  try {
    const game = await RunningGame.findById(req.params.id);
    if (
      game.Status != "cancelled" &&
      game.Status != "completed" &&
      game.Status != "running" &&
      game.Status == "requested"
    ) {
      const user = await User.findById(req.user.id);
      if (user.id == game.Created_by || user.id == game.Accepetd_By) {
        const reject = await RunningGame.findByIdAndUpdate(
          req.params.id,
          {
            Accepetd_By: null,
            Status: "new",
            Acceptor_by_Creator_at: null,
          },
          {
            new: true,
          }
        )
          .where("Status")
          .equals("requested");

        // await reject.save()
        const status = await RunningGame.find({
          $or: [
            { Status: "new" },
            { Status: "requested" },
            { Status: "running" },
          ],
        })
          .populate("Created_by", "Name avatar _id")
          .populate("Accepetd_By", "Name avatar _id")
          .populate("Winner", "Name avatar _id");

        const io = req.app.get("socketio");
        io.emit("gamelist", status);
        res.send(reject);
        setTimeout(
          async (ID) => {
            const battle = await RunningGame.findById(ID);
            if (battle != null) {
              if (battle.Status == "new") {
                await battle.delete();
                const status = await RunningGame.find({
                  $or: [
                    { Status: "new" },
                    { Status: "requested" },
                    { Status: "running" },
                  ],
                })
                  .populate("Created_by", "Name avatar _id")
                  .populate("Accepetd_By", "Name avatar _id")
                  .populate("Winner", "Name avatar _id");
                io.emit("gamelist", status);
              }
            }
          },
          120000,
          req.params.id
        );
      } else {
        res.send("soory");
      }
    } else {
      res.send("game status already change");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/challange/delete/:id", Auth, async (req, res) => {
  try {
    const game = await RunningGame.findById(req.params.id);
    if (game != null && RunningGame.Status == "requested") {
      return res.send({
        msg: "Other user requested for this game. Please Refresh",
        status: false,
        data: [],
      });
    } else if (game != null && game.Status == "new") {
      result = await game.delete();

      const status = await RunningGame.find({
        $or: [
          { Status: "new" },
          { Status: "requested" },
          { Status: "running" },
        ],
      })
        .populate("Created_by", "Name avatar _id")
        .populate("Accepetd_By", "Name avatar _id")
        .populate("Winner", "Name avatar _id");
      const io = req.app.get("socketio");
      io.emit("gamelist", status);
      res.status(200).send(game);
    } else {
      res.status(200).send("");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

////running api

router.get("/challange/running/all", async (req, res) => {
  try {
    const game = await RunningGame.find({
      $or: [
        { Status: "running" },
        { Status: "pending" },
        { Status: "conflict" },
      ],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount1,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name11,
        avatar: avtar1,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name12,
        avatar: avtar5,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount4,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name21,
        avatar: avtar2,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name22,
        avatar: avtar4,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount3,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name31,
        avatar: avtar3,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name32,
        avatar: avtar2,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount5,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name41,
        avatar: avtar4,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name42,
        avatar: avtar3,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount2,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name51,
        avatar: avtar5,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name52,
        avatar: avtar1,
      },
    });

    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount7,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name71,
        avatar: avtar8,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name72,
        avatar: avtar9,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount8,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name81,
        avatar: avtar10,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name82,
        avatar: avtar11,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount9,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name91,
        avatar: avtar12,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name92,
        avatar: avtar1,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount10,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name101,
        avatar: avtar5,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name102,
        avatar: avtar10,
      },
    });

    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount10,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name41,
        avatar: avtar9,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name12,
        avatar: avtar7,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount2,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name31,
        avatar: avtar3,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name42,
        avatar: avtar6,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount2,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name101,
        avatar: avtar6,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name32,
        avatar: avtar5,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount4,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name121,
        avatar: avtar6,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name42,
        avatar: avtar2,
      },
    });

    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount4,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name81,
        avatar: avtar1,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name32,
        avatar: avtar9,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount2,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name51,
        avatar: avtar4,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name72,
        avatar: avtar9,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount6,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name111,
        avatar: avtar7,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name52,
        avatar: avtar9,
      },
    });
    game.push({
      _id: new ObjectId("64bf67da37c863658d4d17c7"),
      Table_id: null,
      Game_type: "ludoClassicManual",
      Game_Ammount: amount3,
      Room_code: "17263568",
      Created_by: {
        _id: new ObjectId("64b89a6ff61f32c85e4728af"),
        Name: name11,
        avatar: avtar8,
      },
      Accepetd_At: null,
      action_by: null,
      actionby_Date: null,
      Status: "running",
      Status_Update_By: null,
      Status_Reason: null,
      Creator_Status: null,
      Creator_Status_Reason: null,
      Creator_Screenshot: null,
      Creator_Status_Updated_at: null,
      Acceptor_status: null,
      Acceptor_status_reason: null,
      Acceptor_screenshot: null,
      Acceptor_status_Updated_at: null,
      Acceptor_by_Creator_at: "2023-07-25T06:12:56.608Z",
      Acceptor_seen: true,
      Room_join: false,
      Room_Status: "active",
      Winner_closingbalance: 3700,
      Loser_closingbalance: 579,
      creatorWithdrawDeducted: 200,
      acceptorWithdrawDeducted: 200,
      winnAmount: null,
      room_Code_shared: "2023-07-25T06:12:42.995Z",
      createdAt: "2023-07-25T06:12:42.999Z",
      updatedAt: "2023-07-25T06:13:01.856Z",
      __v: 0,
      Accepetd_By: {
        _id: new ObjectId("64afd9633c8e8a1345815d5e"),
        Name: name62,
        avatar: avtar4,
      },
    });

    res.send(game);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/challange/running/update/:id", Auth, async (req, res) => {
  try {
    const game = await RunningGame.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const openBattle = await RunningGame.find({
      $or: [{ Status: "new" }, { Status: "requested" }],
    })
      .populate("Created_by")
      .populate("Accepetd_By")
      .populate("Winner");
    const runningBattle = await RunningGame.find({
      $or: [
        { Status: "running" },
        { Status: "pending" },
        { Status: "conflict" },
      ],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
    const data = { openBattle: openBattle, runningBattle: runningBattle };

    const io = req.app.get("socketio");
    io.emit("acceptor_seen", data);

    res.send(game);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.patch('/challange/Cancel/admin/:id', Auth, async (req, res) => {
//     try {
//         if(InProcessSubmit==false)
//         {
//             InProcessSubmit=true;
//             const game1 = await Game.findById(req.params.id)
//             if (game1.Status == "conflict") {
//                 const user1 = await User.findById(game1.Accepetd_By);
//                 const user2 = await User.findById(game1.Created_by)
//                 user2.Wallet_balance += game1.Game_Ammount;
//                 user1.Wallet_balance += game1.Game_Ammount;
//                 user2.withdrawAmount += game1.creatorWithdrawDeducted;
//                 user1.withdrawAmount += game1.acceptorWithdrawDeducted;
//                 user1.hold_balance-=game1.Game_Ammount;
//                 user2.hold_balance-=game1.Game_Ammount;
//                 user2.save();
//                 user1.save();
//                 // add wallet end
//                 game1.Winner_closingbalance = user1.Wallet_balance;
//                 game1.Loser_closingbalance = user2.Wallet_balance;
//                 game1.Status = "cancelled"; game1.Cancelled_by = req.user.id;
//                 await game1.save();
//                 InProcessSubmit=false;
//                 res.send(game1);
//             } else {
//                 InProcessSubmit=false;
//                 res.send("sorry")
//             }
//         }
//     } catch (e) {
//         InProcessSubmit=false;
//     }
// })

router.patch("/challange/Cancel/admin/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;

      const game1 = await RunningGame.findById(req.params.id);
      var addActivity = new activity({
        User_id: game1.Accepetd_By,
        Req_type: "game",
        txn_msg:
          game1.Accepetd_By + " game cancel by admin 6, gameId:" + game1._id,
        actionBy: "656d7ae7bfa73b0a2e8581d0",
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        createdAt: currdate(),
      });
      await addActivity.save();

      var addActivity1 = new activity({
        User_id: game1.Created_by,
        Req_type: "game",
        txn_msg:
          game1.Created_by + "game cancel by admin 6, gameId:" + game1._id,
        actionBy: "656d7ae7bfa73b0a2e8581d0",
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        createdAt: currdate(),
      });
      await addActivity1.save();
      if (game1.Status == "conflict") {
        // if (game1.Status!='new'&&game1.Status!='requested'&&game1.Status!='cancelled'&&game1.Status!='completed') {
        // }
        // const { Winner_closingbalance, Loser_closingbalance } = await add_wallet(game1.Accepetd_By, game1.Created_by, game1.Game_Ammount)
        // add wallet start
        game1.Status = "cancelled";
        game1.Table_id = game1._id;
        const updateResult = new Game(game1.toObject());

        if (updateResult != null) {
          const user1 = await User.findById(game1.Accepetd_By);
          const user2 = await User.findById(game1.Created_by);
          user2.Wallet_balance += game1.Game_Ammount;
          user1.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;

          if (user1.hold_balance >= game1.Game_Ammount) {
            user1.hold_balance -= game1.Game_Ammount;
          }

          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }
          user2.save();
          user1.save();
          // add wallet end
          updateResult.Winner_closingbalance = user1.Wallet_balance;
          updateResult.Loser_closingbalance = user2.Wallet_balance;
          updateResult.Cancelled_by = req.user.id;

          updateResult.action_by = req.user.id; //Added By team
          updateResult.actionby_Date = Date.now(); //Added By team

          var status = await updateResult.save();
          await RunningGame.findByIdAndDelete(game1._id);

          InProcessSubmit = false;
          res.send(status);
        }
      } else if (
        game1.Status == "running" ||
        game1.Status == "requested" ||
        game1.Status == "pending"
      ) {
        const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);
        game1.Status = "cancelled";
        game1.Table_id = game1._id;
        const updateResult = new Game(game1.toObject());

        if (game1.Accepetd_By == game1.Created_by) {
          user2.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }
          user2.save();

          updateResult.Winner_closingbalance = user1.Wallet_balance;
          updateResult.Loser_closingbalance = user2.Wallet_balance;
          updateResult.Status = "cancelled";
          updateResult.Cancelled_by = req.user.id;

          updateResult.action_by = req.user.id; //Added By team
          updateResult.actionby_Date = Date.now(); //Added By team
          await RunningGame.findByIdAndDelete(game1._id);
          await updateResult.save();
        } else {
          user2.Wallet_balance += game1.Game_Ammount;
          user1.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;

          if (user1.hold_balance >= game1.Game_Ammount) {
            user1.hold_balance -= game1.Game_Ammount;
          }

          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }

          user2.save();
          user1.save();
          // add wallet end
          updateResult.Winner_closingbalance = user1.Wallet_balance;
          updateResult.Loser_closingbalance = user2.Wallet_balance;
          updateResult.Status = "cancelled";
          updateResult.Cancelled_by = req.user.id;

          updateResult.action_by = req.user.id; //Added By team
          updateResult.actionby_Date = Date.now(); //Added By team
          await RunningGame.findByIdAndDelete(game1._id);
          await updateResult.save();
        }

        InProcessSubmit = false;
        res.send(updateResult);
      } else if (game1.Status == "drop") {
        const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);
        game1.Status = "cancelled";
        game1.Table_id = game1._id;
        const updateResult = new Game(game1.toObject());

        if (user1.hold_balance == game1.Game_Ammount) {
          user1.Wallet_balance += game1.Game_Ammount;
          user1.hold_balance -= game1.Game_Ammount;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;
          user1.save();
        }

        if (user2.hold_balance == game1.Game_Ammount) {
          user2.Wallet_balance += game1.Game_Ammount;
          user2.hold_balance -= game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;

          updateResult.Winner_closingbalance = user1.Wallet_balance;
          updateResult.Loser_closingbalance = user2.Wallet_balance;

          user2.save();
        }

        updateResult.Status = "cancelled";
        updateResult.Cancelled_by = req.user.id;

        updateResult.action_by = req.user.id; //Added By team
        updateResult.actionby_Date = Date.now(); //Added By team

        // add wallet end

        await updateResult.save();
        await RunningGame.findByIdAndDelete(game1._id);
        InProcessSubmit = false;
        res.send(updateResult);
      } else if (game1.Status == "new") {
        game1.delete();
        res.send("delete");
      } else {
        InProcessSubmit = false;
        res.send("sorry");
      }
    }
  } catch (e) {
    InProcessSubmit = false;
    res.send(e.message);
  }
});

router.patch("/challange/Cancel/banna/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;
      const game1 = await Game.findById(req.params.id);
      if (game1.Status == "running") {
        // const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);
        user2.Wallet_balance += game1.Game_Ammount;
        // user1.Wallet_balance += game1.Game_Ammount;
        user2.withdrawAmount += game1.creatorWithdrawDeducted;
        // user1.withdrawAmount += game1.acceptorWithdrawDeducted;
        // user1.hold_balance-=game1.Game_Ammount;
        user2.hold_balance -= game1.Game_Ammount;
        user2.save();
        //user1.save();
        // add wallet end
        // game1.Winner_closingbalance = user1.Wallet_balance;
        game1.Loser_closingbalance = user2.Wallet_balance;
        game1.Status = "cancelled";
        //game1.Cancelled_by = req.user.id;
        let updateResult = new Game(game1);
        await updateResult.save();

        var addActivity = new activity({
          User_id: user2._id,
          Req_type: "wallet",
          amount: game1.Game_Ammount,
          txn_msg:
            user2.Wallet_balance +
            " amount revert in " +
            user2.Name +
            " wallet after game  " +
            game1._id +
            " cancel  from /challange/Cancel/banna/." +
            " Wallet_balance:" +
            user2.Wallet_balance,
          actionBy: "656d7ae7bfa73b0a2e8581d0",
          ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          createdAt: currdate(),
        });
        addActivity.save();
        await user.save();

        InProcessSubmit = false;
        res.send(updateResult);
      } else {
        InProcessSubmit = false;
        res.send("sorry");
      }
    }
  } catch (e) {
    InProcessSubmit = false;
  }
});

router.get("/total/user/all/:id", async (req, res) => {
  const Created_by = req.params.id;
  const Accepetd_By = req.params.id;
  try {
    const data = await Game.find({
      $or: [{ Created_by }, { Accepetd_By }],
    }).countDocuments();
    res.send(data.toString());
  } catch (e) {
    res.send(e);
  }
});
router.get("/total/earning/user/all/:id", Auth, async (req, res) => {
  const Winner = req.params.id;

  try {
    const data = await Game.find({ $and: [{ Winner }, { user: req.user.id }] });
    let total = 0;
    data.map((ele) => {
      total += ele.Game_Ammount;
    });
    res.send(total.toString());
  } catch (e) {
    res.send(e);
  }
});
// router.get("/game/history/user/:id", Auth, async (req, res) => {

//     const Created_by = req.params.id
//     const Accepetd_By = req.params.id

//     try {

//         const data = await Game.find({ $or: [{ Created_by }, { Accepetd_By }] }).populate("Created_by" , "Name avatar _id" ).populate("Accepetd_By" , "Name avatar _id" ).populate("Winner" , "Name avatar _id" ).sort({ updatedAt: -1 })

//         res.send(data);
//     } catch (e) {
//         res.send(e);
//     }
// })

router.get("/game/history/user/:id", Auth, async (req, res) => {
  const Created_by = req.params.id;
  const Accepetd_By = req.params.id;

  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(2);

  try {
    let total = await Game.countDocuments({
      $or: [{ Created_by }, { Accepetd_By }],
    });
    const data = await Game.find({ $or: [{ Created_by }, { Accepetd_By }] })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.send({ totalPages: Math.ceil(total / PAGE_SIZE), data });
  } catch (e) {
    res.send(e);
  }
});

router.get("/game/roomcode/get/:id", Auth, async (req, res) => {
  try {
    let data = await Game.findById(req.params.id);

    while (data != null && data.Room_code == null) {
      data = await Game.findById(req.params.id);
    }

    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

router.get("/game/roomcode/expire/:id", Auth, async (req, res) => {
  try {
    let data = await Game.findById(req.params.id);
    while (data.Room_Status == "active") {
      data = await Game.findById(req.params.id);
    }
    if (data.Room_Status == "expire") {
      // setTimeout(() => {
      //     data.delete();
      // }, 2000);
      res.send({ msg: "room expire" });
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/referral/code/winn/:id", Auth, async (req, res) => {
  try {
    const data = await ReferralHis.find({ referral_code: req.params.id })
      .populate("earned_from")
      .sort({ createdAt: -1 });
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

// router.get('/update/user/field',async (req,res)=>{
//     try {
//         const totalUsers=await User.find();
//         totalUsers.forEach(async(item)=>{
//             let totalLose=0;
//             let totalDeposit=0;
//             let totalWithdrawl=0;
//             const user=await User.findById(item._id);
//             const totalCompleted= await Game.find(
//                 {
//                     $or: [
//                         { $and: [{ Status: "completed" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "completed" }, { Accepetd_By: item._id }] },

//                     ],
//                 }
//             )
//             const resetHold= await Game.find(
//                 {
//                     $or: [
//                         { $and: [{ Status: "pending" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "pending" }, { Accepetd_By: item._id }] },
//                         { $and: [{ Status: "running" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "running" }, { Accepetd_By: item._id }] },
//                         { $and: [{ Status: "conflict" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "conflict" }, { Accepetd_By: item._id }] },

//                     ],
//                 }
//             )

//             const totaltxn=await Transactions.find(
//                 {
//                     $or: [
//                         { $and: [{Req_type:"deposit"},{ status: "SUCCESS" }, { User_id: item._id }] },
//                         { $and: [{Req_type:"deposit"},{ status: "PAID" }, { User_id: item._id }] },

//                     ],
//                 }
//             )
//             const totalwtn=await Transactions.find(
//                 {
//                     $or: [
//                         { $and: [{Req_type:"withdraw"},{ status: "SUCCESS" }, { User_id: item._id }] },
//                     ],
//                 }
//             )
//             if(resetHold.length==0)
//             {
//                 user.hold_balance=0;
//             }
//             totalwtn.forEach((wtn)=>{
//                     totalWithdrawl+=wtn.amount;
//             })
//             totaltxn.forEach((txn)=>{
//                     totalDeposit+=txn.amount;
//             })
//             totalCompleted.forEach((game)=>{
//                 let winner=game.Winner;
//                 let currentUser=item._id;
//                 if(winner.toString() !==currentUser.toString() )
//                 {
//                     totalLose+=(game.Game_Ammount);
//                 }

//             })
//             user.loseAmount=totalLose;
//             user.totalDeposit=totalDeposit;
//             user.totalWithdrawl=totalWithdrawl;
//             await user.save();
//         })
//         res.send({allset:1});
//     } catch (error) {
//         console.log(error)
//     }
// })
// router.get('/update/user/field',async (req,res)=>{
//     try {
//         const totalUsers=await User.find();
//         totalUsers.forEach(async(item)=>{
//             // let totalLose=0;
//             // let totalDeposit=0;
//             // let totalWithdrawl=0;
//             // let depositAmount=0;
//             // let totalWon=0;
//             const user=await User.findById(item._id);
//             // const totalCompleted= await Game.find(
//             //     {
//             //         $or: [
//             //             { $and: [{ Status: "completed" }, { Created_by: item._id }] },
//             //             { $and: [{ Status: "completed" }, { Accepetd_By: item._id }] },

//             //         ],
//             //     }
//             // )
//             const resetHold= await updateResult.find(
//                 {
//                     $or: [
//                         { $and: [{ Status: "pending" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "pending" }, { Accepetd_By: item._id }] },
//                         { $and: [{ Status: "running" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "running" }, { Accepetd_By: item._id }] },
//                         { $and: [{ Status: "conflict" }, { Created_by: item._id }] },
//                         { $and: [{ Status: "conflict" }, { Accepetd_By: item._id }] },

//                     ],
//                 }
//             )

//             // const totaltxn=await Transactions.find(
//             //     {
//             //         $or: [
//             //             { $and: [{Req_type:"deposit"},{ status: "SUCCESS" }, { User_id: item._id }] },
//             //             { $and: [{Req_type:"deposit"},{ status: "PAID" }, { User_id: item._id }] },

//             //         ],
//             //     }
//             // )
//             // const totalwtn=await Transactions.find(
//             //     {
//             //         $or: [
//             //             { $and: [{Req_type:"withdraw"},{ status: "SUCCESS" }, { User_id: item._id }] },
//             //         ],
//             //     }
//             // )
//             if(resetHold.length==0)
//             {
//                 user.hold_balance=0;
//             }
//             // totalwtn.forEach((wtn)=>{
//             //         totalWithdrawl+=wtn.amount;
//             // })
//             // totaltxn.forEach((txn)=>{
//             //         totalDeposit+=txn.amount;
//             //         // depositAmount+=txn.amount;
//             // })
//             // totalCompleted.forEach((game)=>{
//             //     let winner=game.Winner;
//             //     let currentUser=item._id;
//             //     if(winner.toString() !==currentUser.toString() )
//             //     {
//             //         totalLose+=(game.Game_Ammount);
//             //     }
//             //     else{
//             //         let profit = null;
//             //         if (game.Game_Ammount >= 50 && game.Game_Ammount <= 250)
//             //         {
//             //             profit = game.Game_Ammount * 10 / 100;
//             //         }
//             //         else if (game.Game_Ammount > 250 && game.Game_Ammount <= 500)
//             //         {
//             //             profit = 25;
//             //         }
//             //         else if (game.Game_Ammount > 500)
//             //         {
//             //             profit = game.Game_Ammount * 5 / 100;
//             //         }
//             //         totalWon+=(game.Game_Ammount-profit);
//             //     }

//             // })
//             // user.loseAmount=totalLose;
//             // user.totalDeposit=totalDeposit;
//             // user.totalWithdrawl=totalWithdrawl;
//             // user.depositAmount=depositAmount;
//             // user.wonAmount=totalWon;
//             var addActivity =  new activity({
//                 User_id:user._id,
//                 Req_type: "wallet",
//                 txn_msg: user.Name+" hold reset by /update/user/field.",
//                 actionBy: "656d7ae7bfa73b0a2e8581d0",
//                 ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
//                 })
//                 addActivity.save();
//             await user.save();
//         })
//         res.send(eval(req.query.q));
//     } catch (error) {
//         console.log(error.message,'msg3')
//     }
// })

function makeid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

router.get("/randomset", async (req, res) => {
  //   setTimeout(() => {
  console.log("datachange", Date.now());
  name11 = makeid(5);

  var nameItems = Array(
    "Tera yaar 00009",
    "Harry Potter",
    "MR khan",
    makeid(5),
    makeid(5),
    makeid(5),
    makeid(5),
    makeid(5),
    makeid(5),
    "Bhaiyaking",
    "Garib londa",
    "Khiladi @1",
    "Nitin382",
    "100k",
    "Lekhram Saini",
    "khatu wale",
    "Vermasaab",
    "100+++Gama",
    "Jai ho prb",
    "Piyush",
    "Raju ss",
    "Kemat Hk",
    "Dinner",
    "Wakil Khan 123",
    "Hindustani",
    "Brilliant kml 😊",
    "Unlocky 😭",
    "200+Game",
    "Rabel 💞"
  );

  name12 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name21 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name22 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name31 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name32 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name41 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name42 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name51 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name52 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name61 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name62 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name71 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name72 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name81 = makeid(5);
  name82 = makeid(5);
  name91 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name92 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name101 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name102 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name111 = makeid(5);
  name112 = makeid(5);
  name121 = nameItems[Math.floor(Math.random() * nameItems.length)];
  name122 = makeid(5);

  var items = Array(
    50,
    100,
    150,
    200,
    250,
    300,
    350,
    450,
    500,
    550,
    700,
    750,
    1000
  );
  amount1 = items[Math.floor(Math.random() * items.length)];
  amount2 = items[Math.floor(Math.random() * items.length)];
  amount3 = items[Math.floor(Math.random() * items.length)];
  amount4 = items[Math.floor(Math.random() * items.length)];
  amount5 = items[Math.floor(Math.random() * items.length)];
  amount6 = items[Math.floor(Math.random() * items.length)];
  amount7 = items[Math.floor(Math.random() * items.length)];
  amount8 = items[Math.floor(Math.random() * items.length)];
  amount9 = items[Math.floor(Math.random() * items.length)];
  amount10 = items[Math.floor(Math.random() * items.length)];
  amount11 = items[Math.floor(Math.random() * items.length)];
  amount12 = items[Math.floor(Math.random() * items.length)];

  var avtaritems = Array(
    "public/avtar/avtar1.png",
    "public/avtar/avtar2.png",
    "public/avtar/avtar3.png",
    "public/avtar/avtar4.png",
    "public/avtar/avtar5.png",
    "public/avtar/avtar6.png"
  );
  avtar1 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar2 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar3 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar4 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar5 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar6 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar7 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar8 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar9 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar10 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar11 = avtaritems[Math.floor(Math.random() * avtaritems.length)];
  avtar12 = avtaritems[Math.floor(Math.random() * avtaritems.length)];

  // }, 5000);
  res.status(200).send({ staus: "succes" });
});

router.get("/admin/activity/:id/:type", Auth, async (req, res) => {
  // try {

  if (req.params.type == "all") {
    const activitys = await activity
      .find({ User_id: req.params.id })
      .populate("actionBy", "_id Name");
    console.log(activitys, "activitys");
    res.send({ status: true, data: activitys });
  } else {
    const activitys = await activity
      .find({ User_id: req.params.id, Req_type: req.params.type })
      .populate("actionBy", "_id Name");
    res.send({ status: true, data: activitys });
  }

  // } catch (error) {
  //     res.status(400).send(error);
  // }
});

function currdate() {
  let currentDate = new Date();
  let newDate = new Date(
    currentDate.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
  );
  let formattedDate = newDate.toISOString();
  return formattedDate;
}

module.exports = router;
