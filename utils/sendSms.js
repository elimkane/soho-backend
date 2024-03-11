

const accountSid = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendSms(text,number){
    client.messages
        .create({
            body: text,
            from: '+15058145004',
            to: number
        })
        .then(message => console.log(message.sid));
}

async function sendOtpSms(number,otpCode){
   await sendSms(`Bonjour votre code otp est : ${otpCode}`,number);
}

module.exports = {
    sendOtpSms
}

