const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        default:''
    },
    role: {
        type: String,
        enum: ["admin", "citizen", "ngo", "gov_Agent"],
        default: "citizen",
        required: true,
    },
    phone: {
    type: String,
    required: function () {
      return this.role === "citizen" && !this.googleId; // required only for citizen
    }
  },
    email: {
        type: String, required: [true, 'Email is required'], validate: {
            validator: function (email) {
                return String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
            },
            message: (props) => `Email (${props.value}) is invalid!`,
        },
    },
    password: {
    type: String,
    required: function () {
      // Require password if NOT using Google login
      return !this.googleId;
    },
    select:false
  },
  googleId: {
    type: String,
    required: function () {
      // Require googleId if NOT using form login
      return !this.password;
    },
  },
    verified: {
        type: Boolean,
        default: false
    },
    profile:{
        type:String,
        default:""
    },
    profilePublicId:{
        type:String,
        default:""
    },
    ngo_verified: {
        type: Boolean,
        default: false,
        required:function(){
            return this.role!="citizen" && this.role!="gov_Agent"
        }
    },
    agent_verified: {
        type: Boolean,
        default: false,
        required:function(){
            return this.role!="citizen" && this.role!="ngo"
        }
    },
    ngoExist:{
        type:Boolean,
        default:false,
        required:function(){
            return this.role!="citizen" && this.role!="gov_Agent"
        }
    },
    agentExist:{
        type:Boolean,
        default:false,
        required:function(){
            return this.role!="citizen" && this.role!="ngo"
        }
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String,
    },
    helpRequestLimit:{
        type:Number,
        default:1
    },
    requestLimit:{
        type:Number,
        default:3
    },
    urgencyLimit:{
        type:Number,
        default:1
    },
    help:{
        type:Boolean,
        default:false,
        required:function(){
            return this.role!=="citizen"
        }
    },
    feedback:{
        type:Boolean,
        default:false
    },
    updatedAt: {
        type: Date,
    },
    allocationConfirm:{
        type:Boolean,
        default:false,
    },
    otp: {
        type: String,
    },
    otp_expiry_time: {
        type: Date,
    },
}, {
    timestamps: true
})

userSchema.pre("save", function (next) {
  if (this.role === "citizen" || this.role === "admin") {
    this.ngo_verified = undefined;
    this.ngoExist = undefined;
    this.agent_verified = undefined;
    this.agentExist = undefined;
    this.help = undefined;
  }

  if (this.role === "ngo") {
    this.agent_verified = undefined;
    this.agentExist = undefined;
  }

  if (this.role === "gov_Agent") {
    this.ngo_verified = undefined;
    this.ngoExist = undefined;
  }

  next();
});

userSchema.pre('save', function(next) {
    if (this.firstName) {
        this.profile = this.firstName.charAt(0).toUpperCase();
    }
    next();
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1y' });
    return token;
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.correctOTP = async function (candidateOTP, userOtp) {
    return await bcrypt.compare(candidateOTP, userOtp)
}
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
    return resetToken;
}
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 12);
}
userSchema.statics.hashOTP = async function (OTP) {
    return await bcrypt.hash(OTP, 12);
}
userSchema.methods.compareResetPassword = async function (password, confirmPassword) {
    return await bcrypt.compare(password, confirmPassword)
}

const User = new mongoose.model("User", userSchema);
module.exports = User;