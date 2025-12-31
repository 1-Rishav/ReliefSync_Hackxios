const express = require ("express");
const cors = require("cors")
const bodyParser = require('body-parser')
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routes = require("./routes/index.route")

const app = express();

app.use(express.static('public'))

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","PATCH","POST","DELETE","PUT"],
    credentials:true,
}))

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(morgan('combined'));
const limiter = rateLimit({
    windowMs:60*60*1000,
    limit:100,
    handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests, try again after an hour.",
    });
  },
})
app.use(limiter)
app.use(routes);

module.exports = app;