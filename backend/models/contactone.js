const mongoose = require("mongoose")

const contactOneSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("ContactOne", contactOneSchema)