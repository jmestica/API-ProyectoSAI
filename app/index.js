require("dotenv").config();
const express = require("express");
const cors = require("cors");
require('./database');

//IMPORT Routers
const ReactivosRouter = require('./routes/ReactivosRouter')
const LoginRouter = require('./routes/LoginRouter')

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cors());

//Routing requests
app.use('/api/reactivo', ReactivosRouter)
app.use('/api/login', LoginRouter)

//Catches 404 not found errors
app.use((req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, process.env.IP, () => {
  console.log("listening on port", PORT);
});