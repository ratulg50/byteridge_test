const config = require("config.js")
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true,
})
mongoose.Promise = global.Promise

module.exports = {
  UserHistory: require("../usersHistory/userHistory.model"),
}
