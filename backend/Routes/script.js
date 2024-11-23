const SiteSettings = require("../Model/settings");
const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const Game = require("../Model/Games");
const User = require("../Model/User");
const Gamedelete = require("../Model/Gamesdelete");
const RunningGame = require("../Model/RunningGame");
const activity = require("../Model/activity");
const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const fse = require('fs-extra');
const path = require("path");
const { default: axios } = require("axios");

const { findById, findOne } = require("../Model/settings");
const { send } = require("process");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const folderPath = '/www/wwwroot/rkludo.in/backend/public/gamedoc';
const dateCutoff = new Date('2022-02-10'); // replace with the desired cutoff date
const batchSize = 10; // replace with the desired batch size

let filesToDelete = [];

router.get('/delete_older', async (req, res) => {

     
   var a =  await RunningGame.updateMany({"Status":"pending","updatedAt": { "$lt": new Date(Date.now() - 10 * 60 * 1000) }},{"$set":{"Status":"conflict"}})
         
       
 var b = await RunningGame.deleteMany({
            "Status": "new",
    "createdAt": { "$lt": new Date(Date.now() - 10 * 60 * 1000) }
        });
   return res.send({
                msg: 'deleted game',
                status: true,
                updateStatus: a,
                newdelete: b
              });
                  
})
router.get('/activity/:id/:type', async (req, res) => {
    // try {
     
  var query ={};
  if(req.params.id){
      query = { User_id:req.params.id}
  }
        if(req.params.type=='all'){

           const activitys = await activity.find(query).populate('actionBy', '_id Name').populate('User_id', '_id Name')
               res.send({status:true, data : activitys});
        }else{
             const activitys = await activity.find({'User_id':req.params.id, Req_type:req.params.type}).populate('actionBy', '_id Name')
              res.send({status:true, data : activitys});
           
        }
       
    // } catch (error) {
    //     res.status(400).send(error);
    // }
})

router.get('/roomcode/classic', async (req, res) => {
    
            await axios.get('http://159.65.152.105:5002/bot/getcode/classic')
            // await axios.get('http://170.187.254.9:9300/roomcode/generate?battle_type=classic')
            .then(async room_res => {
                console.error('romecode genrate 1',room_res.data.roomcode);
                if (room_res.status == 200) {
           
                     const Room_code = (room_res.data.roomcode)?room_res.data.roomcode:null;
                    //  const Room_code = (room_res.data.room_code)?room_res.data.room_code:null;
                    //  const Room_code = 12345678;
                     res.status(200).send({roomcode:Room_code})
            
                }   
            })
            .catch(async err => {
          
                console.log('room err',err.message);
            })
})

router.get('/useraction', async (req, res) => {
    
//   const user1 = await User.findById(req.query.id);
//      user1.withdraw_holdbalance = 0;
//      await user1.save();
//   var a =  await User.updateMany({"_id":req.query.id},{"$set":{"Phone":req.query.phone}})
//   var a =  await User.deleteOne({"_id":req.query.id})
         
  var query ={};
  if(req.query.id){
      query = {$or: [{ Created_by: req.query.id},{ Accepetd_By: req.query.id}
                            ]}
  }
          const  Gamedeletestatus = await Gamedelete.find(query);
              return res.send({
                msg: 'deleted game',
                status: true,
                data: Gamedeletestatus
              });
})

router.get('/delete_game_assets', async (req, res) => {
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading folder: ${folderPath}`, err);
  } else {
    console.log(`Found ${files.length} files in folder`);
    let numFilesDeleted = 0;
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      if (stats.ctime < dateCutoff) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
            numFilesDeleted++;
            if (numFilesDeleted === files.length) {
              console.log('Finished deleting old files');
            }
          }
        });
      } else {
        console.log(`Skipping file: ${filePath}`);
        numFilesDeleted++;
        if (numFilesDeleted === files.length) {
          console.log('Finished deleting old files');
        }
      }
    }
  }
});
})



module.exports = router;