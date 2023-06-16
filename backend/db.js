const mongoose = require("mongoose")
require("dotenv").config()

const dbConnect = () => mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})

module.exports = dbConnect