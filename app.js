//Imports
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const Admin = require("./models/admin");

//extra security packages
const heltmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const logger = require("morgan");

const globalConfigurations = {
  submissions_on: true,
  submission_limit: 3,
  login_attempt_per_day: 6,
};

const addGlobalConfigurationsToRequest = (req, res, next) => {
  req.globalConfigurations = globalConfigurations;
  next();
};

//Connect DB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/AuthRoute");
const adminRouter = require("./routes/AdminRoute");
const countersRouter = require("./routes/CountersRoute");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Cronjobs

//app object definitions and configurations
const app = express();

// extra packages

app.use(heltmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4200",
      "http://192.168.1.119:4200",
      "http://localhost:8080",
      "https://salamidinbkashe.com/",
      "https://www.salamidinbkashe.com/",
    ],
    credentials: true,
  }),
);
app.use(xss());
app.use(logger("dev"));
app.use(
  rateLimiter({
    windowMs: 1000,
    limit: 10,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

if (process.env.NGINX_HANDLE_STATIC != "true") {
  console.log("Node handling Static files");
  app.use(express.static(path.join(__dirname, "public")));
}

app.use(addGlobalConfigurationsToRequest);

app.get("/", async (req, res) => {
  res.send("Bkash Salami Server API");
});

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/counters", countersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));

    const admin = await Admin.find({});
    if (admin.length === 0) {
      const admin = await Admin.create({
        name: "Admin",
        email: "admin@salamidinbkashe.com",
        password: "Abc123@#",
        enabled: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

start();
