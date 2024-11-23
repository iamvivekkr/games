const SiteSettings = require("../Model/settings");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { findById, findOne } = require("../Model/settings");
const { send } = require("process");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/icon")
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// })

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
//         fieldSize: 100000000
//     }
// })

router.post(
  "/settings",
  upload.fields([
    { name: "Logo", maxCount: 1 },
    { name: "SmallLogo", maxCount: 1 },
    { name: "LandingImage1", maxCount: 1 },
    { name: "LandingImage2", maxCount: 1 },
    { name: "LandingImage3", maxCount: 1 },
    { name: "LandingImage4", maxCount: 1 },
    { name: "ludokingClassic", maxCount: 1 },
    { name: "ludokingHost", maxCount: 1 },
    { name: "ludokingPopular", maxCount: 1 },
    { name: "ludoking1G", maxCount: 1 },
    { name: "ludokingSnake", maxCount: 1 },
    { name: "rkludoClassic", maxCount: 1 },
    { name: "rkludoPopular", maxCount: 1 },
    { name: "rkludo1G", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.error(req.body, "req.body");
      // Update existing settings
      const updatesetting = await SiteSettings.findOne({});
      if (
        typeof req.body.WebTitle !== "undefined" &&
        req.body.WebTitle !== null
      ) {
        updatesetting.WebTitle = req.body.WebTitle;
      }
      if (
        typeof req.body.WebsiteName !== "undefined" &&
        req.body.WebsiteName !== null
      ) {
        updatesetting.WebsiteName = req.body.WebsiteName;
      }
      if (
        typeof req.body.CompanyName !== "undefined" &&
        req.body.CompanyName !== null
      ) {
        updatesetting.CompanyName = req.body.CompanyName;
      }
      if (
        typeof req.body.CompanyAddress !== "undefined" &&
        req.body.CompanyAddress !== null
      ) {
        updatesetting.CompanyAddress = req.body.CompanyAddress;
      }
      if (
        typeof req.body.CompanyMobile !== "undefined" &&
        req.body.CompanyMobile !== null
      ) {
        updatesetting.CompanyMobile = req.body.CompanyMobile;
      }

      // Rest of the update logic...
      if (typeof req.files.Logo !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.Logo[0];
        const uniqueSuffix =
          Date.now() + "-1-" + Math.round(Math.random() * 1e9);

        const ref = `${uniqueSuffix}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref);

        updatesetting.Logo = "public/icon/" + ref; //req.files.Logo[0].path
      }
      if (typeof req.files.SmallLogo !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.SmallLogo[0];
        const uniqueSuffix2 =
          Date.now() + "-2-" + Math.round(Math.random() * 1e9);

        const ref2 = `${uniqueSuffix2}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref2);
        updatesetting.SmallLogo = "public/icon/" + ref2; //req.files.SmallLogo[0].path
      }
      if (typeof req.files.LandingImage1 !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.LandingImage1[0];
        const uniqueSuffix3 =
          Date.now() + "-3-" + Math.round(Math.random() * 1e9);

        const ref3 = `${uniqueSuffix3}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref3);
        updatesetting.LandingImage1 = "public/icon/" + ref3;
      }
      if (typeof req.files.LandingImage2 !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.LandingImage2[0];
        const uniqueSuffix4 =
          Date.now() + "-4-" + Math.round(Math.random() * 1e9);

        const ref4 = `${uniqueSuffix4}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref4);
        updatesetting.LandingImage2 = "public/icon/" + ref4;
      }
      if (typeof req.files.LandingImage3 !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.LandingImage3[0];
        const uniqueSuffix5 =
          Date.now() + "-5-" + Math.round(Math.random() * 1e9);

        const ref5 = `${uniqueSuffix5}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref5);
        updatesetting.LandingImage3 = "public/icon/" + ref5;

        //updatesetting.LandingImage3 = req.files.LandingImage3[0].path
      }
      if (typeof req.files.LandingImage4 !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.LandingImage4[0];
        const uniqueSuffix6 =
          Date.now() + "-6-" + Math.round(Math.random() * 1e9);

        const ref6 = `${uniqueSuffix6}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref6);
        updatesetting.LandingImage4 = "public/icon/" + ref6;

        //updatesetting.LandingImage4 = req.files.LandingImage4[0].path
      }

      if (
        typeof req.body.isLandingImage1 !== "undefined" &&
        req.body.isLandingImage1 !== null
      ) {
        updatesetting.isLandingImage1 = req.body.isLandingImage1;
      }
      if (
        typeof req.body.isLandingImage2 !== "undefined" &&
        req.body.isLandingImage2 !== null
      ) {
        updatesetting.isLandingImage2 = req.body.isLandingImage2;
      }
      if (
        typeof req.body.isLandingImage3 !== "undefined" &&
        req.body.isLandingImage3 !== null
      ) {
        updatesetting.isLandingImage3 = req.body.isLandingImage3;
      }
      if (
        typeof req.body.isLandingImage4 !== "undefined" &&
        req.body.isLandingImage4 !== null
      ) {
        updatesetting.isLandingImage4 = req.body.isLandingImage4;
      }
      if (
        typeof req.body.version !== "undefined" &&
        req.body.version !== null
      ) {
        updatesetting.version = req.body.version;
      }
      if (
        typeof req.body.site_message !== "undefined" &&
        req.body.site_message !== null
      ) {
        updatesetting.site_message = req.body.site_message;
      }
      if (
        typeof req.body.userCanLogin !== "undefined" &&
        req.body.userCanLogin !== null
      ) {
        updatesetting.userCanLogin = req.body.userCanLogin;
      }

      //game setting
      if (
        typeof req.body.isLudokingClassic !== "undefined" &&
        req.body.isLudokingClassic !== null
      ) {
        updatesetting.isLudokingClassic = req.body.isLudokingClassic;
      }
      if (
        typeof req.body.isLudokingPopular !== "undefined" &&
        req.body.isLudokingPopular !== null
      ) {
        updatesetting.isLudokingPopular = req.body.isLudokingPopular;
      }
      if (
        typeof req.body.isLudoking1G !== "undefined" &&
        req.body.isLudoking1G !== null
      ) {
        updatesetting.isLudoking1G = req.body.isLudoking1G;
      }
      if (
        typeof req.body.isLudokingHost !== "undefined" &&
        req.body.isLudokingHost !== null
      ) {
        updatesetting.isLudokingHost = req.body.isLudokingHost;
      }
      if (
        typeof req.body.isLudoking1G !== "undefined" &&
        req.body.isLudoking1G !== null
      ) {
        updatesetting.isLudoking1G = req.body.isLudoking1G;
      }
      if (
        typeof req.body.isLudokingSnake !== "undefined" &&
        req.body.isLudokingSnake !== null
      ) {
        updatesetting.isLudokingSnake = req.body.isLudokingSnake;
      }
      if (
        typeof req.body.isRkludoClassic !== "undefined" &&
        req.body.isRkludoClassic !== null
      ) {
        updatesetting.isRkludoClassic = req.body.isRkludoClassic;
      }
      if (
        typeof req.body.isRkludoPopular !== "undefined" &&
        req.body.isRkludoPopular !== null
      ) {
        updatesetting.isRkludoPopular = req.body.isRkludoPopular;
      }
      if (
        typeof req.body.isRkludo1G !== "undefined" &&
        req.body.isRkludo1G !== null
      ) {
        updatesetting.isRkludo1G = req.body.isRkludo1G;
      }

      //game roomcode status
      if (
        typeof req.body.isLudokingroomcode !== "undefined" &&
        req.body.isLudokingroomcode !== null
      ) {
        updatesetting.isLudokingroomcode = req.body.isLudokingroomcode;
      }
      if (
        typeof req.body.isLudokingPopularroomcode !== "undefined" &&
        req.body.isLudokingPopularroomcode !== null
      ) {
        updatesetting.isLudokingPopularroomcode =
          req.body.isLudokingPopularroomcode;
      }
      if (
        typeof req.body.isLudokingHostroomcode !== "undefined" &&
        req.body.isLudokingHostroomcode !== null
      ) {
        updatesetting.isLudokingHostroomcode = req.body.isLudokingHostroomcode;
      }
      if (
        typeof req.body.isLudoking1Groomcode !== "undefined" &&
        req.body.isLudoking1Groomcode !== null
      ) {
        updatesetting.isLudoking1Groomcode = req.body.isLudoking1Groomcode;
      }
      if (
        typeof req.body.isLudokingSnakeroomcode !== "undefined" &&
        req.body.isLudokingSnakeroomcode !== null
      ) {
        updatesetting.isLudokingSnakeroomcode =
          req.body.isLudokingSnakeroomcode;
      }
      //game roomcode url
      if (
        typeof req.body.ludokingroomcodeURL !== "undefined" &&
        req.body.ludokingroomcodeURL !== null
      ) {
        updatesetting.ludokingroomcodeURL = req.body.ludokingroomcodeURL;
      }
      if (
        typeof req.body.ludokingPopularroomcodeURL !== "undefined" &&
        req.body.ludokingPopularroomcodeURL !== null
      ) {
        updatesetting.ludokingPopularroomcodeURL =
          req.body.ludokingPopularroomcodeURL;
      }
      if (
        typeof req.body.ludoking1GroomcodeURL !== "undefined" &&
        req.body.ludoking1GroomcodeURL !== null
      ) {
        updatesetting.ludoking1GroomcodeURL = req.body.ludoking1GroomcodeURL;
      }
      if (
        typeof req.body.ludokingHostroomcodeURL !== "undefined" &&
        req.body.ludokingHostroomcodeURL !== null
      ) {
        updatesetting.ludokingHostroomcodeURL =
          req.body.ludokingHostroomcodeURL;
      }

      if (
        typeof req.body.ludokingSnakeroomcodeURL !== "undefined" &&
        req.body.ludokingSnakeroomcodeURL !== null
      ) {
        updatesetting.ludokingSnakeroomcodeURL =
          req.body.ludokingSnakeroomcodeURL;
      }

      if (
        typeof req.body.gameSearch !== "undefined" &&
        req.body.gameSearch !== null
      ) {
        updatesetting.gameSearch = req.body.gameSearch;
      }
      if (
        typeof req.body.gameTDS !== "undefined" &&
        req.body.gameTDS !== null
      ) {
        updatesetting.gameTDS = req.body.gameTDS;
      }

      //games images

      if (typeof req.files.ludokingClassic !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.ludokingClassic[0];
        const uniqueSuffix11 =
          Date.now() + "-1-" + Math.round(Math.random() * 1e9);

        const ref11 = `${uniqueSuffix11}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref11);

        updatesetting.ludokingClassic = "public/icon/" + ref11; //req.files.ludokingClassic[0].path
      }
      if (typeof req.files.ludokingPopular !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.ludokingPopular[0];
        const uniqueSuffix12 =
          Date.now() + "-2-" + Math.round(Math.random() * 1e9);

        const ref12 = `${uniqueSuffix12}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref12);
        updatesetting.ludokingPopular = "public/icon/" + ref12; //req.files.ludokingPopular[0].path
      }
      if (typeof req.files.ludoking1G !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.ludoking1G[0];
        const uniqueSuffix13 =
          Date.now() + "-3-" + Math.round(Math.random() * 1e9);

        const ref13 = `${uniqueSuffix13}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref13);
        updatesetting.ludoking1G = "public/icon/" + ref13;
      }
      if (typeof req.files.ludokingHost !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.ludokingHost[0];
        const uniqueSuffix14 =
          Date.now() + "-4-" + Math.round(Math.random() * 1e9);

        const ref14 = `${uniqueSuffix14}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref14);
        updatesetting.ludokingHost = "public/icon/" + ref14;
      }
      if (typeof req.files.ludokingSnake !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.ludokingSnake[0];
        const uniqueSuffix15 =
          Date.now() + "-5-" + Math.round(Math.random() * 1e9);

        const ref15 = `${uniqueSuffix15}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref15);
        updatesetting.ludokingSnake = "public/icon/" + ref15;
      }
      if (typeof req.files.rkludoClassic !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.rkludoClassic[0];
        const uniqueSuffix16 =
          Date.now() + "-6-" + Math.round(Math.random() * 1e9);

        const ref16 = `${uniqueSuffix16}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref16);
        updatesetting.rkludoClassic = "public/icon/" + ref16;
      }
      if (typeof req.files.rkludoPopular !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.rkludoPopular[0];
        const uniqueSuffix17 =
          Date.now() + "-6-" + Math.round(Math.random() * 1e9);

        const ref17 = `${uniqueSuffix17}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref17);
        updatesetting.rkludoPopular = "public/icon/" + ref17;
      }
      if (typeof req.files.rkludo1G !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.rkludo1G[0];
        const uniqueSuffix18 =
          Date.now() + "-6-" + Math.round(Math.random() * 1e9);

        const ref18 = `${uniqueSuffix18}.webp`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref18);
        updatesetting.rkludo1G = "public/icon/" + ref18;
      }

      //commision
      if (
        typeof req.body.commissionRange1 !== "undefined" &&
        req.body.commissionRange1 !== null
      ) {
        updatesetting.commissionRange1 = req.body.commissionRange1;
      }
      if (
        typeof req.body.commissionRange2 !== "undefined" &&
        req.body.commissionRange2 !== null
      ) {
        updatesetting.commissionRange2 = req.body.commissionRange2;
      }
      if (
        typeof req.body.commissionRange3 !== "undefined" &&
        req.body.commissionRange3 !== null
      ) {
        updatesetting.commissionRange3 = req.body.commissionRange3;
      }
      if (
        typeof req.body.referralCommission !== "undefined" &&
        req.body.referralCommission !== null
      ) {
        updatesetting.referralCommission = req.body.referralCommission;
      }
      if (
        typeof req.body.isReferral !== "undefined" &&
        req.body.isReferral !== null
      ) {
        updatesetting.isReferral = req.body.isReferral;
      }

      //deposit
      if (
        typeof req.body.isDeposit !== "undefined" &&
        req.body.isDeposit !== null
      ) {
        updatesetting.isDeposit = req.body.isDeposit;
      }
      if (
        typeof req.body.depositlimitMin !== "undefined" &&
        req.body.depositlimitMin !== null
      ) {
        updatesetting.depositlimitMin = req.body.depositlimitMin;
      }
      if (
        typeof req.body.depositlimitMax !== "undefined" &&
        req.body.depositlimitMax !== null
      ) {
        updatesetting.depositlimitMax = req.body.depositlimitMax;
      }

      //withdral
      if (
        typeof req.body.isWithdrawal !== "undefined" &&
        req.body.isWithdrawal !== null
      ) {
        updatesetting.isWithdrawal = req.body.isWithdrawal;
      }
      if (
        typeof req.body.withdrawalLimitMin !== "undefined" &&
        req.body.withdrawalLimitMin !== null
      ) {
        updatesetting.withdrawalLimitMin = req.body.withdrawalLimitMin;
      }

      if (
        typeof req.body.withdrawalLimitMax !== "undefined" &&
        req.body.withdrawalLimitMax !== null
      ) {
        updatesetting.withdrawalLimitMax = req.body.withdrawalLimitMax;
      }
      if (
        typeof req.body.autoWithdrawalLimitMax !== "undefined" &&
        req.body.autoWithdrawalLimitMax !== null
      ) {
        updatesetting.autoWithdrawalLimitMax = req.body.autoWithdrawalLimitMax;
      }
      if (
        typeof req.body.siteMaintenance !== "undefined" &&
        req.body.siteMaintenance !== null
      ) {
        updatesetting.siteMaintenance = req.body.siteMaintenance;
      }

      updatesetting.save();

      const settings = await SiteSettings.findOne({
        _id: "667698ef721624e214e0136b",
      });
      const io = req.app.get("socketio");
      io.emit("websettingGet", settings);

      res.send({ status: "success", data: updatesetting });
    } catch (err) {
      console.log(err);
      res.send({ status: "failed", data: err });
    }
  }
);

router.get("/settings/data", async (req, res) => {
  // try {
  const settings = await SiteSettings.findOne({
    _id: "6468bd7f223e9c8c7cbed349",
  });
  console.log(settings, "settings");
  res.send(settings);
  // } catch (e) {
  //     res.status(404).send()
  // }
});

module.exports = router;
