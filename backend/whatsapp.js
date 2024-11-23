const axios = require('axios')


async function sendWhatsappNotification (to , template, perms,  options=null ){

  var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": to,
    "type": "template",
    "template": {
      "name": template,
      "language": {
        "code": "en_US",
        "policy": "deterministic"
      },
      "components": [
        {
          "type": "body",
          "parameters": perms
        }
      ]
    }
  });
  
  var config = {
    method: 'post',
    url: 'https://graph.facebook.com/v15.0/110913541841387/messages',
    headers: { 
      'Authorization': 'Bearer aEAApamsexzqkBACl7LXOMNdAFZAgHSvaqyJCyy2St5ZCBLGRjlQhJTdYgrDjjZBvmaBcu4sdCrIjKxf8o40achoNVrAHDUEaLCiuGfprtcVEbPAWTLx4Ki4l6qI2H3lIbj8SKAzjQzjLsaNMMfneshaxgs4qo12X97OeDm6oAiCOxveKI3eVZBF5KlwNSOv3LlZCA9aPsRvAZDZD', 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}



exports.sendWhatsappNotification = sendWhatsappNotification