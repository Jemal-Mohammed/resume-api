import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email address"
        }
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [6, "your password cannot be less than 6"],
        select: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Create JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
};

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
