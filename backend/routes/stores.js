const express = require('express');
const { Store } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const stores = await Store.findAll();
  res.json(stores);
});

module.exports = router;
