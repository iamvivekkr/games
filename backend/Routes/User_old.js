const express = require("express")
const User = require("../Model/User")
const router = express.Router()
const bcrypt = require("bcrypt")
const Auth = require("../Middleware/Auth")
const RoleBase = require("../Middleware/Role")
const twofactor = require("node-2fa");
const https = require('https');
const path = require("path")
const Game = require("../Model/Games");
const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const randomstring = require("randomstring");
const myTransaction = require("../Model/myTransaction")
const AdminEarning = require("../Model/AdminEaring")
const Transaction = require("../Model/transaction")
const GatewaySettings=require("../Model/Gateway");
const AadharCard = require("../Model/Kyc/Aadharcard");
const activity = require("../Model/activity");
const profanity = require("profanity-hindi");
// let phoneNumber=undefined;
const storage = multer.memoryStorage();
const upload = multer({ storage });

const code_gen = async () => {
    let code = Math.floor(Math.random() * 1000000);
    let check = await User.findOne({ referral_code: code });
    if (check) {
        return code_gen();
    }
    return code;
};

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/profilepic");
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
// });
// const fileFilter = (req, file, cd) => {
//     if (
//         (file.mimetype === "image/jpg",
//             file.mimetype === "image/jpeg",
//             file.mimetype === "image/png")
//     ) {
//         cd(null, true);
//     } else {
//         cd(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 100000000000,
//     },
// });

router.post('/users/me/avatar', Auth, upload.single('avatar'), async (req, res) => {
    fs.access("./public/profilepic", (error) => {
        if (error) {
          fs.mkdirSync("./public/profilepic");
        }
      });
      const { buffer, originalname } = req.file;
       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
           
      const ref = `${uniqueSuffix}.webp`;
      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./public/profilepic/" + ref);
        
    req.user.avatar = "public/profilepic/" + ref,
    await req.user.save()
    res.send()
    
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.patch("/agent/permission/:id", async (req, res) => {
    try {
        const permission =
            [
                { Permission: 'dashboard', Status: false },
                { Permission: 'earning', Status: false },
                { Permission: 'allAdmins', Status: false },
                { Permission: 'newAdmin', Status: false },
                { Permission: 'allUsers', Status: false },
                { Permission: 'newUser', Status: false },
                { Permission: 'pendingKyc', Status: false },
                { Permission: 'completedKyc', Status: false },
                { Permission: 'rejectKyc', Status: false },
                { Permission: 'allChallenge', Status: false },
                { Permission: 'completedChallenge', Status: false },
                { Permission: 'conflictChallenge', Status: false },
                { Permission: 'cancelledChallenge', Status: false },
                { Permission: 'runningChallenge', Status: false },
                { Permission: 'newChallenge', Status: false },
                { Permission: 'penaltyBonus', Status: false },
                { Permission: 'depositHistory', Status: false },
                { Permission: 'withdrawlHistory', Status: false },
                { Permission: 'allWithdrawlReq', Status: false },
                { Permission: 'allDepositReq', Status: false },
                { Permission: 'pages', Status: false },
                { Permission: 'bonusHistory', Status: false },
                { Permission: 'bonusReport', Status: false },
                { Permission: 'withdrawalReport', Status: false },
                { Permission: 'depositReport', Status: false },
                { Permission: 'penaltyReport', Status: false },
            ];

        const data = await User.findByIdAndUpdate(req.params.id, { $push: { Permissions: permission } }, { new: true })
        res.send(data)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})
router.post("/agent/permission/nested/:id", Auth, async (req, res) => {
    try {
        const updateResult = await User.findOneAndUpdate(
            { 'Permissions._id': req.params.id },
            { 'Permissions.$.Status': req.body.Status }
        );
        res.send(updateResult)
    } catch (e) {
        res.send(e)
        console.log(e);
    }

})

// router.post('/users/me/avatar', Auth, upload.single('avatar'), async (req, res) => {
//     if(req.file.path){
        
//         req.user.avatar = req.file.path,
//         await req.user.save()
//         res.send()
//     }else{
//     }
    
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

router.delete('/users/me/avatar', Auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})



router.get('/users/avatar/:id', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})



router.post("/admin/register", async (req, res) => {
    const { Name, Password, Phone, user_type, twofactor_code } = req.body
    try {

        let user = await User.findOne({ Phone })
        if (user) {
            return res.send("Phone have already")
        }



        user = new User({
            Name,
            Password,
            Phone,
            user_type,
            referral_code: await code_gen()
        })

        const token = await user.genAuthToken();

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);

        user.save()
        res.status(200).send({ msg: "success", user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/agent/all", Auth, async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Agent" })
        res.status(200).send(admin)
    } catch (e) {
        res.status(400).send(e)
    }
})


// router.post("/login", async (req, res) => {
//     try {
//         const { Password, Phone, referral, twofactor_code } = req.body
//         let user = await User.findOne({ Phone: Phone }).where("user_type")
//         if (user != null)
//             if (user.user_type == "Block") {
//                 return res.json({
//                     msg: "You are Blocked. Please contact to admin.",
//                     ok: true,
//                     status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//                 });
//             }
//         const newSecret = twofactor.generateToken(
//             "QQYJO5DA57EHQEKCZWGBRLATFTDLP522",// The Application Name
//             "Phone" // Unique Identifier for User mostly used as email or username
//         );
//         https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=8opUfsgTWi10Mc9CbhFmAtKV2erEvu7nNXQZ3YydjPDR6JzIwG7GyS1DxqAjYtkrNcvJ6pnLX8PiBe9u&route=v3&sender_id=FTWSMS&message=Your+one+time+OTP+is+${newSecret.token}+.+Please+enter+this+to+verify+your+mobile+.+Thank+you+and+keep+playing+in+rkludo.in&language=english&flash=0&numbers=${Phone}`, (resp) => {
//             console.log(newSecret.token)
//         })
       
