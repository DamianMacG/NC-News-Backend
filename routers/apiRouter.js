const express = require("express");
const router = express.Router();
const { getEndpoints } = require("../controllers/api.controller");

router.get("/", getEndpoints);

module.exports = router;
