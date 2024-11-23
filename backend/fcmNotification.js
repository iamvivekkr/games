const axios = require('axios')


async function sendFireBaseNOtificationFCM (registrationToken , message, options=null ){

    // console.log("fcm")
    // console.log(registrationToken , message)
    const body = {
        "registration_ids":registrationToken,
        "notification":message
    } 
    await axios.post("https://fcm.googleapis.com/fcm/send", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAKLVrs-g:APA91bHUApoaqh7HgMwnpZXs9CGPLJmmscpHT8dPnH6prsekc4doUd5EMUK3mhFhVkh-W7KcnuahbRAuSgn2Ows-TwLYa-15zbO0sPaVHqO97zTZPaO7Vur7-wCw9hhpgsqjnMH8xTr0'
        }
    }).then(
        (response) => {
            // console.log(response.data , 'j')
        },
        (error) => {
            console.log(error , 'e')
        }
    );
}



exports.sendFireBaseNOtificationFCM = sendFireBaseNOtificationFCM