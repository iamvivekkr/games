const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    agent_id: { type: mongoose.Types.ObjectId, ref: 'User',default:null },

    status:{           // 1 = Active // 0 = inactive
        type:Number,
        default:0 
    },
    unseen:{         
        type:Number,
        default:0 
    },
    ticket_id:{
        type:String,
    },
    remark:{
        type:String,
        default:null
    },
    supportType:{type:String},
    issue :{
       type: mongoose.Schema.Types.ObjectID
    },
}, {
    timestamps: true,
     toJSON: { virtuals: true }
}) 

messageSchema.virtual('profile', {
    ref: 'User',
    localField: 'issue',
    foreignField: '_id',
    justOne: true,
  });
messageSchema.virtual('game', {
    ref: 'Game',
    localField: 'issue',
    foreignField: '_id',
    justOne: true,
  });
messageSchema.virtual('game_running', {
    ref: 'RunningGame',
    localField: 'issue',
    foreignField: '_id',
    justOne: true,
  });
  messageSchema.virtual('transection', {
    ref: 'transaction',
    localField: 'issue',
    foreignField: '_id',
    justOne: true,
  });

module.exports = mongoose.model('chatSupport', messageSchema)