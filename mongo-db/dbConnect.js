require("dotenv").config();
const mongoose = require("mongoose");

// db connection...
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(`error on db connection`);
    } else {
      console.log(`db connected successfully !.`);
    }
  }
);

// schema...
const dbSchema = new mongoose.Schema({
  empid: {
    type: Number,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
});

// model...
const db = mongoose.model("caseDetail", dbSchema);

module.exports = db;
