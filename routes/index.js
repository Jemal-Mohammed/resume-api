// routes/pdfRoute.js
import express from 'express';
import buildPDF from '../service/pdf-service.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import sendToken from '../utils/sendToken.js';
import { isAuthenthicatheduser } from '../utils/auth.js';
import   catchValidationErrors from '../utils/validationErrors.js';
// import ErrorHandller from '../utils/errorHandller.js';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from "nodemailer"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import upload from '../utils/upload.js';
// import ErrorHandller from '../utils/errorHandller.js';
const router = express.Router();

//  health

router.get('/health', async (req, res) => {
 
    res.send("wellome");
         
});
// user auth
router.post('/register', catchValidationErrors(async (req, res) => {
  console.log(req.user);
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.send(user);
  } catch (error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
}));
// ... (other imports)

router.post("/login", catchValidationErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // find user from db
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // check if password is correct or not
    const check = await user.comparePassword(password);

    if (!check) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    sendToken(user, 200, res);

  } catch (error) {
    // Log the detailed error for debugging
    console.error('Login Error:', error);

    res.status(500).json({ error: "Internal Server Error" });
  }
}));

// ... (other middleware, MongoDB connection, and server setup)


router.get("/logout",isAuthenthicatheduser,async(req,res,next)=>{
  // console.log(req.user);
  res.clearCookie('token')
  res.cookie("token", null, {
      expires: new Date(0), // Set to a date in the past
      httpOnly: true
  });
  res.status(200).json({
      success: true,
      message: "Logged out successfully"
  });
})

router.get("/user",isAuthenthicatheduser,async(req,res,next)=>{
  // console.log(req.user);
    const user = await User.findOne({ _id: req.user.id });
  // console.log(user);
  if(!user){
    res.status(400).json({error:"user dos't found"});
  }
  res.status(200).send(user);
})
// resume profile


router.post("/complete-profile", isAuthenthicatheduser, upload.single('file'), async (req, res, next) => {
  // console.log(req.file);
  try {
    const file = req.file;
    const data = req.body;
    if (file) {
      data.file = req.file.filename;
    }
    // Add the user ID to the data object
    data.user = req.user.id;

    // Check if a profile already exists for the user
    const existingProfile = await Profile.findOne({ user: req.user.id });

    if (existingProfile) {
      // If an existing file exists, delete it
      if (existingProfile.file) {
        const filePath = path.join(__dirname, '../uploads', existingProfile.file);
        await fsPromises.unlink(filePath);
      }

      // Update the existing profile
      await Profile.findOneAndUpdate({ user: req.user.id }, data);
      res.status(200).send("Profile updated");
    } else {
      // If no profile exists, create a new one
      await Profile.create(data);
      res.status(201).send("Profile completed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});




router.get('/download', isAuthenthicatheduser, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user').maxTimeMS(20000);

    if (!profile) {
      return res.status(404).send('Profile not found');
    }

    // Set the response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');

    // Call buildPDF function with fetched profile data
    await buildPDF(profile, res);
    // send mail for the user
    // "use strict";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Jemal 👻" <noreply@resume.com>', // sender address
    to: profile.user.email, // list of receivers
    subject: `Resume Builder`, // Subject line
    text: `Hello ✔ ${profile.user.name} We hope this message finds you well. We want to inform you that your resume has been successfully downloaded from our platform.
    !!`, // plain text body
    html: "<b> Thank you for choosing our service. If you have any questions or need further assistance, feel free to reach out.</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

main().catch(console.error);

  } catch (error) {
    if (error.name === 'MongooseTimeoutError') {
      console.error('Mongoose timeout error:', error);
      return res.status(500).send('Mongoose timeout error');
    } else {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }
});

export default router;
