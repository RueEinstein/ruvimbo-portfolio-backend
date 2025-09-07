import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        console.log({ name, email, subject, message });
        return res.status(400).json({ error: 'Missing fields' });
    }
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS, // Use App Password if 2FA is enabled
            },
        });
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            replyTo: email, // user's email for replies
            to: process.env.GMAIL_USER,
            subject: subject,
            text: message,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #007BFF;">${subject}</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <hr>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
        });
        // return response after sending email
        res.status(200).json({ success: true, message: 'Email sent' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