//         return res.json({
//             ok: true,
//             status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//             msg: "Authentication Required",
//         });
//     } catch (e) {
//         res.status(400).send(e)
//         console.log(e);
//     }
// })
// router.post("/login", async (req, res) => {
//     try {
//         const { Password, Phone, referral, twofactor_code } = req.body
//       const Name = randomstring.generate({
//             length: 5,
//             charset: 'alphabetic'
//         });
//         let user = await User.findOne({ Phone: Phone }).where("user_type")
//         if (user != null)
//         {
//             if (user.user_type == "Block") {
//                 return res.json({
//                     msg: "You are Blocked. Please contact to admin.",
//                     ok: true,
//                     status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//                 });
//             }

//         }
//         const SecretCode = twofactor.generateSecret({ name: Name, Phone: Phone });
//         const newSecret = twofactor.generateToken(SecretCode.secret);
//         https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=8opUfsgTWi10Mc9CbhFmAtKV2erEvu7nNXQZ3YydjPDR6JzIwG7GyS1DxqAjYtkrNcvJ6pnLX8PiBe9u&route=v3&sender_id=FTWSMS&message=Your+one+time+OTP+is+${newSecret.token}+.+Please+enter+this+to+verify+your+mobile+.+Thank+you+and+keep+playing+in+rkludo.in&language=english&flash=0&numbers=${Phone}`, (resp) => {
//             console.log("send");
//         })
//         console.log(newSecret.token);
//         if (user != null)
//         {
//             user.otp=newSecret.token;
//             user.save();
//         }

//         return res.json({
//             ok: true,
//             status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//             msg: "Authentication Required",
//             secret: SecretCode.secret
//         });
//     } catch (e) {
//         res.status(400).send(e)
//         console.log(e);
//     }
// })


// router.post("/login/finish", async (req, res) => {
//     const { Phone, referral, twofactor_code, secretCode } = req.body
//     Name = randomstring.generate({
//         length: 5,
//         charset: 'alphabetic'
//     });
//     // const password = req.body.Password

//     try {
//             let user = await User.findOne({ Phone: Phone }).where("user_type")
//             if (user != null)
//             {
//                 if(user.otp!=twofactor_code)
//                 {
//                     return res.send({ ok: false, msg: "Invalid Two Factor Code" });
//                 }
//                 if (user.user_type == "Block") {
//                     return res.json(
//                         {
//                             msg: "You are Blocked. Please contact to admin.",
//                             ok: true,
//                             status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//                         });
//                 }
//             }
//             if (user == null) {
//                 const matched = twofactor.verifyToken(secretCode, twofactor_code);
//                 if (matched.delta==-1&&matched.delta==1) {
//                     return res.send({ ok: false, msg: "Invalid Two Factor Code" });
//                 }
//                 if(matched.delta==0)
//                 {

//                     console.log('new user register', referral)
//                     let referralBy = referral;
//                     const Exist = await User.find({ referral_code: referral });
//                     if (Exist.length != 1) {
//                         referralBy = null;
//                     }
//                     user = new User({
//                         Name,
//                         Password: "12345",
//                         Phone,
//                         user_type: "User",
//                         referral: referralBy,
//                         referral_code: await code_gen()
//                     })
//                     const salt = await bcrypt.genSalt(10);
//                     user.Password = await bcrypt.hash(user.Password, salt);
//                     // user.save()
//                     const token = await user.genAuthToken();
//                     return res.status(200).send({ msg: "success", user, token })
//                     // console.log(newSecret.token);
//                 }
//             }
//             const matched = twofactor.verifyToken(secretCode, twofactor_code);
          
//             if (matched.delta==-1&&matched.delta==1) {
//                 return res.json({ ok: false, msg: "Invalid Login" });
//             }
//             else if(matched.delta==0){
//                 const token = await user.genAuthToken();
//                 res.status(200).send({
//                     status: "true",
//                     msg: "login successful",
//                     data: token, user,
//                 });
//                 console.log(user, token);
//             }
    
       
//     } catch (e) {
//         res.status(400).send(e)
//         console.log(e);
//     }
// })

router.post("/login", async (req, res) => {
    try {
        const { Password, Phone, referral, twofactor_code } = req.body
       const Name = randomstring.generate({
            length: 5,
            charset: 'alphabetic'
        });
        const SecretCode = twofactor.generateSecret({ name: Name, Phone: Phone });
        const newSecret = twofactor.generateToken(SecretCode.secret);

        let user = await User.findOne({ Phone: Phone })

        if (user != null)
        {
            if (user.user_type == "Block") {
                return res.json({
                    msg: "You are Blocked. Please contact to admin.",
                    status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
                });
            }
    
   const otp = await GatewaySettings.findOne()
       
             if(otp.otp == "1"){
            if (user.Phone === 9024266200) {
                user.otp=newSecret.token;
                user.save();
                
                console.log("send otp to Test");

                return res.json({
                    status: 200, // Custom Status for Inbuild Use Says That 2fa Authentication is required
                    msg: "Authentication Required",
                    secret: SecretCode.secret,
                    myToken: newSecret.token
                });
            }
            
            user.otp=newSecret.token;
            user.save();
            
            
            https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=R2ye8V7TJLDtK6ziMpC5ANdSoj9v1mqP3YfwbFnkZOgrshWBUQJy5znDFYuf3PNZUB04aCKRg1k28cjv&route=dlt&sender_id=RKMAMA&message=148475&variables_values=${newSecret.token}&flash=0&numbers=${Phone}`, (resp) => {
   
            })
            return res.json({
                status: 200, // Custom Status for Inbuild Use Says That 2fa Authentication is required
                msg: "Authentication Required",
                secret: SecretCode.secret
            });
             }
           
        }
        else if(user==null){
          
//   return res.json({
//                     msg: "Currently we are not allowing new registration.",
//                     status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
//                 });
            
         
            let referralBy = referral;
            const Exist = await User.find({ referral_code: referral });
            if (Exist.length != 1) {
                referralBy = null;
            }
            const newUser = new User({
                Name,
                Password: "12345",
                Phone,
                user_type: "User",
                referral: referralBy,
                referral_code: await code_gen()
            })
            const salt = await bcrypt.genSalt(10);
            newUser.Password = await bcrypt.hash(newUser.Password, salt);
            newUser.otp=newSecret.token;
            await newUser.save()
            // const token = await user.genAuthToken();
           
            https.get(`https://www.fast2sms.com/dev/bulkV2?authorization=R2ye8V7TJLDtK6ziMpC5ANdSoj9v1mqP3YfwbFnkZOgrshWBUQJy5znDFYuf3PNZUB04aCKRg1k28cjv&route=dlt&sender_id=RKMAMA&message=148475&variables_values=${newSecret.token}&flash=0&numbers=${Phone}`, (resp) => {
    
            })
            
            return res.json({
                status: 200, // Custom Status for Inbuild Use Says That 2fa Authentication is required
                msg: "Authentication Required",
                secret: SecretCode.secret
            });
        }
     
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})


