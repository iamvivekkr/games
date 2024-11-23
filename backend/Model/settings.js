const mongoose = require("mongoose")

const SiteSettingsSchema = new mongoose.Schema({
    WebTitle:{
        type: String,
        default: ''
    },
    WebsiteName: {
        type: String,
        default: null
    },
    CompanyName: {
        type: String,
        default: null
    },
    CompanyMobile: {
        type: String,
        default: null
    },
    CompanyMobile2: {
        type: String,
        default: null
    },
    CompanyAddress: {
        type: String,
        default: null
    },
    Logo: {
        type: String,
        default: null
    },
    SmallLogo: {
        type: String,
        default: null
    },
    LandingImage1: {
        type: String,
        default: null
    },
    LandingImage2: {
        type: String,
        default: null
    },
    LandingImage3: {
        type: String,
        default: null
    },
    LandingImage4: {
        type: String,
        default: null
    },
    isLandingImage1: {
        type: Boolean,
        default: false
    },
    isLandingImage2: {
        type: Boolean,
        default: false
    },
    isLandingImage3: {
        type: Boolean,
        default: false
    },
    isLandingImage4: {
        type: Boolean,
        default: false
    },
    version: {
        type: String,
        default: null
    },
    site_message: {
        type: String,
        default: null
    },
    ludoClassicAutoMsg: {
        type: String,
        default: null
    },
    ludoClassicAutobattleMsg: {
        type: String,
        default: null
    },
    ludoClassicManualMsg: {
        type: String,
        default: null
    },
    ludoClassicManualBattleMsg: {
        type: String,
        default: null
    },
   
    userCanLogin: {
        type: Boolean,
        default: false
    },
    ludokingClassic: {
        type: String,
        default: null
    },
    ludokingHost: {
        type: String,
        default: null
    },
    ludokingPopular: {
        type: String,
        default: null
    },
    ludoking1G: {
        type: String,
        default: null
    },
    ludokingSnake: {
        type: String,
        default: null
    },
    rkludoClassic: {
        type: String,
        default: null
    },
    rkludoPopular: {
        type: String,
        default: null
    },
    rkludo1G: {
        type: String,
        default: null
    },
    ludokingroomcodeURL: {
        type: String,
        default: null
    },
    ludokingPopularroomcodeURL: {
        type: String,
        default: null
    },

    ludokingHostroomcodeURL: {
        type: String,
        default: null
    },
    ludoking1GroomcodeURL: {
        type: String,
        default: null
    },
    ludokingSnakeroomcodeURL: {
        type: String,
        default: null
    },
    
    isLudokingroomcode: {
        type: Boolean,
        default: false
    },
    isLudokingPopularroomcode: {
        type: Boolean,
        default: false
    },
    isLudokingHostroomcode: {
        type: Boolean,
        default: false
    },
    isLudoking1Groomcode: {
        type: Boolean,
        default: false
    },
    isLudokingSnakeroomcode: {
        type: Boolean,
        default: false
    },
    
    isLudokingClassic: {
        type: Boolean,
        default: false
    },
    isLudokingPopular: {
        type: Boolean,
        default: false
    },
    isLudokingHost: {
        type: Boolean,
        default: false
    },
    isLudoking1G: {
        type: Boolean,
        default: false
    },
    isLudokingSnake: {
        type: Boolean,
        default: false
    },
    isRkludoClassic: {
        type: Boolean,
        default: false
    },
    isRkludoPopular: {
        type: Boolean,
        default: false
    },
    isRkludo1G: {
        type: Boolean,
        default: false
    },
    gameSearch: {
        type: Boolean,
        default: false
    },
    isDeposit: {
        type: Boolean,
        default: false
    },
    isWithdrawal: {
        type: Boolean,
        default: false
    },
    isUpiWithdrawal: {
        type: Boolean,
        default: false
    },
    isBankWithdrawal: {
        type: Boolean,
        default: false
    },
    depositlimitMin: {
        type: Number,
        default: 10
    },
    depositlimitMax: {
        type: Number,
        default: 50000
    },
    withdrawalLimitMin: {
        type: Number,
        default: 95
    },
    withdrawalLimitMax: {
        type: Number,
        default: 500
    },
    autoWithdrawalLimitMax: {
        type: Number,
        default: 100
    },
    siteMaintenance: {
        type: Boolean,
        default: true
    },
    gameTDS: {
        type: Number,
        default: 30
    },
    isReferral: {
        type: Boolean,
        default: true
    },
    referralCommission: {
        type: Number,
        default: 7
    },
    commissionRange1: {
        type: Number,
        default: 7
    },
    commissionRange2: {
        type: Number,
        default: 5
    },
    commissionRange3: {
        type: Number,
        default: 2
    },
    supportMail: {
        type: String,
        default: null
    },
    supportInstagram: {
        type: String,
        default: null
    },
    supportTelegram: {
        type: String,
        default: null
    },
    whatsappSupport: {
        type: String,
        default: null
    },
    isChatSupport: {
        type: Boolean,
        default: false
    }
})

const SiteSettings = mongoose.model("SiteSettings",SiteSettingsSchema)
module.exports = SiteSettings