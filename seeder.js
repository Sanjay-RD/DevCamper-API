const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load config var
dotenv.config({ path: "./config/config.env" });

// load module
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// read json file
const bootcamp = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const course = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamp);
    await Course.create(course);
    await User.create(user);
    console.log("Data imported ...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Data Deleted ...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