router.post("/login/finish", async (req, res) => {

    const { Phone, referral, twofactor_code, secretCode } = req.body

    try {
            let user = await User.findOne({ Phone: Phone })
            if (user != null)
            {
                if(user.otp!=twofactor_code)
                {
               
                    return res.send({ msg: "Invalid OTP",status: 101 });
                }
                else if (user.user_type == "Block") {
                    // console.log('You are Blocked. Please contact to admin.')

                    return res.json(
                        {
                            msg: "You are Blocked. Please contact to admin.",
                            status: 101
                        });
                }
                else{
                    const matched = twofactor.verifyToken(secretCode, twofactor_code);
                    if(matched==null)
                    {
                        return res.json({ status:101, msg: "Invalid OTP!" });
                    }
                    else
                    {
                        // console.log('match3d resuldt',matched.delta);
                       
                        //if(matched.delta==0){
                            const token = await user.genAuthToken();
                            res.status(200).send({
                                status: 200,
                                msg: "login successful",
                                token, user,
                            });
                       // }
                        //else {
                        //    return res.json({ status:101, msg: "OTP Expired. Please try again!" });
                        //}
                    }
                }
            }
            else if (user == null) {
                // console.log('user not exit byt');
                return res.status(200).send({ msg: "Invalid User",status:101 })
            }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

   router.get('/all/user/data/get',Auth,async (req,res)=>{
        try {
            let todaySuccessAmount=0;
            let todayCommission=0;
            let todayTotalDeposit=0;
            let todayTotalWithdraw=0;
            let totolWonAmount=0;
            let totalLoseAmount=0;
            let totalHoldBalance=0;
            let totalWithdrawHold=0;
            let totalDeposit=0;
            let totalWithdrawl=0;
            let totalReferralEarning=0;
            let totalReferralWallet=0;
            let totalWalletbalance=0;
            var now = new Date();
            var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const totalUser= await User.find({user_type:"User"});
            const todayUser=await User.find({$and:[{createdAt: {$gte: startOfToday}},{user_type:"User"}]}).countDocuments();
            const todaySuccessGame=await Game.find({$and:[{createdAt: {$gte: startOfToday}},{Status:"completed"}]});
            const todayCancelGame=await Game.find({$and:[{createdAt: {$gte: startOfToday}},{Status:"cancelled"}]}).countDocuments();
            const todayAllGame=await Game.find({createdAt: {$gte: startOfToday}}).countDocuments();
            const totalGame= await Game.find().countDocuments();
            const todayCommissionEntry= await AdminEarning.find({createdAt: {$gte: startOfToday}});
            const todayDepositEntry= await Transaction.find({
                        $or:[
                            {$and:[{createdAt: {$gte: startOfToday}},{status:"SUCCESS"},{Req_type:"deposit"}]},
                            {$and:[{createdAt: {$gte: startOfToday}},{status:"PAID"},{Req_type:"deposit"}]},
                        ]});
            const todayWithdrawEntry= await Transaction.find({
                        $or:[
                            {$and:[{createdAt: {$gte: startOfToday}},{status:"SUCCESS"},{Req_type:"withdraw"}]},
                            {$and:[{createdAt: {$gte: startOfToday}},{status:"PAID"},{Req_type:"withdraw"}]},
                        ]});
            totalUser.forEach((item)=>{
                totolWonAmount+=item.wonAmount;
                totalLoseAmount+=item.loseAmount;
                totalHoldBalance+=item.hold_balance;
                totalWithdrawHold+=item.withdraw_holdbalance;
                totalDeposit+=item.totalDeposit;
                totalWithdrawl+=item.totalWithdrawl;
                totalReferralEarning+=item.referral_earning;
                totalReferralWallet+=item.referral_wallet;
                totalWalletbalance+=item.Wallet_balance;
            })
            todayWithdrawEntry.forEach((item)=>{
                todayTotalWithdraw+=item.amount;
            })
            todayDepositEntry.forEach((item)=>{
                todayTotalDeposit+=item.amount;
            })
            todayCommissionEntry.forEach((item)=>{
                todayCommission+=item.Ammount;
            })
            todaySuccessGame.forEach((item)=>{
                todaySuccessAmount+=item.Game_Ammount;
            })
            const data={
               totalUser:totalUser.length,
               todayUser:todayUser,
               todayAllGame:todayAllGame,
               todaySuccessGame:todaySuccessGame.length,
               todayCancelGame:todayCancelGame,
               totalGame:totalGame,
               todayCommission:todayCommission,
               todayTotalDeposit:todayTotalDeposit,
               todayTotalWithdraw:todayTotalWithdraw,
               totolWonAmount:totolWonAmount,
               totalLoseAmount:totalLoseAmount,
               totalHoldBalance:totalHoldBalance,
               totalWithdrawHold:totalWithdrawHold,
               totalDeposit:totalDeposit,
               totalWithdrawl:totalWithdrawl,
               totalReferralEarning:totalReferralEarning,
               totalReferralWallet:totalReferralWallet,
               totalWalletbalance:totalWalletbalance
            }
           res.send(data);
        } catch (error) {
            console.log(error);
        }
    })

router.get("/total/user", Auth, async (req, res) => {
    try {
        const admin = await User.find().countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/get_user/:id", Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("action_by");
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/admin", Auth, RoleBase("Admin"), async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Admin" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/block", Auth, async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Block" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/total/active", Auth, async (req, res) => {
    try {
        const order = await User.find({
            $and: [
                { Wallent_balance: { $gt: 0 } },
                { user_type: "User" },
            ],
        }).countDocuments();

        res.status(200).send(order.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get("/challange/completed", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "completed" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/active", Auth, async (req, res) => {
    try {
        const admin = await Game.find({$or:[{ Status: "running" },{Status:"pending"}]}).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/running", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "requested" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/challange/cancelled", Auth, async (req, res) => {
    try {
        const admin = await Game.find({ Status: "cancelled" }).countDocuments()

        res.status(200).send(admin.toString())

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/total/deposit", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "SUCCESS" }
            ]
        })
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
            ]
        }).countDocuments();

        let total = 0

        data.forEach((item) => {
            total += item.amount
        })

        res.status(200).send({ "data": total,"count":countDeposit })
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})
router.get("/count/new/deposit", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "Pending" }
            ]
        }).countDocuments();
        let total=parseInt(countDeposit);
        res.status(200).send({ "count":total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})





router.get("/admin/all", Auth, async (req, res) => {
    try {
        const admin = await User.find({ user_type: "Admin" })

        res.status(200).send(admin)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/User/all/panelty", Auth, async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const PAGE_SIZE = req.query._limit;
    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    try {
        let query ={};
        if(searchq!=0 && searchtype !=0){
            page = parseInt("0");
            query[searchtype] = (searchtype==='Phone' || searchtype==='_id')? searchq : new RegExp('.*' + searchq + '.*')
        }else{
            query = {};
        }
        const total = await User.countDocuments(query);
        const admin = await User.find(query).where("user_type").ne("Admin").limit(PAGE_SIZE).skip(PAGE_SIZE * page)

        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), admin})

    } catch (e) {
        res.status(400).send(e)
    }
})

