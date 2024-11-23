const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
   
    Game_type: {
        type: String,
        required: true
    },
    Game_Ammount: {
        type: Number,
        required: true
    },
    Room_code: {
        type: String,
        default: null
    },
    Created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Accepetd_By: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Accepetd_At: {
        type: Date,
        default: null
    },
    action_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        default: null //Added By team
    },
    actionby_Date:{
        type: mongoose.Schema.Types.Date,
        ref:"User",
        default: null
    },
    Status: {
        type: String,
        default: "new"
    },
    Status_Update_By: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    Status_Reason: {
        type: String,
        default: null
    },
    Creator_Status: {
        type: String,
        default: null
    },
    Creator_Status_Reason: {
        type: String,
        default: null
    },
    Creator_Screenshot: {
        type: String,
        default: null
    },
    Creator_Status_Updated_at: {
        type: Date,
        default: null
    },
    Acceptor_status: {
        type: String,
        default: null
    },
    Acceptor_status_reason: {
        type: String,
        default: null
    },
    Acceptor_screenshot: {
        type: String,
        default: null
    },
    Acceptor_status_Updated_at: {
        type: Date,
        default: null
    },
    Acceptor_by_Creator_at: {
        type: Date,
        default: null
    },
    room_Code_shared: {
        type: Date,
        default: Date.now
    },
    Winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Cancelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    Acceptor_seen: {
        type: Boolean,
        default: false
    },
    Room_join: {
        type: Boolean,
        default: false
    },
    Room_Status: {
        type: String,
        default: 'active'
    },
    Winner_closingbalance:{
        type: Number,
        default:null
    },
    Loser_closingbalance:{
        type: Number,
        default:null
    },
    creatorWithdrawDeducted:{
        type: Number,
        default:null
    },
    acceptorWithdrawDeducted:{
        type: Number,
        default:null
    },
     winnAmount:{
        type: Number,
        default:null
    },
    lock: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

transactionSchema.virtual('creator',{
    ref: 'User',
    localField: 'Created_by',
    foreignField: '_id',
    justOne: true
});
transactionSchema.virtual('acceptor',{
    ref: 'User',
    localField: 'Accepetd_By',
    foreignField: '_id',
    justOne: true
});

// tell Mongoose to retreive the virtual fields
transactionSchema.set('toObject', { virtuals: true });
transactionSchema.set('toJSON', { virtuals: true });


const RunningGame = mongoose.model("RunningGame", transactionSchema)
module.exports = RunningGame