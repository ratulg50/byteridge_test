const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  username: { type: String, required: true },
  loginTime: { type: Date },
  LogOutTime: { type: Date },
  clientIp: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
})

schema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("UserHistoryRatul", schema)
