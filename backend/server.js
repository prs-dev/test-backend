const express = require("express")
const astro = require('indian-astrology');
require("dotenv").config()
const insta = require("instamojo-nodejs");
const nodemailer = require("nodemailer")
const cors = require("cors")
const dbConnect = require("./db")
const contactOne = require("./models/contactone")
const contactTwo = require("./models/contactTwo")
const contactThree = require("./models/contactThree")
const cloudinary = require("cloudinary")
const upload = require('./multer')
const list = require("./list.json")

const app = express()
app.use(express.json())
app.use(cors())

//transporter
// let transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

insta.setKeys(process.env.API_KEY, process.env.AUTH_KEY);
insta.isSandboxMode(true);

cloudinary.config({
    cloud_name: process.env.CLOUD,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

app.get("/api/states", (req, res) => {
    res.status(200).json({states: Object.keys(list)})
})

app.post("/api/cities", (req, res) => {
    const {state} = req.body
    const cities = list[state]
    res.status(200).json({cities})
})

app.post('/api/get-astro', (req, res) => {
    const { day, month, year } = req.body
    const data = astro.getByDateWhereTimeUnknownOfIndia(day, month, year)
    if (!data) return res.status(400).json({ message: "Error generating horoscope" })
    return res.status(200).json({ data })
})

app.post('/api/contact-one', async(req, res) => {
    const {mobile, message} = req.body
    try {
        const contact = new contactOne({
            mobile,
            message
        })
        const response = await contact.save()
        res.status(200).json({message: response})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.post('/api/contact-two', async(req, res) => {
    const {name, mobile, location, message} = req.body
    try {
        const contact = new contactTwo({
            name,
            mobile,
            location,
            message
        })
        const response = await contact.save()
        res.status(200).json({message: response})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.post('/api/contact-three', upload.fields([
    {
        name: "profile",
        maxCount: 1
    },
    {
        name: "id",
        maxCount: 1
    }
]), async(req, res) => {
    try {
        // console.log(req.files)
        const profileRes = await cloudinary.uploader.upload(req.files.profile[0].path)
        const idRes = await cloudinary.uploader.upload(req.files.id[0].path)
        // console.log(profileRes.secure_url, idRes.secure_url)
        const contact = new contactThree({
            ...req.body,
            profile: profileRes.secure_url,
            id: idRes.secure_url
        })
        const response = await contact.save()
        res.status(200).json({message: response})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

// app.post('/upload', multerUploads.single("image"), async(req, res) => {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     console.log(result)
// });

app.get("/api/checkout", async (req, res) => {
    try {
        // const name = req.body.name;
        // const email = req.body.email;
        // const amount = req.body.amount;
        const data = new insta.PaymentData();
        data.setRedirectUrl('http://localhost:5173/success');
        data.purpose = "test payment";
        data.amount = 2000;
        data.name = "test";
        data.email = "test@gmail.com";
        // res.json({ url: session.url })

        insta.createPayment(data, function (error, response) {
            if (error) {
              console.log(error)
            } else {
              // Payment redirection link at response.payment_request.longurl
              res.json(JSON.parse(response))
            }
          })
       
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/success',(req,res)=>{
    res.send('payment for successful')
})

// app.post("/api/mail", async (req, res) => {
//     const { name, mobile, message } = req.body
//     try {
//         let info = await transporter.sendMail({
//             from: `"Me" <${process.env.EMAIL}>`,
//             to: process.env.RECEIVE,
//             subject: `New Message from ${name}`,
//             text: message,
//             html: `
//                 <p>name: ${name}</p>
//                 <p>mobile: ${mobile}</p>
//                 <p>message: ${message}</p>
//             `
//         })
//         res.status(200).json({ message: "Message sent" })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Server Error" })
//     }
// })


dbConnect()
.then(() => {
    console.log("db connected")
    app.listen(4000, () => {
        console.log("server is running...")
    })
})