//view all user with react paginate
// router.get("/User/all", Auth, async (req, res) => {
//     const searchq = req.query._q;
//     const searchtype = req.query._stype;
//     const PAGE_SIZE = req.query._limit;
//     let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
//     try {
//         let query ={};
//         if(searchq!=0 && searchtype !=0){
//             page = parseInt("0");
//             query[searchtype] = (searchtype==='Phone' || searchtype==='_id')? searchq : new RegExp('.*' + searchq + '.*')
//         }else{
//             query = {};
//         }

//         const total = await User.countDocuments(query);
//         const admin = await User.find(query).where("user_type").ne("Admin").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
       
//         res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), admin})

//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

//view all user with react paginate
router.get("/User/all", Auth, async (req, res) => {
    const searchq = req.query._q;
    const searchtype = req.query._stype;
    const PAGE_SIZE = req.query._limit;
    const searchbystatus = req.query._status;
    const searchbyUser=req.query._Userstatus;
    
    let page =(req.query.page==0)? 0 : parseInt(req.query.page-1);
    try {
        let query ={};
        let total;
        let admin;
        
        if(searchq!=0 && searchtype !=0 && searchbystatus == 0){
            page = parseInt("0");
            query[searchtype] = (searchtype==='Phone' || searchtype==='_id' || searchtype==='createdAt')? searchq : new RegExp('.*' + searchq + '.*')
            
             total = await User.countDocuments(query);
             admin = await User.find(query).where("user_type").ne("Admin").populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }
          else if( searchbystatus=='negative_hold'){
         
            total = await User.countDocuments({hold_balance:{$lt: 0}});
          
            admin = await User.find({hold_balance:{$lt: 0}}).populate("action_by").sort({ hold_balance: 1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            
       }
          else if( searchbystatus=='mismatch'){
         
             const use0 = [];
          const userData = await User.find()
  userData.forEach((item) => {
           var mismatchValue =  item.Wallet_balance-(((item.wonAmount-item.loseAmount)+item.totalDeposit+item.referral_earning+item.totalBonus)-(item.totalWithdrawl+item.referral_wallet+item.withdraw_holdbalance+item.hold_balance+item.totalPenalty));
           if(mismatchValue !== 0){
               
               console.error(mismatchValue,'name')
               use0.push(item);
           }
        
        })
   
            total = 1000;
          
      admin =  use0;
       }
       else if(searchbystatus != 0 && searchbystatus!='Block' && searchbystatus!='hold_balance' &&  searchq==0 && searchtype ==0 ){
             //total = await User.countDocuments({query,verified:searchbystatus});
             //admin = await User.find({query,verified:searchbystatus}).where("user_type").ne("Admin").populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
             total = await User.countDocuments({query,hold_balance:{$gt : 0}});
             admin = await User.find({query,hold_balance:{$gt : 0}}).where("user_type").ne("Admin").populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        }
        else if(searchbystatus != 0 && searchbystatus=='Block' && searchbystatus!='hold_balance' && searchq==0 && searchtype ==0 ){
            
            //total = await User.countDocuments({query, user_type:searchbystatus});
            //admin = await User.find({query, user_type:searchbystatus}).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            
            total = await User.countDocuments({Wallet_balance:{$lt :0}});
            admin = await User.find({Wallet_balance:{$lt : 0}}).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
       }
       else if(searchbystatus != 0 && searchbystatus=='hold_balance' && searchq==0 && searchtype ==0 ){
           
            total = await User.countDocuments({withdraw_holdbalance:{$gt :0}});
            admin = await User.find({withdraw_holdbalance:{$gt : 0}}).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
            
            //total = await User.countDocuments({Wallet_balance:{$lt :0}});
            //admin = await User.find({Wallet_balance:{$lt : 0}}).populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
       }
      
       else{
          
        total = await User.countDocuments(query);
        admin = await User.find({query}).where("user_type").ne("Admin").populate("action_by").sort({ updatedAt: -1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
       }
       
        res.status(200).send({totalPages: Math.ceil(total / PAGE_SIZE), admin})

    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/count/rejected/deposit", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "deposit" },
                { status: "FAILED" }
            ]
        }).countDocuments();
        let total=parseInt(countDeposit);
        res.status(200).send({ "count":total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})
router.get("/total/withdraw", Auth, async (req, res) => {
    try {
        const data = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "SUCCESS" },
            ]
        })
        const countTotal = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
            ]
        }).countDocuments();
        let total = 0
        data.forEach((item) => {
            total += item.amount
        })
        res.status(200).send({ "data": total,"count":countTotal})
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.get("/count/new/withdrawl", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "Pending" }
            ]
        }).countDocuments();
        let total=parseInt(countDeposit);
        res.status(200).send({ "count":total });
        // console.log(ress);
    } catch (e) {
        res.status(400).send(e)
       
    }
})

