const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    console.log(`✅ Зарегистрирован: ${email} (роль: ${role})`);

    res.status(201).json({ message: 'Регистрация успешна', userId: user.id });
  } catch (err) {
    console.error('❌ Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ЛОГИН
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.warn(`⛔ Пользователь не найден: ${email}`);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn(`⛔ Неверный пароль для: ${email}`);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log(`🔓 Вход выполнен: ${email} (роль: ${user.role})`);

    res.json({ token });
  } catch (err) {
    console.error('❌ Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
