const Game = require("./Model/Games");
const AutoGame = require("./Model/AutoGame");
const RunningGame = require("./Model/RunningGame");
const Gamedelete = require("./Model/Gamesdelete");
const SiteSettings = require("./Model/settings");
const User = require("./Model/User");
const Chat = require("./Model/chat/chat");
const Conversation = require("./Model/chat/conversation");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
let users = [];

const EditData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on("joinUser", async (user) => {
    if (user) {
      const data = await users.findIndex((user) => user.id === user._id);
      if (data) {
        users[data] = { id: user._id, socketId: socket.id };
      } else {
        users.push({ id: user._id, socketId: socket.id });
      }
    }
  });

  socket.on("websetting", async () => {
    const settings = await SiteSettings.findOne({});
    socket.emit("websettingGet", settings);
  });

  socket.on("challengeOngoing", async () => {
    const openBattle = await RunningGame.find({
      $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
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

    socket.broadcast.emit("ongoingChallenge", data);
  });
  socket.on("resultAPI", async () => {
    const game = await RunningGame.find({
      $or: [
        { Status: "running" },
        { Status: "pending" },
        { Status: "conflict" },
      ],
    })
      .populate("Created_by")
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");

    socket.broadcast.emit("resultUpdateReq", game);
  });

  socket.on("popularroomCode", async (data) => {
    const localGame = await RunningGame.findById(data.game_id);
    if (
      localGame != null &&
      localGame.Status != "completed" &&
      localGame.Status != "cancelled" &&
      localGame.Status == "requested"
    ) {
      localGame.Status = "running";
      const { Winner_closingbalance, Loser_closingbalance } =
        await deduct_wallet(
          localGame.Accepetd_By,
          localGame.Created_by,
          localGame.Game_Ammount,
          localGame
        );
      localGame.Winner_closingbalance = Winner_closingbalance;
      localGame.Loser_closingbalance = Loser_closingbalance;
      await localGame.save();

      await prevRequested(localGame.Created_by, localGame.Accepetd_By);

      await prevCreated(localGame.Created_by, localGame.Accepetd_By);

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
      socket.broadcast.emit("startAcepptor", status);
      // await axios.get('https://ludo-room-code-api-pradip.vercel.app/room_code/?battle_type=popular')
      // await axios.get('https://ludokingroomcode.shop/api.php?user=Sofitgrowpopu')
      await axios
        .get(
          "https://api.ludoadda.co.in/api.php?uname=bWFub2o=&key=V1RCak5XUXlVbGhsUjJocVdub3dPUT09"
        )
        .then((res) => {
          // if (res.status == 200) {
          // console.log(res.data.roomcode)
          localGame.Room_code = res.data.roomcode;
          localGame.save();

          // }
        })
        .catch((err) => {
          localGame.Room_code = 0;
          localGame.save();
          console.log("popular room err", err);
        });
    } else {
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
      socket.broadcast.emit("startAcepptor", status);
    }
  });

  socket.on("getgamelist", async () => {
    const openBattle = await RunningGame.find({
      $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }],
    })
      .populate("Created_by", "Name avatar _id")
      .populate("Accepetd_By", "Name avatar _id")
      .populate("Winner", "Name avatar _id");
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

    socket.emit("setGamelist", data);
  });

  socket.on("autoGameDetails", async (id) => {
    let data = await AutoGame.findById({ _id: id });

    while (data == null) {
      data = await RunningGame.findById({ _id: id });
    }

    socket.emit("matchstart", data);
  });

  socket.on("getGameCount", async () => {
    const runningCount = await RunningGame.aggregate([
      {
        $group: {
          _id: "$Game_Ammount",
          count: {
            $sum: 1,
          },
          users: {
            $push: {
              _id: "$_id",
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
              _id: "$_id",
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

    socket.emit("gameCount", {
      auto_gameCount: auto_gameCount,
      runningCount: runningCount,
    });
  });

  socket.on("getprofile", async (id) => {
    if (id) {
      const decoded = jwt.verify(id, "soyal");
      //   console.error('getprofile',decoded._id)

      const user = await User.findById(decoded._id);

      socket.emit("setProfile", user);
    }
  });

  // Chat socket

  // socket.on("create-msg", async (data) => {
  //   if (data.hasOwnProperty("agent_id")) {
  //     var ticket = await Chat.findOne({ _id: data.chat_id });
  //   } else {
  //     var ticket = await Chat.findOneAndUpdate(
  //       { _id: data.chat_id },
  //       { $inc: { unseen: 1 } },
  //       { returnOriginal: false }
  //     );
  //   }

  //   const conversation = new Conversation({
  //     chat_id: data.chat_id,
  //     recipients: data.recipients,
  //     text: data.text,
  //     media: data.media,
  //   });
  //   //   console.error(data,'user')
  //   await conversation.save();

  //   if (
  //     ticket.status == 0 &&
  //     ticket.agent_id == null &&
  //     data.hasOwnProperty("agent_id")
  //   ) {
  //     await Chat.updateOne(
  //       { _id: data.chat_id },
  //       { agent_id: data?.agent_id, status: 1 }
  //     );

  //     //   conversation
  //     const query = Conversation.find({ chat_id: data.chat_id }).sort({
  //       createdAt: -1,
  //     });

  //     const total_documents = await Conversation.find({
  //       chat_id: data.chat_id,
  //     }).countDocuments();

  //     const doc = await pagination(query, total_documents, data);
  //     console.error(ticket, "doc");

  //     const user = await users.find((user) => user.id == data.recipients);
  //     console.error("1234", user);
  //     user && socket.to(`${user.socketId}`).emit("recive-msg", data);

  //     const useragent = await users.find((user) => user.id == data?.agent_id);
  //     useragent && socket.to(`${useragent.socketId}`).emit("conversation", doc);
  //   } else {
  //     const user = await users.find((user) => user.id == data.recipients);
  //     console.error("123", users, data);
  //     user && socket.to(`${user.socketId}`).emit("recive-msg", data);
  //   }
  // });

  socket.on("endChat", async (data) => {
    // console.error("ended", data.ticket_id);

    const chatlist = await Chat.updateOne(
      { ticket_id: data.ticket_id },
      { remark: data.remark, status: 3 }
    );

    const user = await users.find((user) => user.id == chatlist.user_id);
    user && socket.to(`${user.socketId}`).emit("ended", data);

    const useragent = await users.find((user) => user.id == chatlist.agent_id);
    useragent && socket.to(`${useragent.socketId}`).emit("ended", data);
  });

  socket.on("disconnect", async () => {
    const data = await users.findIndex((user) => user.socketId === socket.id);
    // console.error("disconnected" , data)
    users.splice(data, 1);
    // console.log(users)
  });
};

async function pagination(DBQuery, total_documents, req) {
  let { page, limit } = req;
  if (!page) page = 1;
  if (!limit) limit = 10;
  const size = parseInt(limit);
  const skip = (page - 1) * size;
  const previous_pages = page - 1;

  // const total_documents = await DB.countDocuments().exec();
  const next_pages = Math.ceil((total_documents - skip) / size);

  const results = {};
  results.page = page;
  results.size = size;

  results.previous = previous_pages;
  results.next = next_pages;
  results.totalRecord = total_documents;
  try {
    results.results = await DBQuery.limit(size).skip(skip);
    return results;
  } catch (e) {
    // console.log(e)
    return e;
  }
}
async function deduct_wallet(user1_id, user2_id, gameAmount, Game) {
  const user1 = await User.findById(user1_id);
  const user2 = await User.findById(user2_id);
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
  await Game.save();

  return {
    Winner_closingbalance: user1.Wallet_balance,
    Loser_closingbalance: user2.Wallet_balance,
  };
}

async function prevCreated(creator, acceptor) {
  const games = await RunningGame.find({
    $and: [{ $and: [{ Status: "new" }, { Created_by: creator }] }],
  });
  if (games.length) {
    games.forEach(async (ele) => {
      // Gamedelete.create(games[0]);

      await ele.delete();
    });
  }
  const games1 = await RunningGame.find({
    $and: [{ $and: [{ Status: "new" }, { Created_by: acceptor }] }],
  });
  if (games1.length) {
    games1.forEach(async (ele) => {
      // console.log('abc',ele)
      // Gamedelete.create(games1[0]);

      await ele.delete();
    });
  }
}
async function prevRequested(creator, acceptor) {
  // for creator

  const creatorGames = await RunningGame.find({
    $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: creator }] }],
  });
  if (creatorGames.length) {
    creatorGames.forEach(async (ele) => {
      ele.Status = "new";
      ele.Accepetd_By = null;
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }
  const creatorGames1 = await RunningGame.find({
    $and: [{ $and: [{ Status: "requested" }, { Created_by: creator }] }],
  });
  if (creatorGames1.length) {
    creatorGames1.forEach(async (ele) => {
      const user1 = await User.findById(ele.Accepetd_By);
      const user2 = await User.findById(ele.Created_by);

      ele.Status = "cancelled";
      ele.Cancelled_by = "63dca188e0ba9c4835918ae4";

      ele.action_by = ele.Accepetd_By; //Added By team
      ele.actionby_Date = Date.now(); //Added By team

      await ele.save();
    });
  }
  // for acceptor
  const acceptorGames = await RunningGame.find({
    $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: acceptor }] }],
  });
  if (acceptorGames.length) {
    acceptorGames.forEach(async (ele) => {
      ele.Accepetd_By = null;
      ele.Status = "new";
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }
  const acceptorGames1 = await RunningGame.find({
    $and: [{ $and: [{ Status: "requested" }, { Created_by: acceptor }] }],
  });
  if (acceptorGames1.length) {
    acceptorGames1.forEach(async (ele) => {
      //await ele.delete()
      const user1 = await User.findById(ele.Accepetd_By);
      const user2 = await User.findById(ele.Created_by);

      ele.Status = "cancelled";
      ele.Cancelled_by = "63dca188e0ba9c4835918ae4";

      ele.action_by = ele.Accepetd_By; //Added By team
      ele.actionby_Date = Date.now(); //Added By team

      const Gamedeletenew = new Gamedelete({
        gameid: ele._id,
        Table_id: ele.Table_id,
        Game_type: ele.Game_type,
        Game_Ammount: ele.Game_Ammount,
        Room_code: ele.Room_code,
        Created_by: ele.Created_by,
        Accepetd_At: ele.Accepetd_At,
        action_by: ele.action_by,
        actionby_Date: ele.actionby_Date,
        Status: ele.Status,
        Status_Update_By: ele.Status_Update_By,
        Status_Reason: ele.Status_Reason,
        Creator_Status: ele.Creator_Status,
        Creator_Status_Reason: ele.Creator_Status_Reason,
        Creator_Screenshot: ele.Creator_Screenshot,
        Creator_Status_Updated_at: ele.Creator_Status_Updated_at,
        Acceptor_status: ele.Acceptor_status,
        Acceptor_status_reason: ele.Acceptor_status_reason,
        Acceptor_screenshot: ele.Acceptor_screenshot,
        Acceptor_status_Updated_at: ele.Acceptor_status_Updated_at,
        Acceptor_by_Creator_at: ele.Acceptor_by_Creator_at,
        Acceptor_seen: ele.Acceptor_seen,
        Room_join: ele.Room_join,
        Room_Status: ele.Room_Status,
        Winner_closingbalance: ele.Winner_closingbalance,
        Loser_closingbalance: ele.Loser_closingbalance,
        creatorWithdrawDeducted: ele.creatorWithdrawDeducted,
        acceptorWithdrawDeducted: ele.acceptorWithdrawDeducted,
        winnAmount: ele.winnAmount,
        room_Code_shared: ele.room_Code_shared,
        createdAt: ele.createdAt,
        updatedAt: ele.updatedAt,
        type: "prevRequested_socketserver",
      });
      Gamedeletenew.save();

      await ele.save();
    });
  }
}
module.exports = SocketServer;
