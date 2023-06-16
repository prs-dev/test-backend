const mongoose = require("mongoose")

const contactThreeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    altmobile: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String, 
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    expert: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    ques: {
        type: String,
        default: "No"
    },
    profile: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("ContactThree", contactThreeSchema)