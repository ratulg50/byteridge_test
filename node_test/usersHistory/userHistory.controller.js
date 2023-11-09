const express = require("express")
const router = express.Router()
const userService = require("./userHistory.service")
// routes
router.get("/", getAll)
router.get("/:id", getById)
router.put("/:id", update)
router.delete("/:id", _delete)

module.exports = router

function getAll(req, res, next) {
  userService
    .getAll(req)
    .then((users) => (users ? res.json(users) : res.sendStatus(401)))
    .catch((err) => next(err))
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err))
}
