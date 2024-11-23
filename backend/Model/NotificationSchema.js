const mongoose = require('mongoose')
require('../server')
const notification_schema = new mongoose.Schema({
    trans_type: { type: String },
    title: { type: String },
    body: { type: String },
    image: { type: String },
    soundtype: { type: String },
    sendto_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],   
    sendto: { type: String }, //all, all_astrologer, all_member, owner id comma seprated sendto_Id will depend on this
    msg_type: { type: String },
    other: { type: String }
}, {
    timestamps: true
})
const notification = mongoose.model('notification', notification_schema)
module.exports = notification