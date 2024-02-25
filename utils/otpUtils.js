const {createTransport} = require("nodemailer");


class OtpUtils{
    static  generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }


    // Fonction pour envoyer le code OTP par e-mail
    static async sendOTPEmail(toEmail, otpCode) {
        const transporter = createTransport({
            service: 'gmail', // Exemple: 'Gmail'
            auth: {
                user: 'malick.diallo@ism.edu.sn',
                pass: 'malickbac',
            },
        });

        const mailOptions = {
            from: 'malick.diallo@ism.edu.sn',
            to: toEmail,
            subject: 'Code OTP pour la vérification du compte',
            text: `Votre code OTP est : ${otpCode}`,
        };
        await transporter.sendMail(mailOptions);
    }
}

module.exports = OtpUtils;


