const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ngo_Name: {
        type: String, required: [true, "Name is required"]
    },
    registrationNumber: {
        type: String, required: [true, "Register number is required"]
    },
    registrationType: {
        type: String, required: [true, "Registration type is required"]
    },
    stateORcity: {
        type: String, required: [true, "State/City is required"]
    },
    registeredAddress: {
        type: String, required: [true, "Address is required"]
    },
    officialEmail: {
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
    phone: {
        type: String, required: [true, "Phone number is required"]
    },
    founderName: {
        type: String, required: [true, "Name is required"]
    },
    website: {
        type: String, required: [true, "Website link is required"]
    },
    media_link: {
        type: String, required: [true, "Media link is required"]
    },
    Official_docs: {
        type: String, required: [true, "Document link is required"]
    },
    status:{
        type:Boolean,
        default:false
    },
    emergency:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const Ngo = new mongoose.model("Ngo", ngoSchema);
module.exports = Ngo;