require("dotenv").config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.model")

const app = express()
const PORT = process.env.PORT || 5000
const dbURL = process.env.MONGO_URL;

mongoose.connect(dbURL)
  .then(() => {
    console.log("mongobd is connect");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1)
  })

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})
// register
app.post("/register", async (req, res) => {
  // const { email, password } = req.body;

  try {
    // const newUser=new User({email,password})
    const newUser = new User(req.body)
    await newUser.save();
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email
    })
    if (user && user.password === password) {
      res.status(200).json({ status: "valid user" })
    } else {
      res.status(404).json({status:"Not valid user"})
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
})


// ROUTE NO FOUND
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found"
  })
})
// server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "something worng"
  })
})




app.listen(PORT || 5000, () => {
  console.log(`this is the localhost:${PORT}`);
})

