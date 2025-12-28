const mongoose = require('mongoose');
const agentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String,
        required:[true, "Name is required"]
    },
    email:{
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
    official_id: {
        type: String,
        required: [true, "Official ID is required"],
    },
    department: {
        type: String,
        required: [true, "Department is required"]
    },
    badge_number: {
        type: String,
        required: [true, "Badge number is required"]
    },
    current_state: {
        type: String,
        required: [true, "Current state is required"]
    },
    office_location: {
        type: String,
        required: [true, "Office location is required"]
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

const Agent = new mongoose.model("Agent", agentSchema);
module.exports = Agent;