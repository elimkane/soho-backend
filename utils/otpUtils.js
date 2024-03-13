const {createTransport} = require("nodemailer");


class OtpUtils{
    static  generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }


    // Fonction pour envoyer le code OTP par e-mail
    static async sendOTPEmailSVG(toEmail, otpCode) {
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

    //LWS
    static async sendOTPEmail(toEmail, otpCode) {
        const transporter = createTransport({
            host: 'mail.sohomoneytransfer.com',
            port: 465,
            secure: true, // false pour le protocole non sécurisé (STARTTLS)
            //service: 'gmail', // Exemple: 'Gmail'
            auth: {
                user: 'contact-soho@sohomoneytransfer.com',
                pass: 'P@sser1234',
            }
        });

        const mailOptions = {
            from: 'contact-soho@sohomoneytransfer.com',
            to: toEmail,
            subject: 'Code OTP pour la vérification du compte',
            text: `Votre code OTP est : ${otpCode}`,
        };
        await transporter.sendMail(mailOptions);
    }

    static async sendAccountValidatedEmail(toEmail) {
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
            subject: 'DEMANDE DE VALIDATION COMPTE SOHO',
            text: `Bonjour, votre compte soho a été validé, merci de vous reconnecter sur ce lien http://localhost:3000`,
        };
        await transporter.sendMail(mailOptions);
    }
}

module.exports = OtpUtils;


