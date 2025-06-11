const express = require('express');
const { Product } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/by-store/:storeId', async (req, res) => {
  const products = await Product.findAll({ where: { StoreId: req.params.storeId } });
  res.json(products);
});

router.post('/by-ids', async (req, res) => {
  const { ids } = req.body;
  const products = await Product.findAll({ where: { id: ids } });
  res.json(products);
});

router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const { x, y, shelf } = req.body;
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });

  if (x !== undefined) product.x = x;
  if (y !== undefined) product.y = y;
  if (shelf !== undefined) product.shelf = shelf;

  await product.save();
  res.json(product);
});

module.exports = router;
