const mongoose = require("mongoose")

const autoSchema = new mongoose.Schema({
   
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
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Status: {
        type: String,
        default: "new"
    },
    lock: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

autoSchema.virtual('Userinfo',{
    ref: 'User',
    localField: 'User',
    foreignField: '_id',
    justOne: true
});


// tell Mongoose to retreive the virtual fields
autoSchema.set('toObject', { virtuals: true });
autoSchema.set('toJSON', { virtuals: true });


const AutoGame = mongoose.model("AutoGame", autoSchema)
module.exports = AutoGame