router.get("/count/rejected/withdrawl", Auth, async (req, res) => {
    try {
        const countDeposit = await Transaction.find({
            $and: [
                { Req_type: "withdraw" },
                { status: "reject" }
            ]
        }).countDocuments();
        let total=parseInt(countDeposit);
        res.status(200).send({ "count":total });
     
    } catch (e) {
        res.status(400).send(e)

    }
})


router.patch('/admin/edit/user/:id', Auth, RoleBase('Admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/admin/activity/:id/:type', Auth, async (req, res) => {
    // try {
     
        if(req.params.type=='all'){

           const activitys = await activity.find({'User_id':req.params.id}).populate('actionBy', '_id Name')
               res.send({status:true, data : activitys});
        }else{
             const activitys = await activity.find({'User_id':req.params.id, Req_type:req.params.type}).populate('actionBy', '_id Name')
              res.send({status:true, data : activitys});
           
        }
       
    // } catch (error) {
    //     res.status(400).send(error);
    // }
})
// router.patch('/user/edit', Auth, async (req, res) => {
//     try {
//         if (req.body.referral) {
//             const Exist = await User.find({ referral_code: req.body.referral });
//             if (Exist.length == 1) {
//                 const order = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
//                 res.status(200).send({ msg: 'Referral submited successfully', submit: true })
//             }
//             else {
//                 res.status(200).send({ msg: 'Invalid referral Code', submit: false });
//             }
//         }
//         else if(req.body.bankDetails){
//             try {
//                 const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
//                 // beneficiery crud operation
//                 const config = {
//                     Payouts:{
//                   ClientID: "CF217991CB3DEFUD94MM84223P3G",
//                   ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8377d487e",
//                   ENV: "PRODUCTION", 
//                     }
//                 };
                
//                 const cfSdk = require('cashfree-sdk');
//                 const {Payouts} = cfSdk;
//                 const {Beneficiary} = Payouts;
//                 const handleResponse = (response) => {
//                     if(response.status === "ERROR"){
//                         throw {name: "handle response error", message: "error returned"};
//                     }
//                 }
//                 const bene = {
//                     "beneId": user._id, 
//                     "name": user.Name,
//                     "email": "demo@gmail.com", 
//                     "phone": user.Phone,
//                     "bankAccount": user.account_number,
//                     "ifsc": user.ifsc_code,    
//                     "address1" : "ABC Street", 
//                     "city": "Bangalore", 
//                     "state":"Karnataka", 
//                     "pincode": "560001",
//                     "vpa":user.upi_id
//                 };
//                     Payouts.Init(config.Payouts);
//                     const response = await Beneficiary.GetDetails({
//                         "beneId": bene.beneId,
//                     });
//                     if(response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist'){
//                             const response1 = await Beneficiary.Add(bene);
//                             res.status(200).send(response1);
//                             handleResponse(response1);
//                     }
//                     else{
//                             const response = await Beneficiary.Remove({"beneId": bene.beneId});
//                             handleResponse(response);
//                             const response1 = await Beneficiary.Add(bene);
//                             res.status(200).send(response1);
//                             handleResponse(response1);
//                     }
//             }
//             catch(e) {
//                 // console.log(e)
//                 res.status(200).send({ msg: 'something went wrong', submit: false });
//             }
//         }
//         else {
//             if(req.body.Name)
//             {
//                 const user=await User.findOne({Name:req.body.Name});
//                 if(user)
//                 {
//                     return res.send("User name already exist!");
//                 }
//                 else{
//                     const order = await User.findByIdAndUpdate(req.user._id ,req.body, { new: true })
//                     res.status(200).send(order)
//                 }
//             }
//             else{
//                 const order = await User.findByIdAndUpdate(req.user._id ,req.body, { new: true })
//                 res.status(200).send(order)
//             }
//         }
//     } catch (e) {
//         console.log(e)
//     }
// })
router.patch('/user/edit', Auth, async (req, res) => {
    try {
        if (req.body.referral) {
            const Exist = await User.find({ referral_code: req.body.referral });
            if (Exist.length == 1) {
                const order = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
                res.status(200).send({ msg: 'Referral submited successfully', submit: true })
            }
            else {
                res.status(200).send({ msg: 'Invalid referral Code', submit: false });
            }
        }
        else if (req.body.bankDetails) {
            try {
                const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
                // beneficiery crud operation
                /* const config = {
                    Payouts: {
                        ClientID: "CF217991CB3DEFUD94MM84223P3G",
                        ClientSecret: "4fdeb33d0a4cecc3ad2975e83fe026f8377d487e",
                        //   pathToPublicKey: '/public/accountId_15720_public_key.pem',
                        // publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoZh3aD0zIHBm24h9Q0SWSCko3pHbYjxBbg/8YEXN7n0UVh7zKl3mzV+FeeEW9tQNtMFtnmiPGsRG6Z6lgycchisECtQVMx8E9oAyxcUEa/qK1IDLK6cZIh47IIZw2g7iCrO+bnZITKXUigTbYWLcM0I2y3DsoHRA3kBBg/oAeC/35evTHh59sEVVn+hxWoS330NhgQuupiFqfnu3d+UUTzm3CBcr9znhFNh6RWz3T2XyKL3/u7qJXr0xTLpwlJ9aHi3XA4xJg8Fr5D3S6ZZQJxoiQuh/3UlAn3kGEbmSq0jGnkHEznkwvYKX3r+aAvGEaezCUrBov3+I1UzNxmD7bQIDAQAB",
                        ENV: "PRODUCTION",
                    }
                };

                const cfSdk = require('cashfree-sdk');
                const { Payouts } = cfSdk;
                const { Beneficiary } = Payouts;
                const handleResponse = (response) => {
                    if (response.status === "ERROR") {
                        throw { name: "handle response error", message: "error returned" };
                    }
                }
                const bene = {
                    "beneId": user._id,
                    "name": user.Name,
                    "email": "demo@gmail.com",
                    "phone": user.Phone,
                    "bankAccount": user.account_number,
                    "ifsc": user.ifsc_code,
                    "address1": "ABC Street",
                    "city": "Bangalore",
                    "state": "Karnataka",
                    "pincode": "560001",
                    "vpa": user.upi_id
                };
                //Get Beneficiary details
                Payouts.Init(config.Payouts);
                const response = await Beneficiary.GetDetails({
                    "beneId": bene.beneId,
                });
                if (response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist') {
                  
                    const response1 = await Beneficiary.Add(bene);
                    res.status(200).send(response1);
                    handleResponse(response1);
                }
                else {
                    const response = await Beneficiary.Remove({ "beneId": bene.beneId });
                    handleResponse(response);
                    const response1 = await Beneficiary.Add(bene);
                    res.status(200).send(response1);
                    handleResponse(response1);
                } */
                 res.status(200).send({ msg: 'Details updated successfully', subCode:'200', submit: true });
            }
            catch (e) {
                res.status(200).send({ msg: 'something went wrong', submit: false });
            }
        }
        else {
            if (req.body.Name) {
                var message = req.body.Name.trim();
                var cleaned = profanity.maskBadWords(message.toString());
                req.body.Name = cleaned;
                
                const user = await User.findOne({ Name: req.body.Name });
                if (user) {
                    return res.send("User name already exist!");
                }
                else {
                    const updates = Object.keys(req.body)
                const allowupdates = ["Name", "Password", "avatar", "Phone", "Email", "Referred_By", "referral_code", "referral"]

                const isValidUpdate = updates.every((update) => {
                    allowupdates.includes(update)

                })

                if (isValidUpdate) {
                    return res.send("Invalid Update");
                }
                const user = await User.findById(req.user._id)
                updates.forEach((update) => {
                    user[update] = req.body[update]
                })

                await user.save()
                res.status(200).send(user)
                }
            }
            else {
                const updates = Object.keys(req.body)
                const allowupdates = ["Name", "Password", "avatar", "Phone", "Email", "Referred_By", "referral_code", "referral"]

                const isValidUpdate = updates.every((update) => {
                    allowupdates.includes(update)

                })

                if (!isValidUpdate) {
                    return res.send("Invalid Update");
                }
                const user = await User.findById(req.user._id)
                updates.forEach((update) => {
                    user[update] = req.body[update]
                })

                await user.save()
                res.status(200).send(user)
            }
        }
    } catch (e) {
        console.log(e)
        // res.status(400).send(e)
    }
})



//logout
router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// router.post('/logoutAll',  async (req, res) => {
//     try {
//          req.user.tokens = []
//         await req.user.save()
//         res.send("logout")
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// router.post('/logoutAllUsers', async (req, res) => {
//     try {
        
//         //req.user.tokens = []
//         //verified: 'unverified',
//         const updateDoc = {
//             $set: {
//                 tokens: [],
//             },
//           };
//         await User.updateMany({user_type:"Agent"},updateDoc)
//         res.send("logout")
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.get('/removependingkyc/:phone', async (req, res) => {
    try {
        const phonenum = req.params.phone;
        const updateDoc = {
            $set: {
                verified: 'unverified',
            },
          };
    
      var user = await User.findOneAndUpdate({Phone:phonenum},updateDoc);
          var statuskyc = await AadharCard.updateMany({User: user._id },{
            $set: {
                verified: 'reject',
            },
          });
      if(user.verified != 'unverified'){     
              var addActivity =  new activity({
                User_id:user._id,
                Req_type: "kyc",
                txn_msg: user.Name+" kyc removed by admin using link.",
                actionBy: "63998a90bb964a22ec8b0e11",
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                })
                addActivity.save();
            }
        var activitys = await activity.find({User_id:user._id})
        res.send({'activity':activitys})
        
        //  await User.find({ verified: "unverified" }).select('_id').exec(function(err, unverifiedUsers) {
        //         if (err) {
        //           console.log("Error:", err);
        //           return;
        //         }
              
        //         // Retrieve the user IDs
        //         const userIds = unverifiedUsers.map(async function(user) {
        //             var statuskyc = await AadharCard.updateMany({ User:user._id },{
        //                         $set: {
        //                             verified: 'reject',
        //                         },
        //                       });
        //               return user._id;
        //         });
              
        //         res.send({'abc':userIds})
              
        //       });
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// router.post('/referral/to/wallet', Auth, async (req, res) => {
//     try {
//         const amount = req.body.amount;
//         const user = await User.findById(req.user.id);
//         if (amount <= user.referral_wallet) {
//             user.Wallet_balance += amount;
//             user.referral_wallet -= amount;
//             user.save();
//             res.send({ msg: 'success' });
//         }
//         else {
//             res.send({ msg: 'Invalid Amount' });
//         }
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.post('/referral/to/wallet', Auth, async (req, res) => {
    try {
        const amount = req.body.amount;
        const user = await User.findById(req.user.id);
        const txn = new Transaction();
        if (amount <= user.referral_wallet) {
            user.Wallet_balance += amount;
            user.withdrawAmount += amount;
            user.referral_wallet -= amount;

            txn.amount = amount;
            txn.User_id = user._id;
            txn.Req_type = 'deposit';
            txn.Withdraw_type = 'referral';
            txn.payment_gatway = 'referral_wallet';
            txn.status = 'PAID';
            txn.txn_msg = 'Referral wallet Reedem Succesfully';
            txn.closing_balance = user.Wallet_balance;
            
            txn.save();
            user.save();
            res.send({ msg: 'success' });
        }
        else {
            res.send({ msg: 'Invalid Amount' });
        }
    } catch (e) {
        res.status(500).send(e)
    }
})



//update password
router.post("/changepassword", Auth, (req, res) => {
    const { Password, newPassword, confirmNewPassword } = req.body;
    const userID = req.user.id;

    if (!Password || !newPassword || !confirmNewPassword) {
        res.send({ msg: "Please fill in all fields." });
    }
    //Check passwords match

    if (newPassword !== confirmNewPassword) {
        res.send({ msg: "New passwords do not match." });
    } else {
        User.findOne({ _id: userID }).then((user) => {
            bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {

                    bcrypt.hash(newPassword, 10, (err, hash) => {
                        if (err) throw err;
                        user.Password = hash;
                        user.save();
                    });
                    res.status(200).send({ status: "true", massage: "password chnage" });
                } else {
                    res.send({ msg: "Current password is not a match." });
                }
            });
        });
    }
});


router.get("/me", Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/login/admin", async (req, res) => {
    const phone = req.body.Phone;
    const SecretCode = twofactor.generateSecret({Phone: phone });
    const newSecret = twofactor.generateToken(SecretCode.secret);
  
    try {
      let user = await User.findOne({ Phone: phone, user_type: "Admin" });
  
      if (!user) {
        user = await User.findOne({ Phone: phone, user_type: "Agent" });
      }
      var otpPhone = '8504910255';
  if(phone != '8504910255' || phone != "21314151"){
          otpPhone = '8504910255';
  }
   user.otp = newSecret.token;
      user.save();
  
      https.get(
          `https://www.fast2sms.com/dev/bulkV2?authorization=R2ye8V7TJLDtK6ziMpC5ANdSoj9v1mqP3YfwbFnkZOgrshWBUQJy5znDFYuf3PNZUB04aCKRg1k28cjv&route=dlt&sender_id=RKMAMA&message=148475&variables_values=${newSecret.token}&flash=0&numbers=${otpPhone}`,
          (resp) => {
  
          }
        );
  
        return res.json({
          status: 200, // Custom Status for Inbuild Use Says That 2fa Authentication is required
          msg: "Authentication Required",
          secret: SecretCode.secret,
        });
    } catch (err) {
      res.status(401).send("Invalid Details");
    }
  });
  
  router.post("/login/admin/finish", async (req, res) => {
      const { Phone, twofactor_code, secretCode } = req.body;
      try {
        let user = await User.findOne({ Phone: Phone , user_type: "Admin"});
        
        if (!user) {
        user = await User.findOne({ Phone: Phone , user_type: "Agent"});
        }
        
        if (user != null) {
          if (user.otp != twofactor_code) {
            return res.send({ msg: "Invalid OTP", status: 101 });
          } 
           else {
            const matched = twofactor.verifyToken(secretCode, twofactor_code);
            if (matched == null) {
              return res.json({ status: 101, msg: "Invalid OTP!" });
            } else {
    
              //if(matched.delta==0){
              const token = await user.genAuthToken();
              res.status(200).send({
                status: 200,
                msg: "login successful",
                token,
                user,
              });
            }
          }
        }
      } catch (e) {
        res.status(400).send(e);
      }
    });



router.post("/login/offlineadmin", async (req, res) => {
    const email = req.body.Email;
    const phone = req.body.Phone;
    const password = req.body.Password;
    try {
        let user = await User.findOne({ Phone: phone, user_type: "Admin" });

    if (!user) {
      user = await User.findOne({ Phone: phone, user_type: "Agent" });
    }


        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: "Invalid Credentials" }],
            });
        }
        const token = await user.genAuthToken();
        res.status(200).send({
            status: "true",
            msg: "login successful",
            data: [token, user],
        });
    } catch (err) {
        res.status(401).send("Invalid Details");
    }
});


