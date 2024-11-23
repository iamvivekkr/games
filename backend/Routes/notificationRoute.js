const router = require('express').Router()
const Users = require('../Model/User')
const Notification = require('../Model/NotificationSchema')
const Auth = require('../Middleware/Auth')
const axios = require('axios')

const admin = require('../firebaseConfig')
const notify = require('../fcmNotification')




const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };


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

async function filterPagination(data , limitQuery){
    const page = parseInt(limitQuery.page)
    const limit = parseInt(limitQuery.limit)
    
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    console.log(endIndex , data.length )
    if (endIndex < data.length) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.results = await data.slice(0 , 2)
    //console.log(results)
    return results;
    
}


async function sendFireBaseNOtificationFCM (registrationToken , message  ){

    const options =  notification_options
    const body = {
        "registration_ids":["cH5MkWRhi-mDzaBqp2HI5L:APA91bGLFSDhLwf-vV38-AnrYzffDyFlHSId1K9R8NJ-yPsVRRtXaGk6URIxrv3gZhbDRbbjkadAs94OEOGl6Vtp-bTktJEZy9gbVGRvBYK1q3qrkvT7rN64aYA8yj3rd-xUTlL3shl9"],
        "notification":{
            "title":"postman click me nodejs",
            "body":"Postman body"
        }
    }
    await axios.post("https://fcm.googleapis.com/fcm/send", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAVGOspUI:APA91bEn6xSgNJgDtV4KETuBrBzqeJMxP7NacpcpaYR2KvxDYpR0ugE2AtIHwXiI0_RAEQKCfu39RM6yjlooA0_WOKqnZ82G-9_CyOB8i3VcLNTrgDhQ28MYPdwx5m7T96r1hiDfiakT'
        }
    }).then(
        (response) => {
            console.log(response.data)
        },
        (error) => {
            if (error.response.status == 401) {
                console.log(error.response)
            }
        }
    );
}

async function sendFireBaseNotification(registrationToken , message  ){

    const options =  notification_options
    
      return notify.sendFireBaseNOtificationFCM(registrationToken, message, options)
      .then( response => {

        console.log("Notification sent successfully"+response)
        
      })
      .catch( error => {
          console.log(error);
      });
}




//Admin Actions for notification

router.post('/admin/send-notification' , Auth , async(req,res)=>{
    const {sendto , title , body , image , soundtype , other, id} = req.body
    const NotificatoinMsg = {
        title, body, image, other
    }
    console.log(req.body)
    if(sendto == 'all'){
        const newNotification = new Notification(req.body)
        await newNotification.save()



        console.log("Inside all")
        const userDetail = await Users.updateMany({} ,{
            $push:{
                notifications:newNotification._id
            }
        } );

        userDetail.forEach((element) => {
            sendFireBaseNotification(element.firebaseToken , NotificatoinMsg )
        });
        
        res.json({Success:"Notification was sent"})
    }


    else if(sendto == 'selected'){
        //Logic formation needed // array of ownerId0
    }
})


router.get('/admin/list-notification/:type/:typedes' , Auth , async (req ,res)=>{
    const paramType  = req.params.type
    const paramTypeDes = req.params.typedes
    let notification
    var data = [];
    if(paramType=="trans_type"){
        const query = Notification.find({trans_type:paramTypeDes}).sort({"createdAt": -1});

        const total_documents = await Notification.find({trans_type:paramTypeDes}).countDocuments();
 
         data = await pagination(query, total_documents, req.query); 
    }
    else if(paramType=="msg_type"){
        const query = Notification.find({msg_type:paramTypeDes}).sort({"createdAt": -1});

        const total_documents = await Notification.find({msg_type:paramTypeDes}).countDocuments();
 
         data = await pagination(query, total_documents, req.query); 
    }
    else if(paramType=="sendto"){
        const query = Notification.find({sendto:paramTypeDes}).sort({"createdAt": -1});

        const total_documents = await Notification.find({sendto:paramTypeDes}).countDocuments();
 
         data = await pagination(query, total_documents, req.query);   
    }

   res.json(data)

})




//for users
router.get('/list-notification/:type/:typedes' , Auth , async (req ,res)=>{
    const paramType  = req.params.type
    const paramTypeDes = req.params.typedes
       let notification
       var data = [];
    if(paramType=="trans_type"){
        const query = Notification.find({trans_type:paramTypeDes}).sort({"createdAt": -1});

        const total_documents = await Notification.find({trans_type:paramTypeDes}).countDocuments();
 
         data = await pagination(query, total_documents, req.query); 
        
    }
    else if(paramType=="msg_type"){
        const query = Notification.find({msg_type:paramTypeDes}).sort({"createdAt": -1});

        const total_documents = await Notification.find({msg_type:paramTypeDes}).countDocuments();
 
         data = await pagination(query, total_documents, req.query);  

    }
    else if(paramType=="sendto"){
      
      
       const query = Notification.find({sendto:paramTypeDes}).sort({"createdAt": -1});

       const total_documents = await Notification.find({sendto:paramTypeDes}).countDocuments();

        data = await pagination(query, total_documents, req.query);  
    }else{
        const query = Notification.find({ $or: [
            { "sendto": "all" },
            { "sendto": "all_member" },
            { "sendto": req.user._id },
            { "sendto_Id": { $in : [req.user._id]  }}
         
          ]}
          ).sort({"createdAt": -1});

    const total_documents = await Notification.find({ $or: [
        { "sendto": "all" },
        { "sendto": "all_member" },
        { "sendto": req.user._id },
        { "sendto_Id": { $in : [req.user._id]  }}
     
      ]}
      ).countDocuments();
     data = await pagination(query, total_documents, req.query);
    }
    return res.json(data)

})


module.exports = router