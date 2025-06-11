const db = require('./models');
const bcrypt = require('bcrypt');

(async () => {
  await db.sequelize.sync({ force: true });

  const password = await bcrypt.hash('admin123', 10);

  await db.User.create({
    email: 'admin@example.com',
    password,
    role: 'admin',
  });

  console.log('✅ Admin создан: admin@example.com / admin123');
  process.exit();
})();
