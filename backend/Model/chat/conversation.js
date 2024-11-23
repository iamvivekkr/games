const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    chat_id: { type: mongoose.Types.ObjectId, ref: 'Chat' },
    recipients: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: String,
    media: String,
    startTime:{
        type:Date,
        default:Date.now()
    },
})

module.exports = mongoose.model('conversation', conversationSchema)