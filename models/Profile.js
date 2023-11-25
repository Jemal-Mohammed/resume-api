// const mongoose = require('mongoose');
import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  courses: {
    type: String,
    required: true,
  },
  certification: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  personalIntersets: {
    type: String,
    required: true,
  },
  onlineProfiles: {
    type: String,
    required: true,
  },
  references: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
