const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const firebase = require("firebase-admin");
const serviceAccount = require("./config/firebase_admin.json");
const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");

const dotenv = require("dotenv").config();

if (dotenv.error) {
  throw dotenv.error;
}

// process.env.NODE_ENV = "development";

const env = process.env.NODE_ENV;
if (env === undefined) {
  console.log(`NODE_ENV is ${env}`);
  console.log("SET NODE_EV!!! development or test or production");
  process.exit(1);
}

const model = require("./models");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.r = (result) => {
    res.json({
      isSuccess: true,
      status: 200,
      message: "success",
      result,
    });
  };
  next();
});

// SwaggerUi
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS ALL ACCESS
app.use(cors());

require("./routes")(app);

app.use(function (errCode, req, res, next) {
  res.status(errCode).send({
    isSuccess: false,
    message: "something went wrong",
  });
});
const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  model.sequelize.sync();
  console.info(`[ApiServer] Listening on Port ${PORT} / at ${env} Env`);
});

module.exports = app;
