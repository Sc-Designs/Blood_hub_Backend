const express = require("express");
const router = express.Router();

router.get("/maintanence", (req, res) => {
  try {
    res.status(200).render("MainTanence");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;