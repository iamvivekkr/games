require("dotenv").config(); // Ensure to load environment variables

const axios = require("axios");

class SmsService {
  constructor() {
    this.apiKey = encodeURIComponent(process.env.API_KEY);
    this.apiSender = process.env.API_SENDER;
    this.entityId = "1101442370000075992";
    this.templateId = "1107171851093422866";
  }

  async sendSms(num, otp) {
    try {
      const msg = `${otp} is your One-Time Password (OTP)-Sky Marketing`;
      const ms = encodeURIComponent(msg);

      const url = `https://www.smsc.co.in/api/mt/SendSMS?APIKey=${this.apiKey}&senderid=${this.apiSender}&channel=2&DCS=0&flashsms=0&number=${num}&text=${ms}&route=44&EntityId=${this.entityId}&dlttemplateid=${this.templateId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to send OTP");
    }
  }
}

module.exports = SmsService;
