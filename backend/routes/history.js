const express = require('express');
const { Route, Product } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Получение истории
router.get('/', authenticate, async (req, res) => {
  const routes = await Route.findAll({
    where: { UserId: req.userId },
    include: [{ model: Product, through: { attributes: [] } }],
    order: [['date', 'DESC']],
  });

  const result = routes.map((r) => ({
    id: r.id,
    storeName: r.storeName,
    date: r.date,
    items: r.Products.map((p) => p.name),
  }));

  res.json(result);
});

// Сохранение маршрута
router.post('/', authenticate, async (req, res) => {
  try {
    const { storeName, productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Список товаров пуст или неверный' });
    }

    const foundProducts = await Product.findAll({
      where: { id: productIds },
    });

    if (foundProducts.length !== productIds.length) {
      return res
        .status(400)
        .json({ error: 'Некоторые товары не найдены в базе' });
    }

    const route = await Route.create({
      storeName,
      date: new Date(),
      UserId: req.userId,
    });

    await route.setProducts(productIds);

    console.log(`✅ Маршрут сохранён (UserId: ${req.userId}, Store: ${storeName}, Products: [${productIds.join(', ')}])`);

    res.json({ message: 'Маршрут сохранён', routeId: route.id });
  } catch (err) {
    console.error('❌ Ошибка при сохранении маршрута:', err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении маршрута' });
  }
});

module.exports = router;
