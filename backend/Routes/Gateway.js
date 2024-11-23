const express = require("express");
const GatewaySettings = require("../Model/Gateway");
const router = express.Router();
const mongoose = require("mongoose");

const { findById, findOne } = require("../Model/settings");
const { send } = require("process");

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/gatewaysettings", async (req, res) => {
  try {
    if (req.body.settingId) {
      const updatesetting = await GatewaySettings.findById(req.body.settingId);
      updatesetting.RazorPayout = req.body.RazorPayout;
      updatesetting.RazorDeposit = req.body.RazorDeposit;
      updatesetting.RazorpayAuto = req.body.RazorpayAuto;
      updatesetting.decentroPayout = req.body.decentroPayout;
      updatesetting.decentroDeposit = req.body.decentroDeposit;
      updatesetting.decentroAuto = req.body.decentroAuto;
      updatesetting.RazorPayKey = req.body.RazorPayKey;
      updatesetting.RazorPaySecretKey = req.body.RazorPaySecretKey;
      updatesetting.AccountName = req.body.AccountName;
      updatesetting.pinelabDeposit = req.body.pinelabDeposit;
      (updatesetting.isCashFreeActive = req.body.isCashFreeActive),
        (updatesetting.otp = req.body.otp);

      updatesetting.save();
      res.send({ status: "success", data: updatesetting });
    } else {
      const data = new GatewaySettings({
        RazorPayout: req.body.RazorPayout,
        RazorDeposit: req.body.RazorDeposit,
        RazorpayAuto: req.body.RazorpayAuto,
        decentroPayout: req.body.decentroPayout,
        decentroDeposit: req.body.decentroDeposit,
        decentroAuto: req.body.decentroAuto,
        RazorPayKey: req.body.RazorPayKey,
        RazorPaySecretKey: req.body.RazorPaySecretKey,
        AccountName: req.body.AccountName,
        pinelabDeposit: req.body.pinelabDeposit,
        isCashFreeActive: req.body.isCashFreeActive,
        otp: req.body.otp,
      });

      const val = await data.save();
      res.send({ status: "success", data: val });
    }
  } catch (err) {
    res.send(err);
    res.send({ status: "failed", data: err });
  }
});

router.post(
  "/gatewaysettings/change_qr",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { status, image_type } = req.body;
      const updatesetting = await GatewaySettings.findOne({});

      if (typeof req.files.image !== "undefined") {
        fs.access("./public/icon", (error) => {
          if (error) {
            fs.mkdirSync("./public/icon");
          }
        });
        const { buffer, originalname } = req.files.image[0];
        const uniqueSuffix =
          Date.now() + "-1-" + Math.round(Math.random() * 1e9);

        const ref = `${uniqueSuffix}.png`;
        //console.log(buffer);
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile("./public/icon/" + ref);
        console.error(
          "https://service-v1.rkadda.com/public/icon/" + ref,
          image_type
        );
        if (image_type == "PayNowOne") {
          updatesetting["isPayOneImage"] = "public/icon/" + ref; //req.files.Logo[0].path
        } else if (image_type == "PayNowTwo") {
          updatesetting["isPayTwoImage"] = "public/icon/" + ref;
        } else if (image_type == "PayNowThree") {
          updatesetting["isPayThreeImage"] = "public/icon/" + ref;
        } else if (image_type == "PayNowFour") {
          updatesetting["isPayFourImage"] = "public/icon/" + ref;
        } else {
          updatesetting["isPayFiveImage"] = "public/icon/" + ref;
        }
      }
      if (image_type == "PayNowOne") {
        updatesetting["isPayNowOne"] = status;
      } else if (image_type == "PayNowTwo") {
        updatesetting["isPayNowTwo"] = status;
      } else if (image_type == "PayNowThree") {
        updatesetting["isPayNowThree"] = status;
      } else if (image_type == "PayNowFour") {
        updatesetting["isPayNowFour"] = status;
      } else {
        updatesetting["isPayNowFive"] = status;
      }
      updatesetting[image_type] = status;
      await updatesetting.save();
      res.send({ status: "success", data: updatesetting });
    } catch (err) {
      console.log(err);
      res.send({ status: "failed", data: err });
    }
  }
);
router.get("/gatewaysettings/data", async (req, res) => {
  try {
    const data = await GatewaySettings.findOne();
    console.log({ data });
    res.send(data);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
