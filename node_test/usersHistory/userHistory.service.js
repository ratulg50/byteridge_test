const bcrypt = require("bcryptjs")
const db = require("_helpers/dbHistory")
const UserHistory = db.UserHistory
const config = require("config.js")
var ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
const db2 = require("_helpers/db")
const User = db2.User
module.exports = {
  getAll,
}

async function getAll(req) {
  const parts = req.headers.authorization.split(" ")

  // Get the second part (index 1)
  const token = parts[1]
  try {
    // Verify and decode the token synchronously
    const decoded = jwt.verify(token, config.secret)

    // Access the decoded data
    const userData = await User.findOne({
      _id: ObjectId(decoded.sub),
    })

    if (userData.role !== "AUDITOR") {
      return false
    } else {
      return await UserHistory.find()
    }
  } catch (err) {
    return []
  }
}
