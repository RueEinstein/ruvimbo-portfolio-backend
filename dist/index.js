import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.post('/send-email', async (req, res) => {
    const { fullname, email, subject, message } = req.body;
    if (!fullname || !email || !subject || !message) {
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
            from: `"${fullname}" <${email}>`,
            to: process.env.GMAIL_USER,
            subject: subject,
            text: message,
        });
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
