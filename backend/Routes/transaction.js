const router = require("express").Router();

const Auth = require("../Middleware/Auth");
const RoleBase = require("../Middleware/Role");
const Transaction = require("../Model/transaction");
const User = require("../Model/User");
const Temp = require("../Model/temp/temp");
const Game = require("../Model/Games");
const RunningGame = require("../Model/RunningGame");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const axios = require("axios").default;
const Razorpay = require("razorpay");
const { saveNotification } = require("../saveNotification");
const jsSHA = require("jssha");
//use for razorpay service provider
let InProcessSubmit = false;
let InProcessDipositCallback = false;
let InProcessDipositWebhook = false;
const randomstring = require("randomstring");

router.post("/pinelabweb/response", async (req, res) => {
  console.log("pinelab webhook", req.body);
  res.status(200).json({
    status: "ok",
    message: "response",
    responsecode: "200",
    data: null,
  });
});

router.post(
  "/manual/deposit/txn",
  Auth,
  upload.fields([{ name: "Transaction_Screenshot", maxCount: 1 }]),
  async (req, res) => {
    if (
      req.body.referenceId.length !== 12 ||
      !/^\d+$/.test(req.body.referenceId)
    ) {
      return res.send({
        status: "false",
        message: "invalid UTR number",
        responsecode: "200",
        data: [],
      });
    }
    const txnold = await Transaction.find({
      order_token: req.body.referenceId,
    });
    console.error(txnold.length, "depositupi");
    if (txnold != null && txnold.length != 0) {
      res.send({
        status: "false",
        message: "request already submit",
        responsecode: "200",
        data: txnold,
      });
    } else {
      const txnPending = await Transaction.find({
        User_id: req.user._id,
        Req_type: "deposit",
        status: "Pending",
        payment_gatway: "paymanual",
      });
      console.error(txnPending, "txnPending");
      if (txnPending != null && txnPending.length != 0) {
        res.send({
          status: "false",
          message: "request already submit. Please Wait for processed",
          responsecode: "200",
          data: txnold,
        });
      } else {
        const txn = await new Transaction({
          amount: req.body.amount,
          User_id: req.user._id,
          Req_type: "deposit",
          order_token: req.body.referenceId,
        });
        const user = await User.findById(txn.User_id);
        var paymentImage;
        if (typeof req.files.Transaction_Screenshot !== "undefined") {
          fs.access("public/payment", (error) => {
            if (error) {
              fs.mkdirSync("public/payment");
            }
          });
          const { buffer, originalname } = req.files.Transaction_Screenshot[0];
          const uniqueSuffix =
            Date.now() + "-1-" + Math.round(Math.random() * 1e9);

          const ref = `${uniqueSuffix}.webp`;
          //   console.log(buffer);
          await sharp(buffer)
            .webp({ quality: 20 })
            .toFile("public/payment/" + ref);

          paymentImage = "public/payment/" + ref;
          // data.front= req.files.front[0].path;
          txn.paymentImage = paymentImage;
        }

        txn.status = "Pending";
        txn.txn_msg = "manualpayment";
        txn.payment_gatway = "paymanual";
        txn.order_id = txn._id;
        await txn.save();
        res.send({
          status: "Pending",
          message: "Request Submit Successfully",
          responsecode: "200",
          data: txn,
        });
      }
    }
  }
);
//use for razorpay service provider response

