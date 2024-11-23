const router = require("express").Router();
const Auth = require("../Middleware/Auth");
const uploadOnCloudinary = require("../Middleware/cloudinary");
const upload = require("../Middleware/multer");
const User = require("../Model/User");
const Transaction = require("../Model/transaction");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/paymentImage");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 100000000000,
//   },
// });
router.post(
  "/manual/deposit/utr",
  Auth,
  upload.single("paymentImage"),
  async (req, res) => {
    try {
      const {
        upi,
        User_id,
        amount,
        payment_gatway,
        status,
        Req_type,
        order_token,
      } = req.body;

      if (
        !upi ||
        !User_id ||
        !amount ||
        !payment_gatway ||
        !status ||
        !Req_type
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const paymentPic = req.file ? req.file.path.replace(/\\/g, "/") : null;
      const findUTR = await Transaction.findOne({ order_token });
      if (findUTR) {
        return res.status(400).json({ message: "Invalid order token" });
      }
      // Create a new transaction
      const txn = new Transaction({
        upi,
        User_id: User_id,
        amount,
        payment_gatway,
        status,
        Req_type,
        order_token,
        paymentImage: paymentPic,
      });

      // Save the transaction to the database
      await txn.save();
      const io = req.app.get("socketio");
      io.emit("updateAdminManualDeposit", "data");
      // Return the created transaction
      res.status(200).json({ data: txn, message: "Request Send Successfully" });
    } catch (error) {
      if (error?.code == 11000) {
        return res.status(400).json({ message: "Duplicate UTR Number" });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
router.get("/get/manual/deposit/utr", async (req, res) => {
  const { _stype, _q, _status, name, phone } = req.query;

  let queryConditions = [{ Req_type: "deposit" }, { status: "pending" }];

  if (_stype === "order_token" && _q) {
    queryConditions.push({ [_stype]: _q });
  }

  if (_status) {
    queryConditions.push({ status: _status });
  }

  try {
    let txnData = await Transaction.aggregate([
      {
        $match: {
          $and: queryConditions,
        },
      },
      {
        $lookup: {
          from: "users", // The collection to join with
          localField: "User_id", // Field from the Transaction collection
          foreignField: "_id", // Field from the User collection
          as: "userData", // The name of the array field to add to the output documents
        },
      },
      {
        $unwind: "$userData", // Unwind the userData array to a single object
      },
      // Add an additional $match stage to filter by name and phone
      {
        $match: {
          $and: [
            _stype === "Name" && _q ? { "userData.Name": _q } : {},
            _stype === "Phone" && _q ? { "userData.Phone": parseInt(_q) } : {},
          ],
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by createdAt in descending order
        },
      },
      {
        $project: {
          order_id: 1,
          User_id: 1,
          amount: 1,
          upi_no: 1,
          closing_balance: 1,
          Withdraw_type: 1,
          Req_type: 1,
          client_ip: 1,
          client_forwarded_ip: 1,
          client_remote_ip: 1,
          action_by: 1,
          payment_gatway: 1,
          varified_by: 1,
          referred_by: 1,
          status: 1,
          referenceId: 1,
          txn_msg: 1,
          paymentImage: 1,
          createdAt: 1,
          updatedAt: 1,
          order_token: 1,
          userData: {
            _id: "$userData._id",
            Name: "$userData.Name",
            Phone: "$userData.Phone",
          },
        },
      },
    ]);

    res.status(200).json(txnData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/update/manual/deposit/user-wallet", Auth, async (req, res) => {
  const { transaction_id, user_id, status, Status_reason } = req.body;

  try {
    // Find the transaction by ID
    let transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Verify the transaction belongs to the given user_id
    if (transaction.User_id.toString() !== user_id) {
      return res
        .status(400)
        .json({ error: "Transaction does not belong to the specified user" });
    }

    // Find the user by ID
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the transaction status
    if (status === "Approved") {
      transaction.status = "PAID";
      transaction.Status_reason = "Approved";
      user.Wallet_balance += transaction.amount;
      user.totalDeposit += transaction.amount; // Assuming you are adding the transaction amount to the wallet balance
      transaction.action_by = req.user.id;
      await user.save();
      await transaction.save();
      const io = req.app.get("socketio");
      io.emit("updateWallets", user);
      res.status(200).json({
        user,
        message: "User wallet and transaction status updated successfully",
      });
    } else {
      transaction.status = "FAILED";
      transaction.Status_reason = Status_reason;
      await transaction.save();
      res.status(200).json({
        user,
        message: "User transaction status rejected successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
