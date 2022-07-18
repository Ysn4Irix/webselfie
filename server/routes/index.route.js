const router = require("express").Router()
const selfie = require("../controllers/selfie.controller")

/* GET index response. */
router.post("/screenshot", selfie.screenshot)

module.exports = router