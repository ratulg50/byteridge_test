const config = require("config.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("_helpers/db")
const dbHistory = require("_helpers/dbHistory")
const User = db.User
const UserHistory = dbHistory.UserHistory
var ObjectId = require("mongodb").ObjectId
const requestIp = require("request-ip")
module.exports = {
  authenticate,
  getAll,
  logOut,
  getById,
  create,
  update,
  delete: _delete,
}

async function authenticate(req, { username, password }) {
  const user = await User.findOne({ username })
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject()
    const token = jwt.sign({ sub: user.id }, config.secret)
    const userHistoryData = await updateLogInTime(req, username)
    return {
      ...userWithoutHash,
      token,
      userHistoryData,
    }
  }
}

async function getAll() {
  return await User.find().select("-hash")
}

async function getById(id) {
  return await User.findById(id).select("-hash")
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken'
  }

  const user = new User(userParam)

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10)
  }

  // save user
  await user.save()
}

async function update(id, userParam) {
  const user = await User.findById(id)

  // validate
  if (!user) throw "User not found"
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken'
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10)
  }

  // copy userParam properties to user
  Object.assign(user, userParam)

  await user.save()
}

async function _delete(id) {
  await User.findByIdAndRemove(id)
}

async function updateLogInTime(req, username) {
  const ip = requestIp.getClientIp(req)
  let sendData = {
    loginTime: Date.now(),
    clientIp: ip,
    username: username,
  }
  const userHistoryData = new UserHistory(sendData)

  await userHistoryData.save()
  return userHistoryData
}

async function logOut(req, { logId }) {
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

    const user = await UserHistory.findOne({
      username: userData.username,
      _id: ObjectId(logId),
    })
    user.LogOutTime = Date.now()

    await user.save()
  } catch (err) {
    return false
  }
}
