const express = require("express")
const User = require("../Model/User")
const router = express.Router()
const Auth = require("../Middleware/Auth")
const Chat = require('../Model/chat/chat')
const Conversation = require('../Model/chat/conversation')
const Transaction = require("../Model/transaction")
const Game = require("../Model/Games");

const multer = require('multer')

var Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: Storage })

async function pagination(DBQuery, total_documents, req) {
    let { page, limit } = req
    if (!page) page = 1;
    if (!limit) limit = 10;
    const size = parseInt(limit)
    const skip = (page - 1) * size
    const previous_pages = page - 1;

    // const total_documents = await DB.countDocuments().exec();
    const next_pages = Math.ceil((total_documents - skip) / size);

    const results = {}
    results.page = page;
    results.size = size;

    results.previous = previous_pages;
    results.next = next_pages;
    results.totalRecord = total_documents;
    try {
        results.results = await DBQuery.limit(size).skip(skip);
        return results;

    } catch (e) {
        console.log(e)
        return e
    }


}
//Bit wise operator to convert Float/double into Integer
function float2int(value) {
    return value | 0;
}



// Support Chat Routes
function generateUniqueID() {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomNum = Math.floor(Math.random() * 100000000); // Generate a random number between 0 and 99999999
  const uniqueID = timestamp.substr(timestamp.length - 4) + randomNum.toString().padStart(4, '0');
  return uniqueID;
}

router.post('/genrate-ticket', Auth, async (req, res) => {
            try {
            console.log("Chat request", req.body)
   
            const chatorder = new Chat({
                user_id: req.user._id,
                ticket_id: generateUniqueID(),
                agent_id: null,
                supportType: req.body.supportType,
                issue: req.body.issue
            })
            //console.log(chatorder)
            await chatorder.save();
            
              const conversation = new Conversation({
            chat_id: chatorder._id,
            recipients: null,
            text: 'We will connect you with one of our Rkludo Guides as soon as possible. For a faster resolution, please tell us how we can help you today.',
           
            })
        //   console.error(data,'user')
            await conversation.save();
            
   const chatlist = await Chat.find({user_id:req.user.user_id});
            return res.json({ Success: "Chat order created", chatlist:chatlist })

        } catch (error) {
            console.error(error,'error');
            return res.status(400).json(error)
        }
})

router.get('/ticket-list', Auth, async (req, res) => {
    // console.error(req.user._id ,'req.user._is 87')
       const query = Chat.find({ user_id: req.user._id })
                    .sort({ 'createdAt': -1 });
                    // .populate('astroId', ['_id', 'name', 'profileImage'])
                    // .populate('memberId', ['_id', 'firstName', 'lastName', 'profileImage'])
                    // .populate('transactionId');

                const total_documents = await Chat.find({ user_id: req.user.user_id }).countDocuments();

                const data = await pagination(query, total_documents, req.query);
                
                // get first Conversation
                if(data.results.length > 0){
                      const Conversation_query = Conversation.find({ _id: data.results[0]?._id })
                    .sort({ 'createdAt': -1 });

                 const Conversationtotal_documents = await Conversation.find({ _id: data.results[0]._id }).countDocuments();

                const Conversation_data = await pagination(Conversation_query, Conversationtotal_documents,{page:0,limit:50});
               data['Conversation'] = Conversation_data;
                }else{
                    
                }
                
                return res.json(data)
})
router.get('/ticket-list/admin', Auth, async (req, res) => {
    // console.error(req.user._id ,'req.user._is 87')
       const query = Chat.find({  })
                    .sort({ 'createdAt': -1 });
                    // .populate('astroId', ['_id', 'name', 'profileImage'])
                    // .populate('memberId', ['_id', 'firstName', 'lastName', 'profileImage'])
                    // .populate('transactionId');

                const total_documents = await Chat.find({ agent_id: req.user._id }).countDocuments();

                const data = await pagination(query, total_documents, req.query);
                
                // get first Conversation
                if(data.results.length > 0){
                      const Conversation_query = Conversation.find({ _id: data.results[0]?._id })
                    .sort({ 'createdAt': -1 });

                 const Conversationtotal_documents = await Conversation.find({ _id: data.results[0]._id }).countDocuments();

                const Conversation_data = await pagination(Conversation_query, Conversationtotal_documents,{page:0,limit:50});
               data['Conversation'] = Conversation_data;
                }else{
                    
                }
                
                return res.json(data)
})

router.get('/conversation/:id', Auth, async (req, res) => {
    if(req.user.user_type == "Admin"){
        await Chat.findOneAndUpdate({ _id: req.params.id},
        { $set: { unseen: 0 } },
  { returnOriginal: false });
    }
       const query = Conversation.find({ chat_id: req.params.id })
                    .sort({ 'createdAt': -1 });
                    // .populate('astroId', ['_id', 'name', 'profileImage'])
                    // .populate('memberId', ['_id', 'firstName', 'lastName', 'profileImage'])
                    // .populate('transactionId');

                const total_documents = await Conversation.find({ _id: req.params.id }).countDocuments();

                const data = await pagination(query, total_documents, req.query);
                return res.json(data)
})
module.exports = router