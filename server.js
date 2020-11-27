const express = require("express");
const dotenv = require("dotenv");
// const logger = require("./middleware/logger");
const morgan = require("morgan");
const connectDB = require("./config/db");
// Bringing colors
const colors = require("colors");
const handleError = require("./middleware/error");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

// route file
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// set environment veriable
dotenv.config({ path: "./config/config.env" });

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

connectDB();

// app.use(logger);

// Dev logging middleware
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// photo uploader
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Moute Router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(handleError);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandle promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