//use for upigatway service provider
router.post("/user/depositeupi", Auth, async (req, res) => {
  const txn = new Transaction({
    amount: req.body.amount,
    User_id: req.user._id,
    Req_type: "deposit",
  });
  const user = await User.findById(txn.User_id);
  await axios
    .post(
      "https://merchant.upigateway.com/api/create_order",
      {
        key: "b6c2fdb4-38a1-45ee-be23-d6c5a0466ee2",
        client_txn_id: txn._id,
        amount: txn.amount.toString(),
        p_info: "Add Wallet",
        customer_name: user.Name,
        customer_email: "user@gmail.com",
        customer_mobile: user.Phone.toString(),
        redirect_url: "http://staradda.in/return",
        udf1: "user defined field 1",
        udf2: "user defined field 2",
        udf3: "user defined field 3",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((result) => {
      console.log(result);
      if (result.data.status) {
        txn.status = "Pending";
        txn.payment_gatway = req.body.payment_gatway;
        txn.order_id = txn._id;
        txn.order_token = result.data.data.order_id;
        res.send({ data: result.data, txnID: txn._id });
        txn.save();
      } else {
        res.send({ data: result.data });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

//use for upigatway service provider response
router.post("/depositupipay/response", Auth, async (req, res) => {
  console.error("error650");
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  //today = dd + '-' + mm + '-' + yyyy;
  if (req.body.pay_date) {
    today = req.body.pay_date;
  } else {
    today = dd + "-" + mm + "-" + yyyy;
  }
  //console.log(today)

  const orderID = req.body.order_id;
  const orderToken = req.body.order_token;
  const txn = await Transaction.findById(orderID);
  const user = await User.findById(txn?.User_id);
  //&& txn.status != "FAILED"
  if (
    txn.order_id === orderID &&
    txn.order_token === orderToken &&
    txn.status != "PAID"
  ) {
    await axios
      .post(
        "https://merchant.upigateway.com/api/check_order_status",
        {
          key: "b6c2fdb4-38a1-45ee-be23-d6c5a0466ee2",
          client_txn_id: orderID,
          txn_date: today,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        //console.log(response)
        if (response.data.data.status === "success") {
          txn.status = "PAID";
          txn.txn_msg = "Transaction is Successful";
          user.Wallet_balance += txn.amount;
          user.totalDeposit += txn.amount;

          txn.closing_balance = user.Wallet_balance;
        } else {
          txn.status = "FAILED";
          txn.txn_msg = response.data.data.remark;
        }
        user.save();
        txn.save();
        res.send(txn);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    res.send(txn);
  }
});

router.post("/upideposit/status-D32", async (req, res) => {
  console.log("upigateway notify", req.body);

  const orderID = req.body.client_txn_id;
  const txn = await Transaction.findById(orderID);
  if (txn.status != "PAID" && txn.status != "FAILED") {
    if (req.body.status == "success") {
      txn.status = "PAID";
      const user = await User.findById(txn.User_id);
      user.Wallet_balance += txn.amount;
      user.totalDeposit += txn.amount;
      await user.save();
      txn.closing_balance = user.Wallet_balance;
      txn.txn_msg = "UPI Transaction is Successful";
      await txn.save();
    } else if (req.body.status == "failure") {
      txn.status = "FAILED";
      txn.txn_msg = req.body.remark;
      await txn.save();
    } else {
      txn.status = "Pending";
      txn.txn_msg = "Transaction Processing";
      await txn.save();
    }
  }
  res
    .status(200)
    .json({ status: "ok", message: "response", responsecode: "200" });
});

router.post("/user/depositeupi-2", Auth, async (req, res) => {
  const txn = new Transaction({
    amount: req.body.amount,
    User_id: req.user._id,
    Req_type: "deposit",
  });
  const user = await User.findById(txn.User_id);
  await axios
    .post(
      "https://merchant.upigateway.com/api/create_order",
      {
        key: "d4b40e0e-0eaa-422b-919c-3e13cfd02020",
        client_txn_id: txn._id,
        amount: txn.amount.toString(),
        p_info: "Add Wallet",
        customer_name: user.Name,
        customer_email: "user@gmail.com",
        customer_mobile: user.Phone.toString(),
        redirect_url: "http://staradda.in/return",
        udf1: "user defined field 1",
        udf2: "user defined field 2",
        udf3: "user defined field 3",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((result) => {
      console.log(result);
      if (result.data.status) {
        txn.status = "Pending";
        txn.payment_gatway = req.body.payment_gatway;
        txn.order_id = txn._id;
        txn.order_token = result.data.data.order_id;
        res.send({ data: result.data, txnID: txn._id });
        txn.save();
      } else {
        res.send({ data: result.data });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

//use for upigatway service provider response
router.post("/depositupipay/response-2", Auth, async (req, res) => {
  console.error("error651");
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  //today = dd + '-' + mm + '-' + yyyy;
  if (req.body.pay_date) {
    today = req.body.pay_date;
  } else {
    today = dd + "-" + mm + "-" + yyyy;
  }
  //console.log(today)

  const orderID = req.body.order_id;
  const orderToken = req.body.order_token;
  const txn = await Transaction.findById(orderID);
  const user = await User.findById(txn?.User_id);
  //&& txn.status != "FAILED"
  if (
    txn.order_id === orderID &&
    txn.order_token === orderToken &&
    txn.status != "PAID"
  ) {
    await axios
      .post(
        "https://merchant.upigateway.com/api/check_order_status",
        {
          key: "d4b40e0e-0eaa-422b-919c-3e13cfd02020",
          client_txn_id: orderID,
          txn_date: today,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        //console.log(response)
        if (response.data.data.status === "success") {
          txn.status = "PAID";
          txn.txn_msg = "Transaction is Successful";
          user.Wallet_balance += txn.amount;
          user.totalDeposit += txn.amount;

          txn.closing_balance = user.Wallet_balance;
        } else {
          txn.status = "FAILED";
          txn.txn_msg = response.data.data.remark;
        }
        user.save();
        txn.save();
        res.send(txn);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    res.send(txn);
  }
});

router.post("/upideposit/status-D32-2", async (req, res) => {
  console.log("upigateway notify", req.body);

  const orderID = req.body.client_txn_id;
  const txn = await Transaction.findById(orderID);
  if (txn.status != "PAID" && txn.status != "FAILED") {
    if (req.body.status == "success") {
      txn.status = "PAID";
      const user = await User.findById(txn.User_id);
      user.Wallet_balance += txn.amount;
      user.totalDeposit += txn.amount;
      await user.save();
      txn.closing_balance = user.Wallet_balance;
      txn.txn_msg = "UPI Transaction is Successful";
      await txn.save();
    } else if (req.body.status == "failure") {
      txn.status = "FAILED";
      txn.txn_msg = req.body.remark;
      await txn.save();
    } else {
      txn.status = "Pending";
      txn.txn_msg = "Transaction Processing";
      await txn.save();
    }
  }
  res
    .status(200)
    .json({ status: "ok", message: "response", responsecode: "200" });
});

router.post("/user/deposite", Auth, async (req, res) => {
  const txn = new Transaction({
    amount: req.body.amount,
    User_id: req.user._id,
    Req_type: "deposit",
  });
  const user = await User.findById(txn.User_id);
  await axios
    .post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: txn._id,
        order_amount: txn.amount,
        order_currency: "INR",
        order_note: "Additional order info",
        customer_details: {
          customer_id: txn.User_id,
          customer_email: "techsupport@cashfree.com",
          customer_phone: user.Phone.toString(),
        },
        order_meta: {
          return_url:
            "https://api.infiearn.in/return_cashfrre?order_id={order_id}&order_token={order_token}",
          notify_url: "https://api.infiearn.in/deposit/notify",
        },
      },

      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-01-01",
          "x-client-id": "2179916d94c8d78c4233c8d36*****",
          "x-client-secret": "d49ee1bc6fd95197fb5457bf37b78690f8f*****",
        },
      }
    )
    .then((result) => {
      const response = result.data;
      if (response.order_status == "ACTIVE") {
        txn.status = "Pending";
        txn.payment_gatway = "cashfree";
        txn.cf_order_id = response.cf_order_id;
        txn.order_id = response.order_id;
        txn.order_token = response.order_token;
        let options = {};
        if (req.body.payment_method == "app") {
          options = {
            method: "POST",
            url: "https://api.cashfree.com/pg/orders/pay",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-version": "2022-01-01",
            },
            data: {
              payment_method: {
                app: {
                  channel: req.body.channel,
                  provider: req.body.provider,
                  phone: `${user.Phone}`,
                },
              },
              order_token: txn.order_token,
            },
          };
        } else if (req.body.payment_method == "upi") {
          options = {
            method: "POST",
            url: "https://api.cashfree.com/pg/orders/pay",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-version": "2022-01-01",
            },
            data: {
              payment_method: {
                upi: { channel: req.body.channel, upi_expiry_minutes: 10 },
              },
              order_token: txn.order_token,
            },
          };
        } else if (req.body.payment_method == "netbanking") {
          options = {
            method: "POST",
            url: "https://api.cashfree.com/pg/orders/pay",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-version": "2022-01-01",
            },
            data: {
              payment_method: {
                netbanking: {
                  channel: req.body.channel,
                  netbanking_bank_code: parseInt(req.body.bankCode),
                },
              },
              order_token: txn.order_token,
            },
          };
        }

        axios
          .request(options)
          .then(function (response) {
            res.send({
              data: response.data,
              txnID: txn._id,
              order_id: txn.order_id,
              order_token: txn.order_token,
            });
          })
          .catch(function (error) {
            console.error("t-line 752", error.message);
          });
        // channel qrcode end
      }
    })
    .catch((e) => {
      console.log(e);
    });
  txn.save();
});

router.post("/upideposit/status", upload.none(), async (req, res) => {
  console.log("upigateway notify", req.body);
  res.status(200).json({
    status: "ok",
    message: "response",
    responsecode: "200",
    data: null,
  });
  //amount , client_txn_id , createdAt , customer_email , customer_mobile , customer_name , customer_vpa , id , p_info , redirect_url , remark , status , txnAt , udf1 , udf2 , udf3 , upi_txn_id
  // const orderID = req.body.data.order.order_id;
  // const txn = await Transaction.findById(orderID);
  // if (txn.status != "PAID" && txn.status != "FAILED")
  // {
  //     if (req.body.data.payment.payment_status == "SUCCESS")
  //     {
  //         txn.status = 'PAID';
  //         const user = await User.findById(txn.User_id)
  //         user.Wallet_balance += txn.amount;
  //         user.totalDeposit+=txn.amount;
  //         await user.save();
  //         txn.closing_balance = user.Wallet_balance;
  //         txn.txn_msg = 'Transaction is Successful';
  //         await txn.save();
  //     }
  //     else if (req.body.data.payment.payment_status == "FAILED")
  //     {
  //         txn.status = 'FAILED';
  //         txn.txn_msg = req.body.data.error_details.error_description;
  //         await txn.save();
  //     }
  //     else if (req.body.data.payment.payment_status == "USER_DROPPED")
  //     {
  //         txn.status = 'FAILED';
  //         txn.txn_msg = "Transaction failed due to incomplete payment";
  //         await txn.save();
  //     }
  // }
});

router.post("/checkout/deposite/txn", Auth, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.body.txnID);
    if (txn.status != "Pending") {
      res.send({ txnStatus: txn.status, msg: txn.txn_msg });
    } else {
      res.send({ txnStatus: "pending" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/deposit/success", async (req, res) => {
  try {
    const admin = await Transaction.find({
      status: "success",
    }).countDocuments();

    res.status(200).send(admin.toString()).sort({ createdAt: -1 });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/deposit/pending", async (req, res) => {
  try {
    const admin = await Transaction.find({
      status: "Pending",
    }).countDocuments();

    res.status(200).send(admin.toString()).sort({ createdAt: -1 });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/deposit/rejected", async (req, res) => {
  try {
    const admin = await Transaction.find({ status: "rejected" })
      .countDocuments()
      .sort({ createdAt: -1 });

    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get(
  "/txn/deposit/allmanual",
  Auth,
  RoleBase("Admin", "Agent"),
  async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const searchbystatus = req.query._status;

    const PAGE_SIZE = req.query._limit;
    let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
    try {
      let query = {};
      let total;
      let admin;
      if (
        searchq != 0 &&
        searchtype != 0 &&
        searchbystatus == 0 &&
        searchtype != "_id"
      ) {
        page = parseInt("0");
        query[searchtype] =
          searchtype === "Phone" || searchtype === "_id"
            ? searchq
            : new RegExp(".*" + searchq + ".*");
        let userData = await User.findOne(query)
          .select("_id")
          .where("user_type")
          .ne("Admin");

        myObjectId = userData._id;
        myObjectIdString = myObjectId.toString();

        total = await Transaction.countDocuments({
          Req_type: "deposit",
          payment_gatway: "paymanual",
          User_id: myObjectIdString,
        });
        admin = await Transaction.find({
          Req_type: "deposit",
          payment_gatway: "paymanual",
          User_id: myObjectIdString,
        })
          .populate("User_id")
          .sort({ createdAt: -1 });
      } else if (searchbystatus != 0 && searchq == 0 && searchtype == 0) {
        total = await Transaction.countDocuments({
          Req_type: "deposit",
          payment_gatway: "paymanual",
          status: searchbystatus,
        });
        admin = await Transaction.find({
          Req_type: "deposit",
          payment_gatway: "paymanual",
          status: searchbystatus,
        })
          .populate("User_id")
          .sort({ createdAt: -1 })
          .limit(PAGE_SIZE)
          .skip(PAGE_SIZE * page);
      } else if (searchtype === "_id") {
        query[searchtype] =
          searchtype === "_id" ? searchq : new RegExp(".*" + searchq + ".*");
        query["payment_gatway"] = "paymanual";
        total = await Transaction.countDocuments(query);
        admin = await Transaction.find(query)
          .populate("User_id")
          .sort({ createdAt: -1 })
          .limit(PAGE_SIZE)
          .skip(PAGE_SIZE * page);
      } else {
        total = await Transaction.countDocuments({
          Req_type: "deposit",
          payment_gatway: "paymanual",
        });
        admin = await Transaction.find({
          Req_type: "deposit",
          payment_gatway: "paymanual",
        })
          .populate("User_id")
          .sort({ createdAt: -1 })
          .limit(PAGE_SIZE)
          .skip(PAGE_SIZE * page);
      }

      //const total = await Transaction.countDocuments({$and: [{ Req_type: "deposit" }]});
      //const admin = await Transaction.find({$and: [{ Req_type: "deposit" }]}).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)

      res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.get("/txn/deposit/all", Auth, async (req, res) => {
  const searchq = req.query._q;
  const searchtype = req.query._stype;
  const searchbystatus = req.query._status;

  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    let query = {};
    let total;
    let admin;
    if (
      searchq != 0 &&
      searchtype != 0 &&
      searchbystatus == 0 &&
      searchtype != "_id"
    ) {
      page = parseInt("0");
      query[searchtype] =
        searchtype === "Phone" || searchtype === "_id"
          ? searchq
          : new RegExp(".*" + searchq + ".*");
      let userData = await User.findOne(query)
        .select("_id")
        .where("user_type")
        .ne("Admin");

      myObjectId = userData._id;
      myObjectIdString = myObjectId.toString();

      total = await Transaction.countDocuments({
        Req_type: "deposit",
        User_id: myObjectIdString,
      });
      admin = await Transaction.find({
        Req_type: "deposit",
        User_id: myObjectIdString,
      })
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 });
    } else if (searchbystatus != 0 && searchq == 0 && searchtype == 0) {
      total = await Transaction.countDocuments({
        Req_type: "deposit",
        status: searchbystatus,
      });
      admin = await Transaction.find({
        Req_type: "deposit",
        status: searchbystatus,
      })
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    } else if (searchtype === "_id") {
      query[searchtype] =
        searchtype === "_id" ? searchq : new RegExp(".*" + searchq + ".*");
      total = await Transaction.countDocuments(query);
      admin = await Transaction.find(query)
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    } else {
      total = await Transaction.countDocuments({ Req_type: "deposit" });
      admin = await Transaction.find({ Req_type: "deposit" })
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    }

    //const total = await Transaction.countDocuments({$and: [{ Req_type: "deposit" }]});
    //const admin = await Transaction.find({$and: [{ Req_type: "deposit" }]}).populate("User_id").sort({ createdAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page)

    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin });
  } catch (e) {
    res.status(400).send(e);
  }
});

//bonusbyadmin
router.get("/txn/bonusbyadmin/all", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Transaction.countDocuments({
      $and: [{ Req_type: "bonus" }],
    });
    const admin = await Transaction.find({ $and: [{ Req_type: "bonus" }] })
      .populate("User_id")
      .populate("action_by")
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), admin });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/txn_history/user/:id", Auth, async (req, res) => {
  try {
    const admin = await Transaction.find({
      $and: [
        {
          User_id: req.params.id,
          Req_type: "deposit",
        },
      ],
    })
      .populate("User_id")
      .sort({ createdAt: -1 });

    res.status(200).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/txnwith_history/user/:id", Auth, async (req, res) => {
  try {
    const admin = await Transaction.find({
      $or: [{ User_id: req.params.id, Req_type: "withdraw" }],
    })
      .populate("User_id")
      .sort({ createdAt: -1 });

    res.status(200).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/txn/withdraw/all", Auth, async (req, res) => {
  const searchq = req.query._q;
  const searchtype = req.query._stype;
  const searchbystatus = req.query._status;

  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    let query = {};
    let total;
    let data;
    if (searchq != 0 && searchtype != 0 && searchbystatus == 0) {
      page = parseInt("0");
      query[searchtype] =
        searchtype === "Phone" || searchtype === "_id"
          ? searchq
          : new RegExp(".*" + searchq + ".*");
      let admin = await User.findOne(query)
        .select("_id")
        .where("user_type")
        .ne("Admin");

      myObjectId = admin._id;
      myObjectIdString = myObjectId.toString();

      total = await Transaction.countDocuments({
        Req_type: "withdraw",
        User_id: myObjectIdString,
      });
      data = await Transaction.find({
        Req_type: "withdraw",
        User_id: myObjectIdString,
      })
        // .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 });
    } else if (searchbystatus != 0 && searchq == 0 && searchtype == 0) {
      total = await Transaction.countDocuments({
        Req_type: "withdraw",
        status: searchbystatus,
      });
      data = await Transaction.find({
        Req_type: "withdraw",
        status: searchbystatus,
      })
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    } else {
      total = await Transaction.countDocuments({ Req_type: "withdraw" });
      data = await Transaction.find({ Req_type: "withdraw" })
        .populate("User_id")
        .populate("action_by")
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    }

    //res.status(200).send(data)

    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), data });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/txn/withdraw/all/reject", Auth, async (req, res) => {
  try {
    const data = await Transaction.find({
      Req_type: "withdraw",
    })
      .populate("User_id")
      .sort({ createdAt: -1 });
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

const cfSdk = require("cashfree-sdk");
const { findById } = require("../Model/User");

const config = {
  Payouts: {
    ClientID: "CF217991CB3DEFUD94MM84223***",
    ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8*****",
    ENV: "PRODUCTION",
  },
};

const handleResponse = (response) => {
  if (response.status === "ERROR") {
    throw { name: "handle response error", message: "error returned" };
  }
};

const { Payouts } = cfSdk;
const { Beneficiary, Transfers } = Payouts;

router.post("/withdraw/request", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const lasttrans = await Transaction.findOne({ User_id: req.user.id }).sort({
      _id: -1,
    });

    let currentTime = Date.now();

    let pendingGame = await RunningGame.find({
      $or: [
        { $and: [{ Created_by: req.user.id }] },
        { $and: [{ Accepetd_By: req.user.id }] },
      ],
    });
    if (pendingGame.length == 0) {
      if (
        (parseInt(user.lastWitdrawl) < currentTime &&
          lasttrans.status == "SUCCESS") ||
        user.lastWitdrawl == null ||
        !lasttrans ||
        lasttrans.status != "SUCCESS"
      ) {
        if (req.body.amount >= 95) {
          if (user.withdraw_holdbalance == 0) {
            if (
              user.Wallet_balance >= req.body.amount &&
              user.withdrawAmount >= req.body.amount
            ) {
              user.Wallet_balance -= req.body.amount;
              user.withdrawAmount -= req.body.amount;
              user.withdraw_holdbalance += req.body.amount;
              user.lastWitdrawl = Date.now();
              user.save();

              var clientIp = req.headers["x-real-ip"];
              var clientForwardedIp = req.headers["x-forwarded-for"];
              var clientRemoteIp = req.headers["remote-host"];
              console.log("first");
              const txn = new Transaction();
              txn.amount = req.body.amount;
              txn.User_id = user._id;
              txn.Req_type = "withdraw";
              txn.Withdraw_type = req.body.type;
              txn.payment_gatway = req.body.payment_gatway
                ? req.body.payment_gatway
                : "";
              txn.closing_balance = user.Wallet_balance;
              txn.status = "Pending";
              txn.client_ip = clientIp;
              txn.client_forwarded_ip = clientForwardedIp;
              txn.client_remote_ip = clientRemoteIp;
              await txn.save();
              console.log("first");

              const withdraw = new Temp();
              withdraw.Req_type = "withdraw";
              withdraw.type = req.body.type;
              withdraw.user = user._id;
              withdraw.status = "Pending";
              withdraw.closing_balance = user.Wallet_balance;
              withdraw.amount = req.body.amount;
              withdraw.txn_id = txn._id;
              await withdraw.save();
              //save user notification in db

              res.send({
                msg: "Your withdraw request submited successfully.",
                success: true,
              });
            } else {
              res.send({
                msg: "You have not sufficient balance for withdrawal.",
                success: false,
              });
            }
          } else {
            res.send({
              msg: "Your previous request already in process",
              success: false,
            });
            //Your previous request already in process
          }
        } else {
          res.send({
            msg: "Withdrawal amount should be greater or equal to 95 Rupees",
            success: false,
          });
          //Withdrawal amount should be greater or equal to 95 Rupees.
        }
      } else {
        res.status(200).send({
          msg: "You can't withdrawal for 1 hour since the last withdrawal.",
          success: false,
          subCode: 999,
        });
      }
    } else {
      res.status(200).send({
        msg: "You are enrolled in game.",
        success: false,
        subCode: 999,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//for cashfree admin approval
router.post("/withdraw/bank/adminmanual", Auth, async (req, res) => {
  const { amount, type, userID, txnID, reqID } = req.body;
  try {
    const user = await User.findById(userID);
    if (user.withdraw_holdbalance > 0) {
      const txn = await Transaction.findById(txnID);

      const transfer = {
        beneId: user._id,
        transferId: txn._id,
        amount: amount,
        transferMode: type,
      };

      (async () => {
        Payouts.Init(config.Payouts);
        //Get Beneficiary details
        try {
          const response = await Beneficiary.GetDetails({
            beneId: user._id,
          });
          if (
            response.status === "ERROR" &&
            response.subCode === "404" &&
            response.message === "Beneficiary does not exist"
          ) {
            res.status(200).send(response);
          } else {
            // further process for payment transfer
            try {
              const response = await Transfers.RequestTransfer(transfer);

              res.status(200).send(response);
              handleResponse(response);
            } catch (err) {
              console.log("xyz1", err);
              return;
            }
            //Get transfer status
            try {
              const response = await Transfers.GetTransferStatus({
                transferId: transfer.transferId,
              });
              if (response.data.transfer.status === "SUCCESS") {
                txn.referenceId = response.data.transfer.referenceId;
                txn.status = response.data.transfer.status;
                user.totalWithdrawl += txn.amount;
                user.withdraw_holdbalance -= txn.amount;
                user.lastWitdrawl = Date.now();
                await user.save();
                await txn.save();

                const withdraw = await Temp.findById(reqID);
                withdraw.status = response.data.transfer.status;
                withdraw.save();

                //save user notification in db
                const other = [];
                const userinfo = [];
                userinfo.push(user);
                other["type"] = "withdraw";
                const notification_type = "firebase";
                const title = "Withdraw Success";
                const body =
                  "Congratulations!👍 Your withdrawal request for amount " +
                  txn.amount +
                  " has been processed successfully. The funds will be transferred to your account shortly.🤑🤑";
                const send_to = "users";
                const msg_type = "withdraw";
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
              }

              handleResponse(response);
            } catch (err) {
              console.log("err caught in getting transfer status");
              console.log(err);
              return;
            }
          }
        } catch (err) {
          console.log("err caught in getting beneficiary details");
          console.log(err);
          return;
        }
      })();
    } else {
      res.status(200).send({ message: "Invalid Request", subCode: 999 });
    }
  } catch (e) {
    res.send(e);
    console.log("xyz2", e);
  }
});

//for decentro admin payout approval
router.post("/withdraw/decentro/adminmanual", Auth, async (req, res) => {
  const { amount, type, userID, txnID, reqID } = req.body;

  //console.log('admin txnid');
  //console.log(reqID);
  try {
    const user = await User.findById(userID);
    const txn = await Transaction.findById(txnID);
    const withdraw = await Temp.findById(reqID);

    var clientIp = req.headers["x-real-ip"];
    var clientForwardedIp = req.headers["x-forwarded-for"];
    var clientRemoteIp = req.headers["remote-host"];

    if (user.withdraw_holdbalance > 0) {
      if (InProcessSubmit == false) {
        //res.status(200).send({ message: 'Payout Request already processed', subCode: 999 });
        InProcessSubmit = true;
        //console.log(withdraw);
        if (txn.status === "SUCCESS" || txn.status === "FAILED") {
          console.log("Payout Request already processed3");
          InProcessSubmit = false;
          res.status(200).send({
            message: "Payout Request already processed3",
            subCode: 999,
          });
        } else {
          //console.log(withdraw);
          const transfer = {
            beneId: user._id,
            transferId: txn._id,
            amount: amount,
            transferMode: type,
          };

          (async () => {
            const options = {
              method: "POST",
              url: "https://in.decentro.tech/core_banking/money_transfer/initiate",
              headers: {
                client_id: "infiearn_prod",
                client_secret: "UE9eHgZJHJIPYx5UIP5Bcax0****",
                module_secret: "EWjcNaVGrJiAV0MfhnIhftj4D********",
                provider_secret: "ru87wL2BYB8NEtSTtGvVLCG********",
                "content-type": "application/json",
              },
              data: {
                reference_id: txn._id,
                purpose_message: "user withrawal request",
                from_customer_id: "RKL00001",
                to_customer_id: user._id.toString(),
                from_account: "462511890518651665",
                to_account: user.account_number.toString(),
                mobile_number: user.Phone.toString(),
                email_address: "test@mail.com",
                name: user.holder_name.toString(),
                transfer_type: "IMPS",
                transfer_amount: amount.toString(),
                beneficiary_details: {
                  email_address: "test01@company.com",
                  mobile_number: user.Phone.toString(),
                  address: "test address01",
                  ifsc_code: user.ifsc_code.toString(),
                  country_code: "IN",
                  payee_name: user.holder_name.toString(),
                },
                currency_code: "INR",
              },
            };

            axios
              .request(options)
              .then(function (response) {
                console.log("admin manual payout response success");
                console.log(response.data);

                if (response.data.status === "success") {
                  txn.referenceId = response.data.decentroTxnId;
                  txn.status = response.data.status;
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  user.totalWithdrawl += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                  user.save();
                  txn.save();

                  withdraw.closing_balance =
                    withdraw.closing_balance - withdraw.amount;
                  withdraw.status = "SUCCESS";
                  withdraw.save();

                  res.status(200).send({
                    message: "withdrawal request successfully approved",
                    subCode: 200,
                  });
                } else if (response.data.status === "pending") {
                  txn.referenceId = response.data.decentroTxnId;
                  txn.status = response.data.status;
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  txn.save();

                  withdraw.closing_balance =
                    withdraw.closing_balance - withdraw.amount;
                  withdraw.status = "SUCCESS";
                  withdraw.save();

                  res.status(200).send({
                    message: "Your withdrawal request in proccessing",
                    subCode: 200,
                  });
                }
                InProcessSubmit = false;
              })
              .catch(function (error) {
                txn.status = "FAILED";
                txn.action_by = req.user.id;
                txn.txn_msg =
                  "issuer bank or payment service provider declined the transaction";

                txn.client_ip = clientIp;
                txn.client_forwarded_ip = clientForwardedIp;
                txn.client_remote_ip = clientRemoteIp;

                if (user.withdraw_holdbalance == txn.amount) {
                  user.Wallet_balance += txn.amount;
                  user.withdrawAmount += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                }
                user.save();
                txn.save();
                withdraw.closing_balance =
                  withdraw.closing_balance + withdraw.amount;
                withdraw.status = "FAILED";
                withdraw.save();
                InProcessSubmit = false;
                console.log("admin manual payout response FAILED");
                //console.log(error);
              });
          })();
        }
      } else {
        console.log("Payout Request already processed4");
        InProcessSubmit = false;
        res
          .status(200)
          .send({ message: "Payout Request already processed", subCode: 999 });
      }
    } else {
      txn.status = "FAILED";
      txn.action_by = req.user.id;
      txn.txn_msg = "Invalid transaction request";

      txn.client_ip = clientIp;
      txn.client_forwarded_ip = clientForwardedIp;
      txn.client_remote_ip = clientRemoteIp;

      if (user.withdraw_holdbalance == txn.amount) {
        user.Wallet_balance += txn.amount;
        user.withdrawAmount += txn.amount;
        user.withdraw_holdbalance -= txn.amount;
      }
      user.save();
      txn.save();
      //withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
      withdraw.status = "FAILED";
      withdraw.save();
      InProcessSubmit = false;
      res.status(200).send({ message: "Invalid Request", subCode: 999 });
    }
  } catch (e) {
    console.log(e);
    res.send("xyz3", e);
    //console.log(e);
  }
});

//for razorpay admin payout approval
router.post("/withdraw/razorpay/adminmanual", Auth, async (req, res) => {
  const { amount, type, userID, txnID, reqID } = req.body;

  var clientIp = req.headers["x-real-ip"];
  var clientForwardedIp = req.headers["x-forwarded-for"];
  var clientRemoteIp = req.headers["remote-host"];

  try {
    const user = await User.findById(userID);

    const mismatchValue =
      user.Wallet_balance -
      (user.wonAmount -
        user.loseAmount +
        user.totalDeposit +
        user.referral_earning +
        user.totalBonus -
        (user.totalWithdrawl +
          user.referral_wallet +
          user.withdraw_holdbalance +
          user.hold_balance +
          user.totalPenalty));

    console.error(mismatchValue, "mismatchValue");
    if (mismatchValue != 0) {
      res.status(200).send({ message: "Mismatch Exist", subCode: 999 });
    } else if (user.hold_balance < 0) {
      return res.status(200).send({ message: "Balance on hold", subCode: 999 });
    } else if (user.withdraw_holdbalance > 0 && type == "upi") {
      const txn = await Transaction.findById(txnID);
      const withdraw = await Temp.findById(reqID);

      if (InProcessSubmit == false) {
        //res.status(200).send({ message: 'Payout Request already processed', subCode: 999 });
        InProcessSubmit = true;
        //console.log(withdraw);
        if (txn.status === "SUCCESS" || txn.status === "FAILED") {
          InProcessSubmit = false;
          res.status(200).send({
            message: "Payout Request already processed1",
            subCode: 999,
          });
        } else {
          //rzp_test_i0SlYyQSHbxcv1
          //P7J4aOT676Px2CJq0eXLAs9K
          var username = "rzp_live_*****";
          var password = "0XfdsTd1qxc42*****";
          (async () => {
            const axios = require("axios").default;
            const options = {
              method: "POST",
              url: "https://api.razorpay.com/v1/payouts",
              auth: {
                username: username,
                password: password,
              },
              headers: {
                "content-type": "application/json",
              },
              data: {
                account_number: "45645601861071",
                amount: amount * 100,
                currency: "INR",
                mode: "UPI",
                purpose: "payout",
                fund_account: {
                  account_type: "vpa",
                  vpa: {
                    address: user.upi_id,
                  },
                  contact: {
                    name: user.holder_name.toString(),
                    email: user.email ? user.email.toString() : "",
                    contact: user.Phone ? user.Phone.toString() : "",
                    type: "self",
                    reference_id: user._id.toString(),
                  },
                },
                queue_if_low_balance: true,
                reference_id: txn._id,
              },
            };

            await axios
              .request(options)
              .then(function (response) {
                // console.error(response.data.id,'rozerpay withdrow');

                if (response.data.status === "processed") {
                  txn.referenceId = response.data.id;
                  txn.status = "SUCCESS";
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  if (user.withdraw_holdbalance == txn.amount) {
                    user.totalWithdrawl += txn.amount;
                    user.withdraw_holdbalance -= txn.amount;
                  }

                  user.save();
                  txn.save();

                  withdraw.closing_balance =
                    withdraw.closing_balance - withdraw.amount;
                  withdraw.status = "SUCCESS";
                  withdraw.save();

                  InProcessSubmit = false;

                  res.status(200).send({
                    message: "Your withdrawal request successfully completed",
                    subCode: 200,
                  });
                } else if (
                  response.data.status === "pending" ||
                  response.data.status === "queued" ||
                  response.data.status === "processing"
                ) {
                  txn.referenceId = response.data.id;
                  txn.status = "pending";
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  txn.save();
                  user.save();

                  //withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
                  withdraw.status = "Proccessing";
                  withdraw.save();

                  InProcessSubmit = false;

                  res.status(200).send({
                    message: "Your withdrawal request in proccessing",
                    subCode: 200,
                  });
                } else if (
                  response.data.status === "rejected" ||
                  response.data.status === "cancelled"
                ) {
                  txn.referenceId = response.data.id;
                  txn.status = "FAILED";
                  txn.action_by = req.user.id;
                  txn.txn_msg =
                    "issuer bank or payment service provider declined the transaction";

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  if (user.withdraw_holdbalance == txn.amount) {
                    user.Wallet_balance += txn.amount;
                    user.withdrawAmount += txn.amount;
                    user.withdraw_holdbalance -= txn.amount;
                  }
                  user.save();
                  txn.save();

                  withdraw.closing_balance =
                    withdraw.closing_balance + withdraw.amount;
                  withdraw.status = "FAILED";
                  withdraw.save();

                  InProcessSubmit = false;

                  res.status(200).send({
                    message: "Your withdrawal request failed",
                    subCode: 200,
                  });
                }
              })
              .catch(function (error) {
                console.error("admin auto payout response error");
                txn.status = "FAILED";
                txn.action_by = req.user.id;
                txn.txn_msg =
                  "Withdraw request failed due to technical issue, try after some time.";

                txn.client_ip = clientIp;
                txn.client_forwarded_ip = clientForwardedIp;
                txn.client_remote_ip = clientRemoteIp;

                if (user.withdraw_holdbalance == txn.amount) {
                  user.Wallet_balance += txn.amount;
                  user.withdrawAmount += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                }
                user.save();
                txn.save();

                withdraw.closing_balance =
                  withdraw.closing_balance + withdraw.amount;
                withdraw.status = "FAILED";
                withdraw.save();

                InProcessSubmit = false;

                res.status(200).send({
                  message:
                    "Withdraw request failed due to technical issue, try after some time.",
                  subCode: 200,
                });
              });
          })();
          user.save();
          txn.save();
        }
      } else {
        console.log("Payout Request already processed2");
        InProcessSubmit = false;
        res
          .status(200)
          .send({ message: "Payout Request already processed2", subCode: 999 });
      }
    } else {
      InProcessSubmit = false;
      res.status(200).send({ message: "Invalid Request", subCode: 999 });
    }
  } catch (e) {
    res.send(e);
    //console.log(e);
  }
});

router.post("/withdraw/bank", Auth, async (req, res) => {
  const { amount, type } = req.body;
  const userID = req.user.id;
  try {
    const user = await User.findById(userID);
    let currentTime = Date.now();
    let pendingGame = await RunningGame.find({
      $or: [
        { $and: [{ Status: "new" }, { Created_by: userID }] },
        { $and: [{ Status: "new" }, { Accepetd_By: userID }] },
        { $and: [{ Status: "requested" }, { Created_by: userID }] },
        { $and: [{ Status: "requested" }, { Accepetd_By: userID }] },
      ],
    });
    let calculatedWallet =
      user.wonAmount -
      user.loseAmount +
      user.totalDeposit +
      user.referral_earning +
      user.hold_balance +
      user.totalBonus -
      (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);
    if (user.Wallet_balance == calculatedWallet) {
      if (pendingGame.length == 0) {
        if (
          parseInt(user.lastWitdrawl) + 7200000 > currentTime ||
          user.lastWitdrawl == null
        ) {
          if (user.withdraw_holdbalance == 0) {
            if (
              amount <= user.Wallet_balance &&
              amount <= user.withdrawAmount
            ) {
              const txn = new Transaction();
              txn.amount = amount;
              txn.User_id = user._id;
              txn.Req_type = "withdraw";
              txn.Withdraw_type = type;

              user.Wallet_balance -= amount;
              user.withdrawAmount -= amount;
              user.withdraw_holdbalance += amount;
              user.lastWitdrawl = Date.now();
              txn.closing_balance = user.Wallet_balance;

              const transfer = {
                beneId: user._id,
                transferId: txn._id,
                amount: amount,
                transferMode: type,
              };
              (async () => {
                Payouts.Init(config.Payouts);
                //Get Beneficiary details
                try {
                  const response = await Beneficiary.GetDetails({
                    beneId: user._id,
                  });
                  if (
                    response.status === "ERROR" &&
                    response.subCode === "404" &&
                    response.message === "Beneficiary does not exist"
                  ) {
                    res.status(200).send(response);
                    console.log("bene does not exist");
                  } else {
                    // further process for payment transfer
                    try {
                      const response = await Transfers.RequestTransfer(
                        transfer
                      );
                      res.status(200).send(response);
                      handleResponse(response);
                    } catch (err) {
                      console.log("err caught in requesting transfer");
                      console.log(err);
                      return;
                    }
                    //Get transfer status
                    try {
                      const response = await Transfers.GetTransferStatus({
                        transferId: transfer.transferId,
                      });
                      if (response.data.transfer.status === "SUCCESS") {
                        txn.referenceId = response.data.transfer.referenceId;
                        txn.status = response.data.transfer.status;

                        user.totalWithdrawl += txn.amount;
                        user.withdraw_holdbalance -= txn.amount;
                        await user.save();
                        await txn.save();
                      }
                      handleResponse(response);
                    } catch (err) {
                      console.log("err caught in getting transfer status");
                      console.log(err);
                      return;
                    }
                  }
                } catch (err) {
                  console.log("err caught in getting beneficiary details");
                  console.log(err);
                  return;
                }
              })();
              user.save();
              txn.save();
            } else {
              res.status(200).send({
                message: "Amount must be less than and equal to Wallet amount",
                subCode: 999,
              });
            }
          } else {
            res.status(200).send({ message: "Invalid Request", subCode: 999 });
          }
        } else {
          res.status(200).send({
            message:
              "You can't Withdrawal for 2 hour since the last withdrawal.",
            subCode: 999,
          });
        }
      } else {
        res
          .status(200)
          .send({ message: "You are enrolled in game.", subCode: 999 });
      }
    } else {
      res.status(200).send({
        message: "Withdrawal is failed please contact to admin.",
        subCode: 999,
      });
    }
  } catch (e) {
    res.send(e);
    console.log("xyz4", e);
  }
});

//payout payout razorpay bank
router.post("/withdraw/payoutrazorpaybank", Auth, async (req, res) => {
  const { amount, type, payment_gatway } = req.body;
  const userID = req.user.id;

  var clientIp = req.headers["x-real-ip"];
  var clientForwardedIp = req.headers["x-forwarded-for"];
  var clientRemoteIp = req.headers["remote-host"];

  try {
    const user1 = await User.findById(userID);
    const lasttrans = await Transaction.findOne({ User_id: req.user.id }).sort({
      _id: -1,
    });

    let currentTime = Date.now();
    let pendingGame = await RunningGame.find({
      $or: [
        { $and: [{ Status: "new" }, { Created_by: userID }] },
        { $and: [{ Status: "new" }, { Accepetd_By: userID }] },
        { $and: [{ Status: "requested" }, { Created_by: userID }] },
        { $and: [{ Status: "requested" }, { Accepetd_By: userID }] },
      ],
    });
    let calculatedWallet =
      user1.wonAmount -
      user1.loseAmount +
      user1.totalDeposit +
      user1.referral_earning +
      user1.hold_balance +
      user1.totalBonus -
      (user1.totalWithdrawl + user1.referral_wallet + user1.totalPenalty);
    if (user1.Wallet_balance == calculatedWallet) {
      if (pendingGame.length == 0) {
        if (
          (parseInt(user1.lastWitdrawl) + 3600000 < currentTime &&
            lasttrans.status == "SUCCESS") ||
          user1.lastWitdrawl == null ||
          !lasttrans ||
          lasttrans.status != "SUCCESS"
        ) {
          if (amount <= 10000) {
            if (user1.withdraw_holdbalance == 0) {
              if (
                amount <= user1.Wallet_balance &&
                amount <= user1.withdrawAmount
              ) {
                const txn1 = new Transaction();
                txn1.amount = amount;
                txn1.User_id = user1._id;
                txn1.Req_type = "withdraw";
                txn1.Withdraw_type = type;
                txn1.payment_gatway = payment_gatway;

                user1.Wallet_balance -= amount;
                user1.withdrawAmount -= amount;
                user1.withdraw_holdbalance += amount;
                user1.lastWitdrawl = Date.now();
                txn1.closing_balance = user1.Wallet_balance;

                user1.save();
                txn1.save();

                const user = await User.findById(userID);
                const txn = await Transaction.findById(txn1._id);

                //console.log('razor-seco-txndata',txn);

                var username = "rzp_live_*****";
                var password = "0XfdsTd1qxc42*****";
                (async () => {
                  const axios = require("axios").default;
                  const options = {
                    method: "POST",
                    url: "https://api.razorpay.com/v1/payouts",
                    auth: {
                      username: username,
                      password: password,
                    },
                    headers: {
                      "content-type": "application/json",
                    },
                    data: {
                      account_number: "45645601861071",
                      amount: amount * 100,
                      currency: "INR",
                      mode: "UPI",
                      purpose: "payout",
                      fund_account: {
                        account_type: "vpa",
                        vpa: {
                          address: user.upi_id,
                        },
                        contact: {
                          name: user.holder_name.toString(),
                          email: user.email ? user.email.toString() : "",
                          contact: user.Phone ? user.Phone.toString() : "",
                          type: "self",
                          reference_id: user._id.toString(),
                        },
                      },
                      queue_if_low_balance: true,
                      reference_id: txn._id,
                    },
                  };

                  axios
                    .request(options)
                    .then(function (response) {
                      //console.log('USER auto payout response2');
                      //console.log(response.data);

                      txn.client_ip = clientIp;
                      txn.client_forwarded_ip = clientForwardedIp;
                      txn.client_remote_ip = clientRemoteIp;

                      if (response.data.status === "processed") {
                        txn.referenceId = response.data.id;
                        txn.status = "SUCCESS";

                        if (user.withdraw_holdbalance == txn.amount) {
                          user.totalWithdrawl += txn.amount;
                          user.withdraw_holdbalance -= txn.amount;
                        }

                        user.save();
                        txn.save();

                        withdraw.closing_balance =
                          withdraw.closing_balance - withdraw.amount;
                        withdraw.status = "SUCCESS";
                        withdraw.save();

                        res.status(200).send({
                          message:
                            "Your withdrawal request successfully completed",
                          subCode: 200,
                        });
                      } else if (
                        response.data.status === "pending" ||
                        response.data.status === "queued" ||
                        response.data.status === "processing"
                      ) {
                        txn.referenceId = response.data.id;
                        txn.status = "pending";
                        txn.save();
                        user.save();

                        res.status(200).send({
                          message: "Your withdrawal request in proccessing",
                          subCode: 200,
                        });
                      } else if (
                        response.data.status === "rejected" ||
                        response.data.status === "cancelled"
                      ) {
                        txn.referenceId = response.data.id;
                        txn.status = "FAILED";
                        txn.txn_msg =
                          "issuer bank or payment service provider declined the transaction";

                        if (user.withdraw_holdbalance == txn.amount) {
                          user.Wallet_balance += txn.amount;
                          user.withdrawAmount += txn.amount;
                          user.withdraw_holdbalance -= txn.amount;
                        }
                        user.save();
                        txn.save();

                        res.status(200).send({
                          message:
                            "issuer bank or payment service provider declined the transaction",
                          subCode: 200,
                        });
                      }
                    })
                    .catch(function (error) {
                      //console.error('admin auto payout response error2');
                      txn.status = "FAILED";
                      txn.txn_msg =
                        "Withdraw request failed due to technical issue, try after some time.";

                      if (user.withdraw_holdbalance == txn.amount) {
                        user.Wallet_balance += txn.amount;
                        user.withdrawAmount += txn.amount;
                        user.withdraw_holdbalance -= txn.amount;
                      }
                      user.save();
                      txn.save();

                      res.status(200).send({
                        message:
                          "Withdraw request failed due to technical issue, try after some time.",
                        subCode: 200,
                      });
                    });
                })();
              } else {
                res.status(200).send({
                  message:
                    "Amount must be less than and equal to Wallet amount",
                  subCode: 999,
                });
              }
            } else {
              res.status(200).send({
                message: "Your previous request already in process",
                subCode: 999,
              });
            }
          } else {
            res.status(200).send({
              message:
                "UPI Withdrawal limit is Rs.10000, You can use withdraw through bank",
              subCode: 999,
            });
          }
        } else {
          res.status(200).send({
            message:
              "You can't Withdrawal for 1 hour since the last withdrawal.",
            subCode: 999,
          });
        }
      } else {
        res
          .status(200)
          .send({ message: "You are enrolled in game.", subCode: 999 });
      }
    } else {
      res.status(200).send({
        message: "Withdrawal is failed please contact to admin.",
        subCode: 999,
      });
    }
  } catch (e) {
    console.log("xyz5", e);
    res.status(200).send({
      message: "Withdrawal is failed, Due to technical issue.",
      subCode: 999,
    });
  }
});
router.post("/withdraw/payoutcashfreebank", Auth, async (req, res) => {
  res.status(200).send({
    message: "Withdrawal is failed, Due to technical issue.",
    subCode: 999,
  });
  const { amount, type, payment_gatway } = req.body;
  const userID = req.user.id;

  var clientIp = req.headers["x-real-ip"];
  var clientForwardedIp = req.headers["x-forwarded-for"];
  var clientRemoteIp = req.headers["remote-host"];

  //     try {
  //         const user1 = await User.findById(userID);
  //         const lasttrans = await Transaction.findOne({'User_id':req.user.id}).sort({_id:-1});

  //         console.log('userlasttxnstsauto',lasttrans.status);
  //         console.log('userlasttxntime-auto',user1.lastWitdrawl);

  //         let currentTime = Date.now();
  //         let pendingGame = await Game.find(
  //             {
  //                 $or: [
  //                     { $and: [{ Status: "new" }, { Created_by:userID }] },
  //                     { $and: [{ Status: "new" }, { Accepetd_By:userID }] },
  //                     { $and: [{ Status: "requested" }, { Created_by:userID }] },
  //                     { $and: [{ Status: "requested" }, { Accepetd_By:userID }] },
  //                 ],

  //             }
  //         )
  //                 let calculatedWallet = ((user1.wonAmount-user1.loseAmount)+user1.totalDeposit+user1.referral_earning+user1.hold_balance+user1.totalBonus)-(user1.totalWithdrawl+user1.referral_wallet+user1.totalPenalty);
  //         if(user1.Wallet_balance==calculatedWallet)
  //         {

  //             if (pendingGame.length == 0) {
  //             if (((parseInt(user1.lastWitdrawl) + 3600000) < currentTime && lasttrans.status=='SUCCESS') || (user1.lastWitdrawl == null) || (!lasttrans || lasttrans.status!='SUCCESS')) {
  //                     if (amount <= 10000) {
  //                     if (user1.withdraw_holdbalance == 0) {

  //                         if (amount <= user1.Wallet_balance && amount <= user1.withdrawAmount) {
  //                             const txn1 = new Transaction();
  //                             txn1.amount = amount;
  //                             txn1.User_id = user1._id;
  //                             txn1.Req_type = 'withdraw';
  //                             txn1.Withdraw_type = type;
  //                             txn1.payment_gatway = payment_gatway;

  //                             user1.Wallet_balance -= amount;
  //                             user1.withdrawAmount -= amount;
  //                             user1.withdraw_holdbalance += amount;
  //                             user1.lastWitdrawl=Date.now();
  //                             txn1.closing_balance = user1.Wallet_balance;

  //                             // user1.save();
  //                             txn1.save();

  //                             const user = await User.findById(userID);
  //                             const txn = await Transaction.findById(txn1._id);

  //                         var message = '';

  //                             (
  //                                 async () => {
  //                             //   const authToken = await genratecashfreetoken();
  //                                       var axios = require('axios');

  // var config0 = {
  //   method: 'post',
  // maxBodyLength: Infinity,
  //   url: 'https://payout-gamma.cashfree.com/payout/v1/authorize',
  //   headers: {
  //     'X-Client-Id': 'CF169455CFMQC1R1IPNFPL1ADGL0',
  //     'X-Client-Secret': 'c836886644650fd9e8ffb05dd9a42e9ed93bc204'
  //   }
  // };

  // await axios(config0)
  // .then(function (response0) {

  //  var authToken = response0.data.data.token

  //                                  console.log('authToken',authToken);
  //                                     var config = {
  //   method: 'get',
  // maxBodyLength: Infinity,
  //   url: 'https://payout-gamma.cashfree.com/payout/v1/getBeneficiary/'+userID,
  //   headers: {
  //     'Authorization': 'Bearer '+authToken
  //   }
  // };
  // var axios1 = require("axios").default;
  // axios1(config)
  // .then(function (response) {
  //   console.log(JSON.stringify(response.data));
  //   if(response.data.status == 'ERROR'){

  //       var data1 = {
  //           "beneId": user._id.toString(),
  //           "name": user.Name.toString(),
  //           "email": (user.Email)?user.Email:"",
  //           "phone": (user.Phone)?user.Phone:"",
  //           "bankAccount": user.account_number,
  //           "ifsc": user.ifsc_code,
  //           "address1": user.Name,
  //           "city": "",
  //           "state": "",
  //           "pincode": ""
  //       };

  // var config1 = {
  //   method: 'post',
  // maxBodyLength: Infinity,
  //   url: 'https://payout-gamma.cashfree.com/payout/v1/addBeneficiary',
  //   headers: {
  //     'Authorization': 'Bearer '+authToken,
  //     'Content-Type': 'text/plain'
  //   },
  //   data : JSON.stringify(data1)
  // };

  // axios(config1)
  // .then(function (response1) {
  //   console.log(JSON.stringify(response1.data));
  //   if(response1.status == 'SUCCESS'){
  //       var data2 = {
  //           "beneId": user._id.toString(),
  //           "amount": amount,
  //           "transferId": txn._id

  //       };

  // var config2 = {
  //   method: 'post',
  // maxBodyLength: Infinity,
  //   url: 'https://payout-gamma.cashfree.com/payout/v1/requestTransfer',
  //   headers: {
  //     'Authorization': 'Bearer '+authToken,
  //     'Content-Type': 'text/plain'
  //   },
  //   data : JSON.stringify(data2)
  // };

  // axios(config2)
  // .then(function (response2) {
  //   console.log(JSON.stringify(response2.data));
  //     // return res.status(200).send({ message: JSON.stringify(response2.data.message), subCode: 999 });
  // })
  // .catch(function (error2) {
  //   console.log(error2,'error22');
  //   message = JSON.stringify(error2)
  // //   res.status(200).send({ message: JSON.stringify(error2), subCode: 999 });
  // });

  //   }
  // })
  // .catch(function (error1) {
  //   console.log(error1,'error1');
  //     message = JSON.stringify(error1)
  // //   return res.status(200).send({ message: JSON.stringify(error1), subCode: 999 });
  // });
  //   }else{
  //           var data2 = {
  //           "beneId": user._id.toString(),
  //           "amount": amount,
  //           "transferId": txn._id

  //       };

  // var config2 = {
  //   method: 'post',
  // maxBodyLength: Infinity,
  //   url: 'https://payout-gamma.cashfree.com/payout/v1/requestTransfer',
  //   headers: {
  //     'Authorization': 'Bearer '+authToken,
  //     'Content-Type': 'text/plain'
  //   },
  //   data : JSON.stringify(data2)
  // };

  // axios(config2)
  // .then(function (response2) {
  //         message = JSON.stringify(response2.data.message)
  // //  res.status(200).send({ message: response2.data.message, subCode: 999 });
  // })
  // .catch(function (error2) {
  //   console.log(error2,'error2');
  //           message = JSON.stringify(error2)
  //     // res.status(200).send({ message: error2, subCode: 999 });
  // });
  //   }
  // })
  // .catch(function (error) {
  //   console.log(error,'error00');
  //             message = JSON.stringify(error)
  //     // res.status(200).send({ message: JSON.stringify(error), subCode: 999 });
  // });
  // })
  // .catch(function (error) {

  //   console.log(error,'error0');
  //             message = JSON.stringify(error)
  // //   res.status(200).send({ message: JSON.stringify(error), subCode: 999 });
  // });

  //                                 }
  //                             )();
  //                              res.status(200).send({ message: message, subCode: 999 });

  //                         }
  //                         else {
  //                             res.status(200).send({ message: 'Amount must be less than and equal to Wallet amount', subCode: 999 });
  //                         }
  //                     }
  //                     else {
  //                         res.status(200).send({ message: 'Your previous request already in process', subCode: 999 });
  //                     }
  //                 }else {
  //                         res.status(200).send({ message: 'UPI Withdrawal limit is Rs.10000, You can use withdraw through bank', subCode: 999 });
  //                     }
  //                 }
  //                 else {
  //                     res.status(200).send({ message: 'You can\'t Withdrawal for 1 hour since the last withdrawal.', subCode: 999 });
  //                 }
  //             }
  //             else {
  //                 res.status(200).send({ message: 'You are enrolled in game.', subCode: 999 });
  //             }
  //         }
  //         else{
  //             res.status(200).send({ message: 'Withdrawal is failed please contact to admin.', subCode: 999 });
  //         }
  //     }
  //     catch (e) {
  //         console.log('xyz5',e);
  //         res.status(200).send({ message: e.message, subCode: 999 });
  //     }
});

//payout decentro bank
router.post("/withdraw/payoutdecentrobank", Auth, async (req, res) => {
  const { amount, type, payment_gatway } = req.body;
  const userID = req.user.id;

  var clientIp = req.headers["x-real-ip"];
  var clientForwardedIp = req.headers["x-forwarded-for"];
  var clientRemoteIp = req.headers["remote-host"];

  try {
    const user = await User.findById(userID);
    const lasttrans = await Transaction.findOne({ User_id: req.user.id }).sort({
      _id: -1,
    });

    console.log("userlasttxnstsauto", lasttrans.status);
    console.log("userlasttxntime-auto", user.lastWitdrawl);

    let currentTime = Date.now();
    let pendingGame = await RunningGame.find({
      $or: [
        { $and: [{ Status: "new" }, { Created_by: userID }] },
        { $and: [{ Status: "new" }, { Accepetd_By: userID }] },
        { $and: [{ Status: "requested" }, { Created_by: userID }] },
        { $and: [{ Status: "requested" }, { Accepetd_By: userID }] },
      ],
    });
    let calculatedWallet =
      user.wonAmount -
      user.loseAmount +
      user.totalDeposit +
      user.referral_earning +
      user.hold_balance +
      user.totalBonus -
      (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);
    if (user.Wallet_balance == calculatedWallet) {
      if (pendingGame.length == 0) {
        if (
          (parseInt(user.lastWitdrawl) + 3600000 < currentTime &&
            lasttrans.status == "SUCCESS") ||
          user.lastWitdrawl == null ||
          !lasttrans ||
          lasttrans.status != "SUCCESS"
        ) {
          if (user.withdraw_holdbalance == 0) {
            if (
              amount <= user.Wallet_balance &&
              amount <= user.withdrawAmount
            ) {
              const txn = new Transaction();
              txn.amount = amount;
              txn.User_id = user._id;
              txn.Req_type = "withdraw";
              txn.Withdraw_type = type;
              txn.payment_gatway = payment_gatway;

              user.Wallet_balance -= amount;
              user.withdrawAmount -= amount;
              user.withdraw_holdbalance += amount;
              user.lastWitdrawl = Date.now();
              txn.closing_balance = user.Wallet_balance;

              const transfer = {
                beneId: user._id,
                transferId: txn._id,
                amount: amount,
                transferMode: type,
              };
              (async () => {
                const axios = require("axios").default;
                const options = {
                  method: "POST",
                  url: "https://in.decentro.tech/core_banking/money_transfer/initiate",
                  headers: {
                    client_id: "infiearn_psrod",
                    client_secret: "UE9eHgZJHJIPsYx5UIP5Bcax0MFLc84Qy",
                    module_secret: "EWjcNaVGsrJiAV0MfhnIhftj4D74t4TEv",
                    provider_secret: "ru87wL2sBYB8NEtSTtGvVLCGPy4jUVe2L",
                    "content-type": "application/json",
                  },
                  data: {
                    reference_id: txn._id,
                    purpose_message: "user withrawal request",
                    from_customer_id: "RKL00001",
                    to_customer_id: user._id.toString(),
                    from_account: "462511890518651665",
                    to_account: user.account_number.toString(),
                    mobile_number: user.Phone.toString(),
                    email_address: "test@mail.com",
                    name: user.holder_name.toString(),
                    transfer_type: "IMPS",
                    transfer_amount: amount.toString(),
                    beneficiary_details: {
                      email_address: "test01@company.com",
                      mobile_number: user.Phone.toString(),
                      address: "test address01",
                      ifsc_code: user.ifsc_code.toString(),
                      country_code: "IN",
                      payee_name: user.holder_name.toString(),
                    },
                    currency_code: "INR",
                  },
                };

                axios
                  .request(options)
                  .then(function (response) {
                    //console.log('admin auto payout response');
                    //console.log(response);
                    txn.client_ip = clientIp;
                    txn.client_forwarded_ip = clientForwardedIp;
                    txn.client_remote_ip = clientRemoteIp;

                    if (response.data.status === "success") {
                      txn.referenceId = response.data.decentroTxnId;
                      txn.status = response.data.status;

                      user.totalWithdrawl += txn.amount;
                      user.withdraw_holdbalance -= txn.amount;
                      user.save();
                      txn.save();

                      withdraw.closing_balance =
                        withdraw.closing_balance - withdraw.amount;
                      withdraw.status = "SUCCESS";
                      withdraw.save();

                      res.status(200).send({
                        message:
                          "Your withdrawal request successfully completed",
                        subCode: 200,
                      });
                    } else if (response.data.status === "pending") {
                      txn.referenceId = response.data.decentroTxnId;
                      txn.status = response.data.status;

                      txn.save();

                      withdraw.closing_balance =
                        withdraw.closing_balance - withdraw.amount;
                      withdraw.status = "SUCCESS";
                      withdraw.save();

                      res.status(200).send({
                        message: "Your withdrawal request in proccessing",
                        subCode: 200,
                      });
                    }
                  })
                  .catch(function (error) {
                    console.log(
                      "user auto payout response error",
                      error.request
                    );
                    console.error("line 2133", error.request);
                  });
              })();
              user.save();
              txn.save();
            } else {
              res.status(200).send({
                message: "Amount must be less than and equal to Wallet amount",
                subCode: 999,
              });
            }
          } else {
            res
              .status(200)
              .send({ message: "Technical error from bank", subCode: 999 });
          }
        } else {
          res.status(200).send({
            message:
              "You can't Withdrawal for 1.5 hour since the last withdrawal.",
            subCode: 999,
          });
        }
      } else {
        res
          .status(200)
          .send({ message: "You are enrolled in game.", subCode: 999 });
      }
    } else {
      res.status(200).send({
        message: "Withdrawal is failed please contact to admin.",
        subCode: 999,
      });
    }
  } catch (e) {
    console.log("xyz6", e);
    res.status(200).send({
      message:
        "Withdrawal is failed, Due to technical issue. Try after sometime.",
      subCode: 999,
    });
  }
});

//check payout through decentro status
router.post("/decentropayout/response", Auth, async (req, res) => {
  const orderID = req.body.txn_id;
  const referenceId = req.body.referenceId;
  const txn = await Transaction.findById(orderID);
  const user = await User.findById(txn.User_id);

  const withdraw = await Temp.findOne({ txn_id: txn._id });
  if (withdraw && withdraw.status == "Pending") {
    res.send(txn);
  } else {
    // && txn.status != "FAILED"
    if (
      txn._id == orderID &&
      txn.referenceId == referenceId &&
      txn.status != "SUCCESS"
    ) {
      //const axios = require('axios').default;
      const options = {
        method: "GET",
        url:
          "https://in.decentro.tech/core_banking/money_transfer/get_status?reference_id=" +
          orderID +
          "&decentro_txn_id=" +
          referenceId,
        headers: {
          client_id: "infiearn_psrod",
          client_secret: "UE9eHgZsJHJIPYx5UIP5Bcax0MFLc84Qy",
          module_secret: "EWjcNaVGsrJiAV0MfhnIhftj4D74t4TEv",
          provider_secret: "ru87wL2BsYB8NEtSTtGvVLCGPy4jUVe2L",
          "content-type": "application/json",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          //console.log(response);

          if (response.data.status === "success") {
            if (
              (response.data.originalTransactionResponse.status == "success" ||
                response.data.originalTransactionResponse.status ==
                  "pending") &&
              (response.data.beneficiaryName ||
                response.data.bankReferenceNumber)
            ) {
              txn.referenceId = response.data.decentroTxnId;
              txn.status = "SUCCESS";

              if (user.withdraw_holdbalance == txn.amount) {
                user.totalWithdrawl += txn.amount;
                user.withdraw_holdbalance -= txn.amount;
              }

              user.lastWitdrawl = Date.now();
              user.save();
              txn.save();
            } else if (
              response.data.originalTransactionResponse.status === "pending"
            ) {
              txn.txn_msg = "Transaction under proccessing!";
              txn.save();
            }
          } else if (response.data.status === "pending") {
            txn.txn_msg = "Transaction under proccessing!";
            txn.save();
          } else if (response.data.status === "failure") {
            txn.status = "FAILED";
            txn.txn_msg =
              "issuer bank or payment service provider declined the transaction";

            if (user.withdraw_holdbalance == txn.amount) {
              user.Wallet_balance += txn.amount;
              user.withdrawAmount += txn.amount;
              user.withdraw_holdbalance -= txn.amount;
            }
            user.lastWitdrawl = Date.now();
            user.save();
            txn.save();
          } else {
            txn.status = "FAILED";
            txn.txn_msg =
              "issuer bank or payment service provider declined the transaction";

            if (user.withdraw_holdbalance == txn.amount) {
              user.Wallet_balance += txn.amount;
              user.withdrawAmount += txn.amount;
              user.withdraw_holdbalance -= txn.amount;
            }
            user.lastWitdrawl = Date.now();
            user.save();
            txn.save();
          }

          res.send(txn);
        })
        .catch(function (error) {
          console.log("payout respond error");
          txn.status = "FAILED";
          txn.txn_msg =
            "issuer bank or payment service provider declined the transaction";

          if (user.withdraw_holdbalance == txn.amount) {
            user.Wallet_balance += txn.amount;
            user.withdrawAmount += txn.amount;
            user.withdraw_holdbalance -= txn.amount;
          }
          user.lastWitdrawl = Date.now();
          user.save();
          txn.save();
          res.send(txn);
          //console.error(error);
          //res.send(txn);
        });
    } else {
      // txn.status = 'FAILED';
      //         txn.txn_msg = "issuer bank or payment service provider declined the transaction";

      //         if(user.withdraw_holdbalance == txn.amount){
      //             user.Wallet_balance += txn.amount;
      //             user.withdrawAmount += txn.amount;
      //             user.withdraw_holdbalance -= txn.amount;
      //         }
      //         user.lastWitdrawl=Date.now();
      //         user.save();
      //         txn.save();
      //         res.send(txn);
      res.send(txn);
    }
  }
});

//razorpay check payouts
router.post("/razorpaypayoutscheck/response", Auth, async (req, res) => {
  const orderID = req.body.txn_id;
  const referenceId = req.body.referenceId;
  const txn = await Transaction.findById(orderID);
  const user = await User.findById(txn.User_id);
  //console.log(txn);
  const withdraw = await Temp.findOne({ txn_id: txn._id });
  if (withdraw && withdraw.status == "Pending") {
    res.send(txn);
  } else {
    //&& txn.status != "FAILED"
    if (
      txn._id == orderID &&
      txn.referenceId == referenceId &&
      txn.status != "SUCCESS"
    ) {
      try {
        const axios = require("axios").default;
        const options = {
          method: "GET",
          url: `https://rzp_live_*****8Zs0x:0XfdsTd1qxc42*****Yc9ss3@api.razorpay.com/v1/payouts/${referenceId}`,
        };
        axios
          .request(options)
          .then(function (response) {
            console.log("payout capture45", response);
            const payout_id = response.data.id;
            const payout_status = response.data.status;
            const txn_id = response.data.reference_id;

            if (payout_status == "processed") {
              if (txn.status != "SUCCESS" && txn.status != "FAILED") {
                txn.status = "SUCCESS";
                txn.txn_msg = "Withdraw Transaction is Successful";

                if (user.withdraw_holdbalance == txn.amount) {
                  user.totalWithdrawl += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                }
                user.lastWitdrawl = Date.now();
                user.save();
                txn.save();
                if (withdraw) {
                  withdraw.closing_balance =
                    withdraw.closing_balance - withdraw.amount;
                  withdraw.status = "SUCCESS";
                  withdraw.save();
                }
              }
              res.send(txn);
            } else if (payout_status == "reversed") {
              //console.log('razorpayoutrespo',txn);
              if (txn.status != "SUCCESS" && txn.status != "FAILED") {
                txn.status = "FAILED";
                txn.txn_msg = response.data.status_details.description;

                if (user.withdraw_holdbalance == txn.amount) {
                  user.Wallet_balance += txn.amount;
                  user.withdrawAmount += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                }
                user.lastWitdrawl = Date.now();
                user.save();
                txn.save();
                if (withdraw) {
                  withdraw.closing_balance =
                    withdraw.closing_balance + withdraw.amount;
                  withdraw.status = "FAILED";
                  withdraw.save();
                }
              }
              res.send(txn);
            } else if (payout_status == "failed") {
              //console.log('razorpayoutrespo',txn);
              if (txn.status != "SUCCESS" && txn.status != "FAILED") {
                txn.status = "FAILED";
                txn.txn_msg = "withdraw failed due to technical issue";

                if (user.withdraw_holdbalance == txn.amount) {
                  user.Wallet_balance += txn.amount;
                  user.withdrawAmount += txn.amount;
                  user.withdraw_holdbalance -= txn.amount;
                }
                user.lastWitdrawl = Date.now();
                user.save();
                txn.save();
                if (withdraw) {
                  withdraw.closing_balance =
                    withdraw.closing_balance + withdraw.amount;
                  withdraw.status = "FAILED";
                  withdraw.save();
                }
              }
              res.send(txn);
            } else {
              res.send(txn);
            }
          })
          .catch(function (error) {
            console.error("payout captur error1", error.message);
            res.send(txn);
          });
      } catch (err) {
        console.log("pay captur error2");
        res.send(txn);
      }
    } else {
      res.send(txn);
    }
  }
});

//payout withdrawAmount none/proccessing clear through api
router.post("/payout/response/api", async (req, res) => {
  const orderID = req.body.txn_id;
  const referenceId = req.body.referenceId;
  const txn = await Transaction.findById(orderID);
  const user = await User.findById(txn.User_id);

  // && txn.status != "FAILED"
  if (txn.status != "SUCCESS") {
    txn.status = "FAILED";
    txn.txn_msg =
      "issuer bank or payment service provider declined the transaction";

    if (user.withdraw_holdbalance == txn.amount) {
      user.Wallet_balance += txn.amount;
      user.withdrawAmount += txn.amount;
      user.withdraw_holdbalance -= txn.amount;
    }
    user.lastWitdrawl = Date.now();
    user.save();
    txn.save();
    res.send(txn);
  } else {
    res.send(txn);
  }
});

// mypay payment gateway
router.post("/mypay/payin", Auth, async (req, res) => {
  try {
    const txnold = await Transaction.findOne({
      Req_type: "deposit",
      payment_gatway: "MYPAY",
      User_id: req.user._id,
    });

    const user = await User.findById(req.user._id);

    // if(user.Email == null || user.Email == ""){
    //      res.send({ status:false, data: null, msg: 'Email not valid or not updated' });
    // }
    console.error(user.mypay_qrstring, "user.mypay_qrstring");
    if (!user.mypay_qrstring) {
      //   const txn = new Transaction({ amount: req.body.amount, User_id: req.user._id, Req_type: 'deposit', payment_gatway: "MYPAY", status: "Pending" });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://apiv1.mypay.zone/api/Auth/access-token",
        headers: {
          "X-MyPay-ClientId": "117875",
          "X-MyPay-ClientSecret": "6af13dfb-b958-4963-a6b1-ccc214f1397e",
          "X-MyPay-Endpoint-Ip": "68.178.163.210",
        },
      };

      var phoneNo = user.Phone.toString().slice(4);
      // var phoneNo = new Date().valueOf().toString().slice(3);
      //  console.error(phoneNo,'user.Name.toString()')

      var externalids = "MYPAY" + getUniqueID(12);
      // var externalids = txnold?user._id:txn._id
      axios
        .request(config)
        .then(async (response_token) => {
          console.log(response_token, "response_token");

          const options = {
            method: "POST",
            url: "https://apiv1.mypay.zone/api/v1/QrCode/generate",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              Authorization: "Bearer " + response_token.data.access_token,
            },
            data: {
              mobileNo: "9978" + phoneNo,
              name: user.Name.toString(),
              email: "abc@gmail.com",
              externalId: externalids,
            },
          };
          //   "name": user.Name.toString(),
          //   "email": user.Email.toString(),
          axios
            .request(options)
            .then(async function (response) {
              console.log("manual pay in response success");

              if (response.data.statusCode == "TXN") {
                user.mypay_qrstring = response.data.data.qrstring;
                user.mypay_refrenceId = externalids;
                await user.save();
                res.status(200).send(response.data);
              } else {
                console.error(response.data, "resp0");
                res.status(400).send({
                  status: false,
                  msg: response.data.data.status,
                  data: response.data.data,
                });
              }
            })
            .catch(function (error) {
              console.error(error.response, "response1", phoneNo);
              res.status(400).send({
                status: false,
                msg: "email or name is not valid",
                data: error,
              });
              // res.status(400).send({status:false, msg: error?.response.data?.status, data: error.response});
            });
        })
        .catch(function (error) {
          console.error(error, "resp2");
          res.status(400).send(error);
        });
    } else {
      res.status(200).send({
        statusCode: "TXN",
        status: "QR code already generated",
        data: {
          qrstring: user.mypay_qrstring,
        },
        timestamp: "2023-12-26- 19:39:08",
      });
    }
  } catch (error) {
    console.error(error, "mypay");
    res.status(400).send(error);
  }
});

router.post("/mypay-payout/g56", Auth, async (req, res) => {
  const { amount, type, userID, txnID, reqID } = req.body;

  try {
    var clientIp = req.headers["x-real-ip"];
    var clientForwardedIp = req.headers["x-forwarded-for"];
    var clientRemoteIp = req.headers["remote-host"];

    const user = await User.findById(userID);

    const payName = randomstring.generate({
      length: 5,
      charset: "alphabetic",
    });

    const mismatchValue =
      user.Wallet_balance -
      (user.wonAmount -
        user.loseAmount +
        user.totalDeposit +
        user.referral_earning +
        user.totalBonus -
        (user.totalWithdrawl +
          user.referral_wallet +
          user.withdraw_holdbalance +
          user.hold_balance +
          user.totalPenalty));

    if (mismatchValue != 0) {
      res.status(200).send({ message: "Mismatch Exist", subCode: 999 });
    } else if (user.hold_balance < 0) {
      return res.status(200).send({ message: "Balance on hold", subCode: 999 });
    } else {
      // else if(user.withdraw_holdbalance>0 && type=='upi')
      // {

      const txn = await Transaction.findOneAndUpdate(
        { _id: txnID, lock: false },
        { $set: { lock: true } },
        { returnOriginal: false }
      );
      if (!txn) {
        console.error("Not a valid transection or locked" + txnID);
        return res.status(400).json({
          status: false,
          msg: "Not a valid transection or locked",
          data: txnID,
        });
      }

      setTimeout(
        async (txnId) => {
          const running = await Transaction.findOneAndUpdate(
            { _id: txnID, lock: true },
            { $set: { lock: false } },
            { returnOriginal: false }
          );
        },
        10000,
        txnID
      );
      const withdraw = await Temp.findById(reqID);

      if (txn.status === "SUCCESS" || txn.status === "FAILED") {
        InProcessSubmit = false;
        res
          .status(200)
          .send({ message: "Payout Request already processed", subCode: 999 });
      } else {
        //   console.error('access_token')
        //                 let data = JSON.stringify({
        //   "account_number": user.account_number.toString(),
        //   "account_ifsc":  user.ifsc_code.toString(),
        //   "bankname": user.bankname.toString(),
        //   "confirm_acc_number": user.account_number.toString(),
        //   "requesttype": "IMPS",
        //   "beneficiary_name":  user.holder_name.toString(),
        //   "amount":amount.toString(),
        //   "narration": "rkadda transection"
        // });
        var refrenceId = "MYPAY" + getUniqueID();
        console.error(txn.Withdraw_type, "mypay");
        if (txn.Withdraw_type == "upi") {
          if (user.upi_id) {
            return res
              .status(200)
              .send({ status: false, message: "invalid upi", data: [] });
          } else {
            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: "https://apiv1.mypay.zone/api/Auth/access-token",
              headers: {
                "X-MyPay-ClientId": "117875",
                "X-MyPay-ClientSecret": "6af13dfb-b958-4963-a6b1-ccc214f1397e",
                "X-MyPay-Endpoint-Ip": "68.178.163.210",
              },
            };

            axios.request(config).then(async (response_token) => {
              // console.error(response_token.data.access_token,'access_token')

              let data1 = JSON.stringify({
                payer: "AKJ WEBTECH PRIVATE LIMITED",
                payerAccountNumber: "700007117875",
                // payeeAccountNumber: user.account_number.toString(),
                // payeeIfscCode: user.ifsc_code.toString(),
                payeeAccountNumber: user.upi_id,
                payeeName: payName,
                UserName: payName,
                mobileNo: user.Phone.toString(),
                remark: payName,
                amount: amount.toString(),
                paymentMode: "UPI",
                // email: user.Email,
                email: "help@staradda.in",
                externalId: refrenceId,
                Purpose: "Payout",
                latitude: "0.000000",
                longitude: "0.000000",
              });

              let config1 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://apiv1.mypay.zone/api/v1/Payout/domestic-payments",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + response_token.data.access_token,
                },
                data: data1,
              };

              axios
                .request(config1)
                .then(async (response) => {
                  //   console.error(response.data,'response.data')
                  if (response.data.statusCode == 400) {
                    return res.status(200).send({
                      message: response.data.errors[0],
                      data: response.data.errors,
                    });
                  } else if (response.data.statusCode == "ERR") {
                    const mypaysuccess = response.data.data;

                    txn.referenceId = mypaysuccess.externalId;
                    txn.status = "FAILED";
                    txn.action_by = req.user.id;

                    txn.client_ip = clientIp;
                    txn.client_forwarded_ip = clientForwardedIp;
                    txn.client_remote_ip = clientRemoteIp;

                    if (user.withdraw_holdbalance >= txn.amount) {
                      user.Wallet_balance += txn.amount;
                      user.withdrawAmount += txn.amount;
                      user.withdraw_holdbalance -= txn.amount;
                    }
                    user.save();
                    txn.save();

                    withdraw.closing_balance =
                      withdraw.closing_balance + withdraw.amount;
                    withdraw.status = "FAILED";
                    withdraw.save();

                    return res.status(200).send({
                      message: response.data.status,
                      data: response.data.data,
                    });
                  } else if (response.data.statusCode == "TXN") {
                    const mypaysuccess = response.data.data;
                    if (mypaysuccess.statusCode === "TXN") {
                      if (txn.status != "SUCCESS" || txn.status != "FAILED") {
                        if (mypaysuccess.status == "Success") {
                          const user = await User.findById(txn.User_id);
                          //   txn.upi_id = requestData.data.beneficiary_upi_handle;
                          txn.order_id = mypaysuccess.orderId;
                          txn.referenceId = mypaysuccess.externalId;
                          txn.action_by = req.user.id;
                          txn.payment_gatway = "MYPAY";
                          txn.txn_msg =
                            "issuer bank or payment service provider declined the transaction";
                          txn.status = "SUCCESS";
                          user.totalWithdrawl += txn.amount;
                          user.withdraw_holdbalance -= txn.amount;
                          user.lastWitdrawl = Date.now();
                          await user.save();
                          await txn.save();

                          withdraw.closing_balance =
                            withdraw.closing_balance - withdraw.amount;
                          withdraw.status = "SUCCESS";
                          withdraw.save();

                          return res.status(200).json({
                            status: "success",
                            message: "Payment Success",
                            data: response.data,
                          });
                        } else if (mypaysuccess.status == "Failed") {
                          txn.referenceId = mypaysuccess.externalId;
                          txn.status = "FAILED";
                          txn.action_by = req.user.id;

                          txn.client_ip = clientIp;
                          txn.client_forwarded_ip = clientForwardedIp;
                          txn.client_remote_ip = clientRemoteIp;

                          if (user.withdraw_holdbalance >= txn.amount) {
                            user.Wallet_balance += txn.amount;
                            user.withdrawAmount += txn.amount;
                            user.withdraw_holdbalance -= txn.amount;
                          }
                          user.save();
                          txn.save();

                          withdraw.closing_balance =
                            withdraw.closing_balance + withdraw.amount;
                          withdraw.status = "FAILED";
                          withdraw.save();

                          return response.data;
                        } else {
                          return response.data;
                        }
                      } else {
                        res.status(200).send({
                          message: "Your withdrawal request already completed",
                          data: response.data,
                        });
                      }
                    }
                  } else if (response.data.statusCode == "TUP") {
                    txn.referenceId = mypaysuccess.externalId;
                    txn.status = "forward";
                    txn.action_by = req.user.id;

                    txn.client_ip = clientIp;
                    txn.client_forwarded_ip = clientForwardedIp;
                    txn.client_remote_ip = clientRemoteIp;

                    withdraw.status = "forward";
                    withdraw.save();

                    txn.save();

                    return response.data;
                  }
                })
                .catch((error) => {
                  console.error(JSON.stringify(error.data), "abc");
                  res.status(200).send({
                    message: "bad request. check upi details",
                    data: error,
                  });
                });
            });
          }
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://apiv1.mypay.zone/api/Auth/access-token",
            headers: {
              "X-MyPay-ClientId": "117875",
              "X-MyPay-ClientSecret": "6af13dfb-b958-4963-a6b1-ccc214f1397e",
              "X-MyPay-Endpoint-Ip": "68.178.161.53",
            },
          };

          axios.request(config).then(async (response_token) => {
            // console.error(response_token.data.access_token,'access_token')

            let data1 = JSON.stringify({
              payer: "AKJ WEBTECH PRIVATE LIMITED",
              payerAccountNumber: "700007117875",
              payeeAccountNumber: user.account_number.toString(),
              payeeIfscCode: user.ifsc_code.toString(),
              payeeName: payName,
              UserName: payName,
              mobileNo: user.Phone.toString(),
              remark: payName,
              amount: amount.toString(),
              paymentMode: "IMPS",
              // email: user.Email,
              email: "help@staradda.in",
              externalId: refrenceId,
              Purpose: "Payout",
              latitude: "0.000000",
              longitude: "0.000000",
            });

            let config1 = {
              method: "post",
              maxBodyLength: Infinity,
              url: "https://apiv1.mypay.zone/api/v1/Payout/domestic-payments",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + response_token.data.access_token,
              },
              data: data1,
            };

            axios
              .request(config1)
              .then(async (response) => {
                //   console.error(JSON.stringify(response.data),'resp2');
                if (response.data.statusCode == 400) {
                  return res.status(200).send({
                    message: response.data.errors[0],
                    data: response.data.errors,
                  });
                } else if (response.data.statusCode == "ERR") {
                  const mypaysuccess = response.data.data;
                  txn.referenceId = mypaysuccess.externalId;
                  txn.status = "FAILED";
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  if (user.withdraw_holdbalance >= txn.amount) {
                    user.Wallet_balance += txn.amount;
                    user.withdrawAmount += txn.amount;
                    user.withdraw_holdbalance -= txn.amount;
                  }
                  user.save();
                  txn.save();

                  withdraw.closing_balance =
                    withdraw.closing_balance + withdraw.amount;
                  withdraw.status = "FAILED";
                  withdraw.save();

                  return res.status(200).send({
                    message: response.data.status,
                    data: response.data.data,
                  });
                } else if (response.data.statusCode == "TXN") {
                  const mypaysuccess = response.data.data;
                  if (mypaysuccess.statusCode === "TXN") {
                    if (txn.status != "SUCCESS" || txn.status != "FAILED") {
                      if (mypaysuccess.status == "Success") {
                        const user = await User.findById(txn.User_id);
                        //   txn.upi_id = requestData.data.beneficiary_upi_handle;
                        txn.order_id = mypaysuccess.orderId;
                        txn.referenceId = mypaysuccess.externalId;
                        txn.action_by = req.user.id;
                        txn.payment_gatway = "MYPAY";
                        txn.txn_msg =
                          "issuer bank or payment service provider declined the transaction";
                        txn.status = "SUCCESS";
                        user.totalWithdrawl += txn.amount;
                        user.withdraw_holdbalance -= txn.amount;
                        user.lastWitdrawl = Date.now();
                        await user.save();
                        await txn.save();

                        withdraw.closing_balance =
                          withdraw.closing_balance - withdraw.amount;
                        withdraw.status = "SUCCESS";
                        withdraw.save();

                        return res.status(200).json({
                          status: "success",
                          message: "Payment Success",
                          data: response.data,
                        });
                      } else if (mypaysuccess.status == "Failed") {
                        txn.referenceId = mypaysuccess.externalId;
                        txn.status = "FAILED";
                        txn.action_by = req.user.id;

                        txn.client_ip = clientIp;
                        txn.client_forwarded_ip = clientForwardedIp;
                        txn.client_remote_ip = clientRemoteIp;

                        if (user.withdraw_holdbalance >= txn.amount) {
                          user.Wallet_balance += txn.amount;
                          user.withdrawAmount += txn.amount;
                          user.withdraw_holdbalance -= txn.amount;
                        }
                        user.save();
                        txn.save();

                        withdraw.closing_balance =
                          withdraw.closing_balance + withdraw.amount;
                        withdraw.status = "FAILED";
                        withdraw.save();

                        return response.data;
                      } else {
                        return response.data;
                      }
                    } else {
                      res.status(200).send({
                        message: "Your withdrawal request already completed",
                        data: response.data,
                      });
                    }
                  }
                } else if (response.data.statusCode == "TUP") {
                  const mypaysuccess = response.data.data;
                  txn.referenceId = mypaysuccess.externalId;
                  txn.status = "forward";
                  txn.action_by = req.user.id;

                  txn.client_ip = clientIp;
                  txn.client_forwarded_ip = clientForwardedIp;
                  txn.client_remote_ip = clientRemoteIp;

                  withdraw.status = "forward";
                  withdraw.save();

                  txn.save();

                  return response.data;
                }
              })
              .catch((error) => {
                console.error(error, "abc");
                res.status(200).send({
                  message: "bad request. check account details",
                  data: error,
                });
              });
          });
        }
      }
    }
  } catch (e) {
    console.error(e, "abc");
    res.send(e);
  }
});

router.post("/mypay-payout-by-upiId", Auth, async (req, res) => {
  try {
    const { userID, txnID, reqID } = req.body;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const mismatchValue =
      user.Wallet_balance -
      (user.wonAmount -
        user.loseAmount +
        user.totalDeposit +
        user.referral_earning +
        user.totalBonus -
        (user.totalWithdrawl +
          user.referral_wallet +
          user.withdraw_holdbalance +
          user.hold_balance +
          user.totalPenalty));
    if (mismatchValue != 0) {
      res.status(200).send({ message: "Mismatch Exist", subCode: 999 });
    } else if (user.hold_balance < 0) {
      return res.status(200).send({ message: "Balance on hold", subCode: 999 });
    } else {
      // else if(user.withdraw_holdbalance>0 && type=='upi')
      // {

      const txn = await Transaction.findOneAndUpdate(
        { _id: txnID, lock: false },
        { $set: { lock: true } },
        { returnOriginal: false }
      );
      if (!txn) {
        console.error("Not a valid transection or locked" + txnID);
        return res.status(400).json({
          status: false,
          msg: "Not a valid transection or locked",
          data: txnID,
        });
      }

      setTimeout(
        async (txnId) => {
          const running = await Transaction.findOneAndUpdate(
            { _id: txnID, lock: true },
            { $set: { lock: false } },
            { returnOriginal: false }
          );
        },
        10000,
        txnID
      );
      const withdraw = await Temp.findById(reqID);
      if (txn.status === "SUCCESS" || txn.status === "FAILED") {
        InProcessSubmit = false;
        res.status(200).send({
          message: "Payout Request already processed",
          subCode: 999,
        });
      } else {
        if (txn.Withdraw_type == "upi") {
          if (!user.upi_id) {
            return res.status(200).send({
              status: false,
              message: "invalid upi",
              data: [],
            });
          } else {
            txn.order_id = null;
            txn.referenceId = null;
            txn.action_by = req.user.id;
            txn.payment_gatway = "UPI";
            txn.txn_msg =
              "issuer bank or payment service provider declined the transaction";
            txn.status = "SUCCESS";
            user.totalWithdrawl += txn.amount;
            user.withdraw_holdbalance -= txn.amount;
            user.lastWitdrawl = Date.now();
            await user.save();
            await txn.save();
            withdraw.closing_balance =
              withdraw.closing_balance - withdraw.amount;
            withdraw.status = "SUCCESS";
            withdraw.save();

            return res.status(200).json({
              status: "success",
              message: "Payment Success",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: error.message,
    });
  }
});

router.post("/callback_mypay_435", async (req, res) => {
  console.error(req.query, "callback_mypay_435");
  try {
    var requestData = req.query;
    if (requestData.ServiceType == "Collection") {
      const txnold = await Transaction.findOne({
        referenceId: requestData.TransactionBankRef,
      });
      const txn = new Transaction({
        amount: requestData.TransactionAmount,
        mypay_refrenceId: requestData.ExternalId,
        Req_type: "deposit",
        payment_gatway: "MYPAY",
        status: "Pending",
      });
      if (
        requestData.TransactionStatus == "Success" &&
        requestData.TransactionStatusCode == "TXN"
      ) {
        if (!txnold) {
          const user = await User.findOne({
            mypay_refrenceId: requestData.ExternalId,
          });
          console.error(user, "txntxn");
          //   txn.upi_id = requestData.data.beneficiary_upi_handle;
          txn.txn_msg = requestData.TransactionStatusMessage;
          txn.User_id = user._id;
          user.Wallet_balance =
            parseFloat(user.Wallet_balance) +
            parseFloat(requestData.TransactionAmount);
          user.totalDeposit =
            parseFloat(user.totalDeposit) +
            parseFloat(requestData.TransactionAmount);

          txn.status = "SUCCESS";

          txn.order_id = requestData.OrderId;
          txn.referenceId = requestData.TransactionBankRef;
          txn.payment_gatway = "MYPAY";

          await user.save();
          await txn.save();

          return res.status(200).json({
            status: "success",
            message: "data received",
          });
        } else {
          res.status(200).send({
            message: "already exist",
            status: false,
          });
        }
      } else if (requestData.TransactionStatus == "REFUND") {
        // txn.referenceId = response.data.payout_id;

        // txn.status = "FAILED";
        // txn.action_by = req.user.id;
        // txn.txn_msg =requestData.TransactionStatusMessage;
        //   txn.order_id = requestData.OrderId;
        //          txn.referenceId = requestData.ExternalId;
        //          txn.payment_gatway = "MYPAY";

        // if (user.withdraw_holdbalance >= txn.amount) {
        //   user.Wallet_balance += txn.amount;
        //   user.withdrawAmount += txn.amount;
        //   user.withdraw_holdbalance -= txn.amount;
        // }
        // user.save();
        // txn.save();

        // withdraw.closing_balance =
        //   withdraw.closing_balance + withdraw.amount;
        // withdraw.status = "FAILED";
        // withdraw.save();

        res.status(200).send({
          message: "Your withdrawal request failed",
          subCode: 200,
        });
      }
    } else if (requestData.ServiceType == "Payments") {
      if (requestData.TransactionStatus == "Success") {
        const txnId = requestData.MyPayTransactionId;
        const txn = await Transaction.findOneAndUpdate(
          { referenceId: txnId, lock: false },
          { $set: { lock: true } },
          { returnOriginal: false }
        );
        if (!txn) {
          return res.status(400).json({
            status: false,
            msg: "Not a valid transection or locked",
            data: txnId,
          });
        }

        setTimeout(
          async (txnId) => {
            const running = await Transaction.findOneAndUpdate(
              { referenceId: txnId, lock: true },
              { $set: { lock: false } },
              { returnOriginal: false }
            );
          },
          10000,
          txnId
        );
        const withdraw = await Temp.findOne({ txn_id: txn._id });
        if (txn.status != "SUCCESS") {
          const user = await User.findById(txn.User_id);
          //   txn.upi_id = requestData.data.beneficiary_upi_handle;
          txn.txn_msg = requestData.TransactionStatusMessage;
          txn.status = "SUCCESS";
          user.totalWithdrawl += txn.amount;
          user.withdraw_holdbalance -= txn.amount;
          user.lastWitdrawl = Date.now();

          txn.order_id = requestData.OrderId;
          txn.referenceId = requestData.TransactionBankRef;
          txn.payment_gatway = "MYPAY";

          await user.save();
          await txn.save();

          withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
          withdraw.status = "SUCCESS";
          withdraw.save();

          return res.status(200).json({
            status: "success",
            message: "data received",
          });
        } else {
          return res.status(401).json(requestData.data);
        }
      } else if (requestData.TransactionStatus == "REFUND") {
        // txn.referenceId = response.data.payout_id;

        txn.status = "FAILED";
        // txn.action_by = req.user.id;
        txn.txn_msg = requestData.TransactionStatusMessage;
        txn.order_id = requestData.OrderId;
        txn.referenceId = requestData.TransactionBankRef;
        txn.payment_gatway = "MYPAY";

        if (user.withdraw_holdbalance >= txn.amount) {
          user.Wallet_balance += txn.amount;
          user.withdrawAmount += txn.amount;
          user.withdraw_holdbalance -= txn.amount;
        }
        user.save();
        txn.save();

        withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
        withdraw.status = "FAILED";
        withdraw.save();

        res.status(200).send({
          message: "Your withdrawal request failed",
          subCode: 200,
        });
      }
    }
  } catch (e) {
    console.error(e, "error msg");
    res.status(400).send(e);
  }
});

router.get("/total/deposit", Auth, async (req, res) => {
  try {
    const data = await Transaction.find({
      $and: [{ Req_type: "deposit" }, { status: "SUCCESS" }],
    });

    let total = 0;

    data.forEach((item) => {
      total += item.amount;
    });

    res.status(200).send({ data: total });
    // console.log(ress);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

router.get("/total/withdraw", Auth, async (req, res) => {
  try {
    const data = await Transaction.find({
      $and: [{ Req_type: "deposit" }, { status: "withdraw" }],
    });
    let total = 0;

    data.forEach((item) => {
      total += item.amount;
    });

    res.status(200).send({ data: total });
    // console.log(ress);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

router.get("/withdrawlstatus/:id", Auth, async (req, res) => {
  try {
    Payouts.Init(config.Payouts);

    const withdraw = await Temp.findById(req.params.id);
    const txn = await Transaction.findById(withdraw.txn_id);
    const user = await User.findById(txn.User_id);
    const response = await Transfers.GetTransferStatus({
      transferId: txn._id,
    });
    if (response.status == "ERROR" && response.subCode == "404") {
      if (txn.status === "FAILED") {
        withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
        withdraw.status = "FAILED";
        withdraw.save();
      } else if (txn.status === "SUCCESS") {
        withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
        withdraw.status = "SUCCESS";
        withdraw.save();
      }
      res.send({ message: response.message });
    } else {
      console.log(txn, "status");
      if (response.status === "ERROR" && response.subCode === "403") {
        //console.log(txn.status)
        if (txn.status === "FAILED") {
          withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
          withdraw.status = "FAILED";
          withdraw.save();
        } else {
          withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
          withdraw.status = "SUCCESS";
          withdraw.save();
        }
      }
      if (response.data.transfer.status === "SUCCESS") {
        if (txn.status != "SUCCESS") {
          txn.referenceId = response.data.transfer.referenceId;
          txn.status = response.data.transfer.status;

          if (user.withdraw_holdbalance >= txn.amount) {
            user.withdraw_holdbalance -= txn.amount;
          }
          user.totalWithdrawl += txn.amount;
          await user.save();
          await txn.save();
          withdraw.status = response.data.transfer.status;
          withdraw.save();
        } else {
          if (txn.status === "FAILED") {
            withdraw.status = "FAILED";
            withdraw.save();
          } else {
            withdraw.status = "SUCCESS";
            withdraw.save();
          }
        }
      } else if (response.data.transfer.status === "FAILED") {
        if (txn.status != "FAILED") {
          txn.referenceId = response.data.transfer.referenceId;
          txn.status = response.data.transfer.status;
          user.Wallet_balance += txn.amount;
          user.withdrawAmount += txn.amount;
          if (user.withdraw_holdbalance >= txn.amount) {
            user.withdraw_holdbalance -= txn.amount;
          }
          await user.save();
          await txn.save();
          withdraw.status = "FAILED";
          withdraw.save();
        } else {
          if (txn.status === "FAILED") {
            withdraw.status = "FAILED";
            withdraw.save();
          } else {
            withdraw.status = "SUCCESS";
            withdraw.save();
          }
        }
      } else {
        if (txn.status === "FAILED") {
          withdraw.status = "FAILED";
          withdraw.save();
        } else {
          withdraw.status = "SUCCESS";
          withdraw.save();
        }
      }
      res.send({ message: response.data.transfer.status });
    }
  } catch (err) {
    console.log("err caught in getting transfer status");
    console.log(err);
    return;
  }
});

router.get("/withdrawreject/:id", async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    const user = await User.findById(txn.User_id);

    console.log("reject done1", user);

    if (user.withdraw_holdbalance > 0) {
      //const txn=await Transaction.findById(User_id);
      console.log("reject done2", txn.amount);
      user.Wallet_balance += txn.amount;
      user.withdrawAmount += txn.amount;
      user.withdraw_holdbalance -= txn.amount;
      //user.lastWitdrawl=null;
      user.lastWitdrawl = Date.now();
      //withdraw.closing_balance = withdraw.closing_balance + withdraw.amount;
      //withdraw.status = 'reject';

      txn.status = "FAILED";
      txn.txn_msg = "Withdraw rejected";
      txn.closing_balance = txn.closing_balance + txn.amount;
      console.log(
        "reject done3",
        txn.closing_balance,
        user.withdraw_holdbalance,
        user.withdrawAmount,
        user.Wallet_balance
      );
      //withdraw.save();
      user.save();
      txn.save();
      res.status(200).send(txn);
    } else {
      res.send({ message: "Invalid request", error: true });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/webhook-payouts-cashfree", async (req, res) => {
  if (req.body.type == "PAYMENT_SUCCESS_WEBHOOK") {
    const orderID = req.body.data.order.order_id;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id);
    if (txn.status != "SUCCESS") {
      const user = await User.findById(txn.User_id);
      txn.status = "PAID";
      txn.payment_gatway = "cashfree";
      txn.txn_msg = "Transaction is Successful";
      txn.referenceId = req.body.data.payment.bank_reference;
      user.Wallet_balance += txn.amount;

      user.totalDeposit += txn.amount;
      txn.closing_balance = user.Wallet_balance;
      await user.save();
      await txn.save();
    }

    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.type == "PAYMENT_FAILED_WEBHOOK") {
    const orderID1 = req.body.data.order.order_id;
    const txn1 = await Transaction.findById(orderID1);
    //  const user1 = await User.findById(txn1.User_id)
    if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
      txn1.status = "FAILED";
      txn1.payment_gatway = "cashfree";
      txn1.txn_msg = req.body.reason;
      txn1.referenceId = req.body.data.payment.bank_reference;

      await txn1.save();
    }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.type == "PAYMENT_USER_DROPPED_WEBHOOK") {
    const orderID1 = req.body.data.order.order_id;
    const txn1 = await Transaction.findById(orderID1);
    const user1 = await User.findById(txn1.User_id);
    if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
      txn1.status = "FAILED";
      txn1.payment_gatway = "cashfree";
      //txn.txn_msg = req.body.reason;
      txn1.referenceId = req.body.data.payment.bank_reference;
      user1.Wallet_balance += txn1.amount;
      user1.withdrawAmount += txn1.amount;
      user1.withdraw_holdbalance -= txn1.amount;
      await user1.save();
      await txn1.save();
    }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else {
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  }
});
router.post("/webhook-payouts-cashfree-payment", async (req, res) => {
  console.log("sdfgwsdfg webhook", req.body);
  if (req.body.type == "TRANSFER_SUCCESS") {
    console.log("webhook 123");
    const orderID = req.body.transferId;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id);
    if (txn.status != "SUCCESS") {
      console.log("webhook 124");
      const user = await User.findById(txn.User_id);
      txn.status = "PAID";
      txn.Req_type = "withdraw";
      txn.Withdraw_type = "bank transfer";
      txn.payment_gatway = "cashfree";
      txn.txn_msg = "Withdraw Transaction is Successful";
      txn.referenceId = req.body.referenceId;
      user.Wallet_balance += txn.amount;
      if (user.withdraw_holdbalance - txn.amount > 0) {
        user.withdraw_holdbalance -= txn.amount;
      } else {
        user.withdraw_holdbalance = 0;
      }

      user.totalDeposit += txn.amount;
      txn.closing_balance = user.Wallet_balance;
      await user.save();
      await txn.save();
    }
    console.log("webhook 125");

    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.type == "TRANSFER_FAILED") {
    console.log("webhook 126");
    const orderID1 = req.body.data.order.order_id;
    const txn1 = await Transaction.findById(orderID1);
    //  const user1 = await User.findById(txn1.User_id)
    if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
      console.log("webhook 127");
      txn1.status = "FAILED";
      txn.Req_type = "withdraw";
      txn.Withdraw_type = "bank transfer";
      txn1.payment_gatway = "cashfree";
      txn.txn_msg = req.body.reason;
      txn.referenceId = req.body.referenceId;
      user1.Wallet_balance += txn1.amount;
      user1.withdrawAmount += txn1.amount;
      user1.withdraw_holdbalance -= txn1.amount;
      await user1.save();
      await txn1.save();
    }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.type == "TRANSFER_REJECTED") {
    console.log("webhook 126");
    const orderID1 = req.body.data.order.order_id;
    const txn1 = await Transaction.findById(orderID1);
    //  const user1 = await User.findById(txn1.User_id)
    if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
      console.log("webhook 127");
      txn1.status = "FAILED";
      txn.Req_type = "withdraw";
      txn.Withdraw_type = "bank transfer";
      txn1.payment_gatway = "cashfree";
      txn.txn_msg = req.body.reason;
      txn.referenceId = req.body.referenceId;
      user1.Wallet_balance += txn1.amount;
      user1.withdrawAmount += txn1.amount;
      user1.withdraw_holdbalance -= txn1.amount;
      await user1.save();
      await txn1.save();
    }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else {
    console.log("webhook 128");
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  }
});

//webhook-payout and deposit -decentro
router.post("/webhook-payouts-decentro", async (req, res) => {
  if (
    req.headers.appid === "infiearnapp001" &&
    req.headers.apifor === "transactionsts"
  ) {
    // console.log("decentro webhook",req.body)

    if (req.body.transactionStatus == "success") {
      const orderID = req.body.referenceId;
      const txn = await Transaction.findById(orderID);
      const user = await User.findById(txn.User_id);

      if (
        txn.status != "SUCCESS" &&
        txn.status != "FAILED" &&
        txn.Req_type == "withdraw"
      ) {
        const user = await User.findById(txn.User_id);
        txn.status = "SUCCESS";
        txn.txn_msg = "Transaction is Successful";
        txn.referenceId = req.body.decentroTxnId;
        user.totalWithdrawl += txn.amount;
        user.withdraw_holdbalance -= txn.amount;
        user.lastWitdrawl = Date.now();
        await user.save();
        await txn.save();
      } else if (
        txn.status != "PAID" &&
        txn.status != "FAILED" &&
        txn.Req_type == "deposit"
      ) {
        txn.status = "PAID";
        const user = await User.findById(txn.User_id);
        user.Wallet_balance += txn.amount;
        user.totalDeposit += txn.amount;
        user.lastWitdrawl = Date.now();
        await user.save();

        txn.closing_balance = user.Wallet_balance;
        txn.txn_msg = "Deposit Transaction is Successfully completed";

        await txn.save();
      }

      res.status(200).json({
        status: "ok",
        message: "Successful Callback",
        responsecode: "200",
        data: null,
      });
    } else if (req.body.transactionStatus == "failure") {
      const orderID1 = req.body.referenceId;
      const txn1 = await Transaction.findById(orderID1);
      const user1 = await User.findById(txn1.User_id);

      if (
        txn1.status != "SUCCESS" &&
        txn1.status != "FAILED" &&
        txn1.Req_type == "withdraw"
      ) {
        txn1.status = "FAILED";
        txn1.txn_msg = "Transaction failed from bank";
        txn1.referenceId = req.body.decentroTxnId;

        user1.Wallet_balance += txn1.amount;
        user1.withdrawAmount += txn1.amount;
        user1.withdraw_holdbalance -= txn1.amount;
        user1.lastWitdrawl = Date.now();

        await user1.save();
        await txn1.save();
      } else if (
        txn1.status != "PAID" &&
        txn1.status != "FAILED" &&
        txn1.Req_type == "deposit"
      ) {
        txn1.status = "FAILED";
        txn1.txn_msg = "Transaction failed";
        await txn1.save();
      }

      res.status(200).json({
        status: "ok",
        message: "Successful Callback",
        responsecode: "200",
        data: null,
      });
    } else {
      res.status(400).json({
        status: "ok",
        message: "Failed Callback",
        responsecode: "400",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      status: "ok",
      message: "Unauthorized Callback",
      responsecode: "400",
      data: null,
    });
  }
});

//user withdraw success update by admin side
router.post("/userwithdrawupdate/:id", Auth, async (req, res) => {
  if (req.body.status == "SUCCESS") {
    const orderID = req.params.id;
    const txn = await Transaction.findById(orderID);
    console.log(txn, "txntxntxn");
    const user = await User.findById(txn.User_id);
    if (txn.status != "SUCCESS" && txn.status != "FAILED") {
      const withdraw = await Temp.findOne({ txn_id: txn._id });
      const user = await User.findById(txn.User_id);
      txn.status = "SUCCESS";
      txn.txn_msg = "Transaction is Successful";
      txn.action_by = req.user.id; //Added By team
      txn.referenceId = req.body.referenceId;
      user.totalWithdrawl += txn.amount;
      if (user.withdraw_holdbalance >= txn.amount) {
        user.withdraw_holdbalance -= txn.amount;
      }
      user.lastWitdrawl = Date.now();
      await user.save();
      await txn.save();
      if (withdraw) {
        withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
        withdraw.status = "SUCCESS";
        await withdraw.save();
      }
    }

    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.status == "FAILED") {
    const orderID1 = req.params.id;
    const txn1 = await Transaction.findById(orderID1);

    console.log(orderID1, txn1, "txntxntxn");
    const user1 = await User.findById(txn1.User_id);
    if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
      const withdraw = await Temp.findOne({ txn_id: txn1._id });
      txn1.status = "FAILED";
      txn1.txn_msg =
        "issuer bank or payment service provider declined the transaction";
      txn1.referenceId = req.body.referenceId;

      if (user1.withdraw_holdbalance >= txn1.amount) {
        user1.Wallet_balance += txn1.amount;
        user1.withdrawAmount += txn1.amount;
        user1.withdraw_holdbalance -= txn1.amount;
      }
      await user1.save();
      await txn1.save();
      console.log(withdraw, "withdraw");
      if (withdraw) {
        withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
        withdraw.status = "FAILED";
        await withdraw.save();
      }
    }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else {
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  }
});

//user deposit success update by admin side
router.post("/userdipositupdate/:id", Auth, async (req, res) => {
  if (req.body.status == "SUCCESS") {
    const orderID = req.params.id;
    const txn = await Transaction.findById(orderID);
    const user = await User.findById(txn.User_id);
    if (txn.status != "PAID" && txn.status != "FAILED") {
      txn.status = "PAID";
      txn.txn_msg = "Deposit Transaction is Successful";
      user.Wallet_balance += txn.amount;
      user.totalDeposit += txn.amount;

      txn.closing_balance = user.Wallet_balance;

      await user.save();
      await txn.save();
    }

    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else if (req.body.status == "FAILED") {
    const orderID1 = req.params.id;
    const txn1 = await Transaction.findById(orderID1);
    const user1 = await User.findById(txn1.User_id);
    // if (txn1.status != "PAID" && txn1.status != "FAILED") {
    txn1.status = "FAILED";
    txn1.txn_msg =
      "issuer bank or payment service provider declined the transaction";

    await user1.save();
    await txn1.save();
    // }
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  } else {
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  }
});

//webhook-payouts-razorpay
router.post("/webhook-payouts-razorpay", async (req, res) => {
  //console.log("razorpay webhook payload",req.body.payload);
  //console.log("razorpay webhook payoutentity",req.body.payload.payout.entity);
  if (
    req.body.payload &&
    req.body.payload.payout &&
    req.body.payload.payout.entity
  ) {
    const payout_id = req.body.payload.payout.entity.id;
    const payout_status = req.body.payload.payout.entity.status;
    const txn_id = req.body.payload.payout.entity.reference_id;

    const txn = await Transaction.findById(txn_id);
    if (!txn) {
      const axios = require("axios");

      // define your API endpoint
      const endpoint =
        "https://rksuperadmin.rkludso.com/razorpay-payout-webhook";

      // define the data to be sent in the response
      const response = req.body;

      // send the response using Axios
      axios.post(endpoint, response).then((res) => {
        console.log(
          `Response sent successfully with status code ${res.status}`
        );
      });
    }
    //console.log('razorpayoutrespo',payout_status);
    if (payout_status == "processed") {
      const orderID = txn_id;
      const txn = await Transaction.findById(orderID);

      if (txn.status != "SUCCESS" && txn.status != "FAILED") {
        const withdraw = await Temp.findOne({ txn_id: txn._id });

        const user = await User.findById(txn.User_id);
        txn.status = "SUCCESS";
        txn.txn_msg = "Withdraw Transaction is Successful";
        txn.referenceId = payout_id;

        if (user.withdraw_holdbalance == txn.amount) {
          user.totalWithdrawl += txn.amount;
          user.withdraw_holdbalance -= txn.amount;
        }

        await user.save();
        await txn.save();
        if (withdraw) {
          withdraw.closing_balance = withdraw.closing_balance - withdraw.amount;
          withdraw.status = "SUCCESS";
          await withdraw.save();
        }

        // Notification
        const other = [];
        const userinfo = [];
        userinfo.push(user);
        other["type"] = "withdraw";
        const notification_type = "firebase";
        const title = "Withdraw Success";
        const body =
          "Congratulations!👍 Your withdrawal request for amount " +
          txn.amount +
          " has been processed successfully. The funds will be transferred to your account shortly.🤑🤑";
        const send_to = "users";
        const msg_type = "withdraw";
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
      }

      res.status(200).json({
        status: "ok",
        message: "response",
        responsecode: "200",
        data: null,
      });
    } else if (payout_status == "reversed") {
      const orderID1 = txn_id;
      const txn1 = await Transaction.findById(orderID1);

      const user1 = await User.findById(txn1.User_id);

      const withdraw1 = await Temp.findOne({ txn_id: txn1._id });

      if (txn1.status != "SUCCESS" && txn1.status != "FAILED") {
        txn1.status = "FAILED";
        txn1.txn_msg =
          req.body.payload.payout.entity.status_details.description;
        txn1.referenceId = payout_id;

        if (user1.withdraw_holdbalance == txn1.amount) {
          user1.Wallet_balance += txn1.amount;
          user1.withdrawAmount += txn1.amount;
          user1.withdraw_holdbalance -= txn1.amount;
        }

        await user1.save();
        await txn1.save();
        if (withdraw1) {
          withdraw1.closing_balance =
            withdraw1.closing_balance + withdraw1.amount;
          withdraw1.status = "FAILED";
          await withdraw1.save();
        }
        // Notification
        const other1 = [];
        const userinfo1 = [];
        userinfo1.push(user1);
        other1["type"] = "withdraw";
        const notification_type1 = "firebase";
        const title1 = "Withdraw Status of " + txn1.amount + " INR";
        const body1 = req.body.payload.payout.entity.status_details.description;
        const send_to1 = "users";
        const msg_type1 = "withdraw";
        const sendto_array1 = userinfo;

        saveNotification(
          notification_type1,
          title1,
          body1,
          send_to1,
          msg_type1,
          sendto_array1,
          other1
        );
      }
      // Notification

      res.status(200).json({
        status: "ok",
        message: "response",
        responsecode: "200",
        data: null,
      });
    } else {
      res.status(200).json({
        status: "ok",
        message: "response",
        responsecode: "200",
        data: null,
      });
    }
  } else {
    res.status(200).json({
      status: "ok",
      message: "response",
      responsecode: "200",
      data: null,
    });
  }
});

router.get("/phonpay-request", Auth, async (req, res) => {
  const txn = new Transaction({
    amount: req.query.amount,
    User_id: req.user._id,
    Req_type: "deposit",
    client_remote_ip: req.socket.remoteAddress.toString(),
    client_forwarded_ip: req.headers["x-forwarded-for"].toString(),
  });
  //   console.log(req.socket.remoteAddress,req.headers['x-forwarded-for'],'ip')
  const requestData = {};
  requestData.merchantId = "M22HYILF8TPRH";
  const txnId = "PP" + getUniqueID();
  requestData.merchantTransactionId = txnId;
  requestData.merchantUserId = "MUID125";
  requestData.amount = req.query.amount * 100;
  requestData.redirectUrl = "https://staradda.in/pay-status?txnId=" + txnId;
  requestData.redirectMode = "GET";
  requestData.callbackUrl =
    "https://backend.staradda.in/phonpay-request-callback";
  requestData.mobileNumber = req.user.Phone;
  requestData.paymentInstrument = { type: "PAY_PAGE" };
  const base64Data = Buffer.from(JSON.stringify(requestData)).toString(
    "base64"
  );
  //  console.error(req.query.amount,'req.body')
  let shaGenerated = "";
  var sha256 = new jsSHA("SHA-256", "TEXT");
  sha256.update(base64Data + "/pg/v1/pay4bde3eac-1178-40c1-a215-5121599021aa");
  var hash = sha256.getHash("HEX");

  const verifyToken = hash + "###1";

  const axios = require("axios");
  let data = JSON.stringify({
    request: base64Data,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": verifyToken,
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      const txn = new Transaction({
        amount: req.query.amount,
        User_id: req.user._id,
        Req_type: "deposit",
      });
      txn.status = "Pending";
      txn.payment_gatway = "phonepe";

      txn.order_id = txnId;
      await txn.save();
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error, "error phonepe");
      txn.save();
      res.status(400).json({ status: false, msg: error.data, data: null });
    });
});
router.get("/phonpay-request-status", async (req, res) => {
  const txn = await Transaction.findOneAndUpdate(
    { order_id: req.query.txnId, lock: false },
    { $set: { lock: true } },
    { returnOriginal: false }
  );

  if (!txn) {
    //   console.error('Not a valid transection or locked'+req.query.txnId)
    return res.status(400).json({
      status: false,
      msg: "Not a valid transection or locked",
      data: req.query.txnId,
    });
  }

  setTimeout(
    async (txnId) => {
      const running = await Transaction.findOneAndUpdate(
        { order_id: req.query.txnId, lock: true },
        { $set: { lock: false } },
        { returnOriginal: false }
      );
    },
    10000,
    req.query.txnId
  );

  //       if(await checkAndInsertData(txn.User_id.toString())){
  //      console.error('mismatch -Another request in process. - please try again.')
  //     return res.status(200).send({status:false,msg:'mismatch - Another request in process. - please try again.'})
  // }

  const axios = require("axios");
  let data = "";

  let shaGenerated = "";
  var sha256 = new jsSHA("SHA-256", "TEXT");
  sha256.update(
    "/pg/v1/status/M22HYILF8TPRH/" +
      req.query.txnId +
      "4bde3eac-1178-40c1-a215-5121599021aa"
  );
  var hash = sha256.getHash("HEX");

  const verifyToken = hash + "###1";

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://api.phonepe.com/apis/hermes/pg/v1/status/M22HYILF8TPRH/" +
      req.query.txnId,
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": verifyToken,
      "X-MERCHANT-ID": "M22HYILF8TPRH",
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      if (response.data.success == false) {
        txn.status = response.data.data.state;
        txn.payment_gatway = "phonepe";
        txn.txn_msg = response.data.message;

        txn.lock = false;
        await txn.save();

        return res.status(200).json(response.data);
      } else {
        if (response.data.code == "PAYMENT_ERROR") {
          txn.status = response.data.data.state;
          txn.payment_gatway = "phonepe";
          txn.txn_msg = response.data.message;

          txn.lock = false;
          await txn.save();

          return res.status(200).json(response.data);
        } else if (response.data.code == "PAYMENT_PENDING") {
          txn.status = response.data.data.state;
          txn.payment_gatway = "phonepe";
          txn.txn_msg = response.data.message;

          txn.lock = false;
          await txn.save();

          return res.status(200).json(response.data);
        } else if (response.data.code == "PAYMENT_SUCCESS") {
          // txn.status != success
          if (txn.status != "PAID") {
            txn.status = "PAID";
            txn.payment_gatway = "phonepe";
            txn.txn_msg = response.data.message;
            const user = await User.findById(txn.User_id);

            var addActivity3 = new activity({
              User_id: txn.User_id,
              Req_type: "transection",
              txn_msg:
                "phonepe order_id: " +
                txn.order_id +
                ", txn amount: " +
                txn.amount +
                ", current balance: " +
                user.Wallet_balance +
                ", total deposit" +
                user.totalDeposit +
                ", hold_balance: " +
                user.hold_balance +
                " ",
              actionBy: "656d7ae7bfa73b0a2e8581d0",
              ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
              createdAt: currdate(),
            });
            await addActivity3.save();

            user.Wallet_balance += txn.amount;
            user.totalDeposit += txn.amount;
            await user.save();
            txn.closing_balance = user.Wallet_balance;
            txn.lock = false;
            await txn.save();

            let globalData = await Global_t_data.findOne({
              createdAt: { $gte: todayDate() },
            });
            if (globalData) {
              globalData.totaldeposit += 1;
              globalData.totaldepositamount += txn.amount;

              await globalData.save();
            } else {
              const globalData1 = new Global_t_data({
                totaldeposit: 1,
                totaldepositamount: txn.amount,
              });
              await globalData1.save();
            }

            let user_t_data = await User_t_data.findOne({
              User_id: user._id,
              createdAt: { $gte: todayDate() },
            });

            if (user_t_data) {
              user_t_data.totaldeposit += 1;
              user_t_data.totaldepositamount += txn.amount;
              await user_t_data.save();
            } else {
              let userData = new User_t_data({
                User_id: user._id,
                global_t_data_id: globalData._id,
                totaldeposit: 1,
                totaldepositamount: txn.amount,
              });
              await userData.save();
            }

            return res.status(200).json(response.data);
          } else {
            // console.log('return blank')
            return res.status(200).json(response.data);
          }
        } else {
          return res.status(200).json(response.data);
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: false, msg: error.data, data: null });
    });
});
router.post("/phonpay-request-callback", async (req, res) => {
  try {
    var b64string = req.body.response;
    var buf = JSON.parse(Buffer.from(b64string, "base64").toString("utf-8")); // Ta-da

    const txnId = buf.data.merchantTransactionId;
    const txn = await Transaction.findOneAndUpdate(
      { order_id: txnId, lock: false },
      { $set: { lock: true } },
      { returnOriginal: false }
    );
    if (!txn) {
      return res.status(400).json({
        status: false,
        msg: "Not a valid transection or locked",
        data: txnId,
      });
    }

    setTimeout(
      async (txnId) => {
        const running = await Transaction.findOneAndUpdate(
          { order_id: txnId, lock: true },
          { $set: { lock: false } },
          { returnOriginal: false }
        );
      },
      100000,
      txnId
    );
    //                 if(await checkAndInsertData(running.User_id.toString())){
    //      console.error('mismatch -Another request in process. - please try again.')
    //     return res.status(200).send({status:false,msg:'mismatch - Another request in process. - please try again.'})
    // }

    if (buf.success && buf.code === "PAYMENT_SUCCESS") {
      if (txn.status != "PAID") {
        txn.status = "PAID";
        txn.payment_gatway = "phonepe";
        txn.txn_msg = buf.message;
        const user = await User.findById(txn.User_id);

        user.Wallet_balance += txn.amount;
        user.totalDeposit += txn.amount;

        txn.closing_balance = user.Wallet_balance;
        txn.lock = false;
        await txn.save();
        await user.save();
        var addActivity3 = new activity({
          User_id: txn.User_id,
          Req_type: "transection",
          txn_msg:
            "order_id: " +
            txn.order_id +
            ", txn amount: " +
            txn.amount +
            ", current balance: " +
            user.Wallet_balance +
            ", total deposit" +
            user.totalDeposit +
            ", hold_balance: " +
            user.hold_balance +
            ", totalWithdrawl: " +
            user.totalWithdrawl +
            ", win amount: " +
            user.wonAmount +
            ", loseAmount: " +
            user.loseAmount +
            ", referral_earning: " +
            user.referral_earning +
            " ",
          actionBy: "656d7ae7bfa73b0a2e8581d0",
          ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          createdAt: currdate(),
        });
        await addActivity3.save();

        let globalData = await Global_t_data.findOne({
          createdAt: { $gte: todayDate() },
        });
        if (globalData) {
          globalData.totaldeposit += 1;
          globalData.totaldepositamount += txn.amount;

          await globalData.save();
        } else {
          const globalData1 = new Global_t_data({
            totaldeposit: 1,
            totaldepositamount: txn.amount,
          });
          await globalData1.save();
        }

        let user_t_data = await User_t_data.findOne({
          User_id: user._id,
          createdAt: { $gte: todayDate() },
        });

        if (user_t_data) {
          user_t_data.totaldeposit += 1;
          user_t_data.totaldepositamount += txn.amount;
          await user_t_data.save();
        } else {
          let userData = new User_t_data({
            User_id: user._id,
            global_t_data_id: globalData._id,
            totaldeposit: 1,
            totaldepositamount: txn.amount,
          });
          await userData.save();
        }

        return res.status(200).json(buf);
      } else {
        return res.status(200).json(buf);
      }
    } else if (buf.code === "PAYMENT_ERROR") {
      txn.status = "FAILED";
      txn.payment_gatway = "phonepe";
      txn.txn_msg = buf.message;

      txn.lock = false;
      await txn.save();

      return res.status(200).json(buf);
    } else {
      return res.status(200).json(buf);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

function getUniqueID() {
  const timestamp = new Date().getTime();
  const randomId = generateRandomId(6); // Adjust the length of the random ID as needed

  const transactionId = `${timestamp}-${randomId}`;
  return transactionId.substring(0, 38);
}

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

function genratecashfreetoken() {
  var axios = require("axios");

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://payout-gamma.cashfree.com/payout/v1/authorize",
    headers: {
      "X-Client-Id": "CF169455CFMQC1R1IPNFPL1ADG***",
      "X-Client-Secret": "c836886644650fd9e8ffb05dd9a42e9ed9****a",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data.data.token;
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = router;