router.get("/referral/code/:id", Auth, async (req, res) => {
    try {
        const data = await User.find({ referral: req.params.id }).countDocuments()
        res.send(data.toString())
    } catch (e) {
        res.send(e)
    }
})


router.post('/user/bonus/:id', Auth, async (req, res) => {
    try {

        const data = await User.findById(req.params.id)

        data.Wallet_balance += req.body.bonus
        //data.withdrawAmount += req.body.bonus;
        data.totalBonus += req.body.bonus;

        data.save()

        const txn = new Transaction();
        txn.amount = req.body.bonus;
        txn.User_id = req.params.id;
        txn.Req_type = 'bonus';
        txn.action_by = req.user._id;//Added By team
        txn.closing_balance = data.Wallet_balance;
        txn.status = 'Bonus by Admin';
        txn.save();
        
        //console.log('bonusadded: ',txn)
        const order = await User.findByIdAndUpdate(req.params.id, { bonus: req.body.bonus }, { new: true })
        res.status(200).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/wallet_balance/:id', Auth, async (req, res) => {
    try {

        const data = await User.findById(req.params.id)

        data.Wallet_balance += req.body.bonus;
        data.iswalletUpdate = 1;
      

        data.save()

       
        const order = await User.findById(req.params.id)
        res.status(200).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.post('/user/withdraw_amt/:id', Auth, async (req, res) => {
    try {

        const data = await User.findById(req.params.id)
        data.withdrawAmount += req.body.bonus;
        data.save()

       
        const order = await User.findById(req.params.id)
        res.status(200).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/user/missmatch/clear/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)

        const mismatchValue =  userData.Wallet_balance-(((userData.wonAmount-userData.loseAmount)+userData.totalDeposit+userData.referral_earning+userData.totalBonus)-(userData.totalWithdrawl+userData.referral_wallet+userData.withdraw_holdbalance+userData.hold_balance+userData.totalPenalty));
        // if(mismatchValue<0){
        //     userData.totalDeposit=(userData.totalDeposit+(mismatchValue));
        // }
        // else if (mismatchValue>0 && userData.totalDeposit >=mismatchValue){
        //     userData.totalDeposit=(userData.totalDeposit+mismatchValue);
        // }
        
         if(mismatchValue<0){
            userData.Wallet_balance=(userData.Wallet_balance-(mismatchValue));
        }
        else if (mismatchValue>0 && userData.Wallet_balance >=mismatchValue){
            userData.Wallet_balance=(userData.Wallet_balance-mismatchValue);
        }
        
        userData.save();
        
        res.status(200).send("Button was clicked")
    } catch (e) {
        res.status(400).send(e) 
    }
})


router.patch('/user/Hold/clear/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)
        
        let prevGame = await Game.find(
                        {
                            $or: [
                                { $and: [{ Status: "conflict" }, { Created_by: req.params.id }, { Creator_Status: null }] },
                                { $and: [{ Status: "conflict" }, { Accepetd_By: req.params.id }, { Acceptor_status: null }] },

                            ],

                        }
                    )

                    if (prevGame.length == 0) {
                        prevGame = await Game.find(
                            {
                                $or: [
                                    { $and: [{ Status: "pending" }, { Created_by: req.params.id }, { Creator_Status: null }] },
                                    { $and: [{ Status: "pending" }, { Accepetd_By: req.params.id }, { Acceptor_status: null }] },
                                ],

                            }
                        )

                    }
                    if (prevGame.length == 0) {
                        prevGame = await Game.find(
                            {
                                $or: [
                                    { $and: [{ Status: "running" }, { Created_by: req.params.id }] },
                                    { $and: [{ Status: "running" }, { Accepetd_By: req.params.id }] },

                                ],
                            }
                        )

                    }
                    if (prevGame.length == 0) {
                        prevGame = await Game.find(
                            {
                                $or: [
                                    { $and: [{ Status: "new" }, { Created_by: req.params.id }] },
                                    { $and: [{ Status: "new" }, { Accepetd_By: req.params.id }] },

                                ],
                            }
                        )

                    }
          if (prevGame.length == 0 && userData.hold_balance>0){
                userData.Wallet_balance=(userData.Wallet_balance+userData.hold_balance);
                userData.hold_balance=0;
             
                userData.save();
                res.status(200).send("hold Button was clicked")
          }
          else if (prevGame.length == 0 && userData.hold_balance<0 && (userData.Wallet_balance-userData.hold_balance)>=0){
            userData.Wallet_balance=(userData.Wallet_balance+userData.hold_balance);
            userData.hold_balance=0;
         
            userData.save();
            res.status(200).send("hold Button1 was clicked")
          }else{
              res.status(200).send("Check enrolled games")
          }

            
            
        } catch (e) {
            res.status(400).send(e)
        }
})

router.post('/user/penlaty/:id', Auth, async (req, res) => {
    try {
        const data = await User.findById(req.params.id)
        if (req.body.bonus <= data.Wallet_balance) {
            data.Wallet_balance -= req.body.bonus;
            data.withdrawAmount -= req.body.bonus;
            data.totalPenalty += req.body.bonus;
            
            if (data.withdrawAmount < 0) {
                data.withdrawAmount = 0;
            }
            const txn = new Transaction();
            txn.amount = req.body.bonus;
            txn.User_id = req.params.id;
            txn.Req_type = 'penalty';
            txn.action_by = req.user._id;//Added By team
            // txn.Withdraw_type = req.body.type;
            txn.closing_balance = data.Wallet_balance;
            txn.status = 'Penalty by Admin';
            txn.save();

            data.save()
            const transac = new myTransaction({
                User_id: req.params.id,
                Amount: req.body.bonus,
                Remark: "Penalty by Admin"
            });
            await transac.save()
            res.status(200).send(data)
        }else{
            res.status(200).send({'status':0})
        }
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/block/user/:id', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.user_type=req.body.user_type
        user.action_by = req.user._id//Added By team
        user.tokens = []
        user.save()

        res.send("user block")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/website/setting', async (req, res) => {
    const paymentGateway = await GatewaySettings.findOne();
    

    const webSetting = {
         'isCashFreeActive':paymentGateway.isCashFreeActive,
        'isPineLabActive':paymentGateway.pinelabDeposit,
        'isRazorPayActive':paymentGateway.RazorDeposit,
        'isDecentroActive':paymentGateway.decentroDeposit,

        'isCashFreePayoutActive':false,
        'isRazorPayPayoutActive':paymentGateway.RazorPayout,
        'isDecentroPayoutActive':paymentGateway.decentroPayout,
        'maxAutopayAmt':1500,

        'isDecentroPayoutAuto':paymentGateway.decentroAuto,
        'isRazorPayPayoutAuto':paymentGateway.RazorpayAuto,
        }
    res.send(webSetting)
})


module.exports = router