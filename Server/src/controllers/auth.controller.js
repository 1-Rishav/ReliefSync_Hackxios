const User = require("../models/auth.model");
const Blacklist = require("../models/tokenBlackList.model");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const axios = require("axios");
const otpGenerator = require("otp-generator")
const crypto = require("crypto");
const resetPassword = require("../Templates/Mail/resetPassword")
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = catchAsync(async (req, res, next) => {

    const { firstName, lastName, email, role, password, phone } = req.body;
    if (!firstName || !email || !role || !password) {
        return res.status(400).json({ message: "Fill all the required fields" });
    }

    const filteredBody = filterObj(req.body, "firstName", "lastName", "email", "role", "password", "phone");

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.verified) {
            return res.status(409).json({ message: "User already exists, try login" });
        }
        const hashPassword = await User.hashPassword(password);
        filteredBody.password = hashPassword;
        let user;
        if (existingUser) {
            user = await User.findOneAndUpdate(
                { email },
                filteredBody,
                { new: true, validateModifiedOnly: true }
            );
        } else {
            user = await User.create(filteredBody);
        }
        req.userId = user._id;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error try again later!"
        })
    }
})

exports.sendOtp = catchAsync(async (req, res, next) => {
    const { userId } = req;
    console.log("helo user", userId);
    try {
        const newOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true
        })
        const hashedOTP = await User.hashOTP(newOtp);
        const user = await User.findByIdAndUpdate(userId, {
            otp: hashedOTP.toString(),
            otp_expiry_time: Date.now() + 5 * 60 * 1000
        }, { new: true, validateModifiedOnly: true });
        console.log(newOtp);

        //Send otp to user email
        await axios.post(
    "https://api.mailersend.com/v1/email",
    {
      from: {
        email: `noreply@${process.env.EMAIL}`,
        name: 'ReliefSync',
      },
      to: [{ email: user.email }],
      subject: "Verification OTP",
      text: `Welcome to ReliefSync platform, your OTP is ${newOtp}. It is valid for 5 minutes. Thank from ReliefSync team.`,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
        return res.status(200).json({ message: "OTP sent successfully, check your email!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, try again later!" });
    }
})

exports.verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp_expiry_time: { $gt: Date.now() } })

        if (!user) {
            return res.status(401).json({ message: "Email is invalid or OTP is expired" });
        }
        if (user.verified) {
            return res.status(401).json({ message: "User already verified" });
        }
        if (!(await user.correctOTP(otp, user.otp))) {
            return res.status(401).json({ message: "OTP is incorrect" });
        }

        user.verified = true;
        user.otp = undefined;
        user.otp_expiry_time = undefined;
        await user.save({ new: true, validateModifiedOnly: true });
        const token = user.generateAuthToken();
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 360000 * 24 * 60 * 60 * 1000
        }
        const role = user.role;
        const verified = user.verified;

        return res.cookie("token", token, options).json({ message: "Email verified successfully", role, verified, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, try again later!" });
    }
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const filteredBody = filterObj(req.body, "email", "password");

    if (!email || !password) {
        return res.status(401).json({ message: "Fill all the required fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    try {
        if (!user) {
            return res.status(401).json({ message: "User not found, please register first!" });
        }
        const isPasswordCorrect = await user.comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }
        if (!user.verified) {
            req.userId = user._id;
            next();
        }
        else {
            const token = user.generateAuthToken();
            const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 360000 * 24 * 60 * 60 * 1000
            }
            const role = user.role;
            const verified = user.verified;
            const ngo_verified = user.ngo_verified;
            const agent_verified = user.agent_verified;
            const NgoExist = user.ngoExist;
            const AgentExist = user.agentExist
            return res.cookie("token", token, options).json({ message: "Logged in successfully", role, token, verified, ngo_verified, agent_verified, NgoExist, AgentExist });
        }
    } catch (error) {
        if (!user.password) {
            return res.status(401).json({ message: "Try Login with Google " })
        } else {
            return res.status(500).json({ message: "Server error try again later!" });
        }
    }
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "User not found, please register!" });
    }
    const resetToken = user.createPasswordResetToken();

    user.save({ validateBeforeSave: false });
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        await axios.post(
    "https://api.mailersend.com/v1/email",
    {
      from: {
        email: process.env.EMAIL,
        name: 'ReliefSync',
      },
      to: [{ email: user.email }],
      subject: "Reset Password",
      html: resetPassword(user.firstName, resetUrl),
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

        return res.status(200).json({ message: "Reset password link sent, check your email!" });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "Server error, try again later!" });
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        return res.status(401).json({ message: "Fill all fields or Invalid token! Try again later" });
    }

    const hashedToken = crypto.createHash("sha256").update(req.body.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: ({ $gt: Date.now() })
    })

    if (!user) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
    if (!user.verified) {
        req.userId = user._id;
        next();
    }
    try {
        const hashedPassword = await User.hashPassword(password);

        const compareNewPassword = await user.compareResetPassword(confirmPassword, hashedPassword);
        if (!compareNewPassword) {
            return res.status(401).json({ message: "Your Password and ConfirmPassword not matching" });
        }
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save();
        const role = user.role;
        const verified = user.verified;
        const ngo_verified = user.ngo_verified;
        const agent_verified = user.agent_verified;
        const token = await user.generateAuthToken();
        const AgentExist = user.agentExist;
        const NgoExist = user.ngoExist;
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 360000 * 24 * 60 * 60 * 1000
        }
        return res.cookie("token", token, options).json({ message: "Password reseted successfully", role, verified, ngo_verified, agent_verified, token, NgoExist, AgentExist });
    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Server error, try again later!" })
    }
})

exports.logout = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    try {
        await Blacklist.create({ token });
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" })
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error, try again later!" });
    }
})

exports.googleAuth = catchAsync(async (req, res, next) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { given_name, email, sub, email_verified } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: given_name,
                email,
                googleId: sub,
                verified: email_verified,
            });

        }
        const token = await user.generateAuthToken();
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 360000 * 24 * 60 * 60 * 1000
        }
        const role = user.role
        const verified = user.verified;

        // Optional: create your own JWT/session/cookie
        res.cookie("token", token, options).json({
            message: "Logged in successfully",
            role, verified, token
        });
    } catch (err) {
        //console.error('Error during auth:', err);
        res.status(500).json({ message: "Server error, try again later!" });
    }
})