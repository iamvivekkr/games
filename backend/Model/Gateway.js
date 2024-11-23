const mongoose = require("mongoose")

const GatewaySettingSchema = new mongoose.Schema({
    RazorPayout:{
        type: Boolean,
        default: null
    },
    RazorDeposit:{
        type: Boolean,
        default: null
    },
    RazorpayAuto:{
        type: Boolean,
        default: null
    },
    decentroPayout:{
        type: Boolean,
        default: null
    },
    decentroDeposit:{
        type: Boolean,
        default: null
    },
    pinelabDeposit:{
        type: Boolean,
        default: null
    },
    decentroAuto:{
        type: Boolean,
        default: null
    },
    RazorPayKey:{
        type: String,
        default: null
    },
    RazorPaySecretKey:{
        type: String,
        default: null
    },
    AccountName:{
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: '1'
    },
    isCashFreeActive: {
        type: Boolean,
        default: false
    },
    maxAutopayAmt: {
        type: Number,
        default: 100
    },
       isPayNowOne: {
        type: Boolean,
        default: false
    },
    isPayNowTwo: {
        type: Boolean,
        default: false
    },
    isPayNowThree: {
        type: Boolean,
        default: false
    },
    isPayNowFour: {
        type: Boolean,
        default: false
    },
    isPayNowFive: {
        type: Boolean,
        default: false
    },
    isPayOneImage: {
        type: String,
        default: ''
    },
    isPayTwoImage: {
        type: String,
        default: ''
    },
    isPayThreeImage: {
        type: String,
        default: ''
    },
    isPayFourImage: {
        type: String,
        default: ''
    },
    isPayFiveImage: {
        type: String,
        default: '1'
    }

})

const GatewaySettings = mongoose.model("GatewaySettings",GatewaySettingSchema)
module.exports = GatewaySettings