const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,     
      port: process.env.SMTP_PORT, 
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,   
        pass: process.env.SMTP_PASS,   
      },
    });

    
    const mailOptions = {
      from: `"Ton App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    throw new Error('Impossible d\'envoyer l\'email');
  }
};

module.exports = sendEmail;
