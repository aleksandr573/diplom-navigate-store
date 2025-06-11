const express = require('express');
const cors = require('cors');
const db = require('./models');

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const productRoutes = require('./routes/products');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Маршруты
app.use('/auth', authRoutes);
app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
app.use('/history', historyRoutes);

// ✅ Запуск и инициализация базы
(async () => {
  try {
    await db.sequelize.sync(); // или { force: true } — если нужно пересоздать
    console.log('📦 База данных инициализирована');

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Ошибка при запуске сервера:', err);
  }
})();
