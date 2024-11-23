const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
  
    order_id: {
        type: String,
         default:null
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        default:0
    },
   
    Req_type: {
        type: String,
        default:null
    },
    txn_msg:{
          type:String,
        default:null
    },
    ip:{
        type:String,
        default:null
    },
    actionBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true })

const Transaction = mongoose.model("activity", activitySchema)
module.exports = Transaction