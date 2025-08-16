const express = require('express');
const router = express.Router();
const Game = require('../models/mysql/Game');

// Получить все игры с возможностью фильтрации и сортировки
router.get('/', async (req, res) => {
    try {
        const options = {
            discounted: req.query.discounted === 'true',
            search: req.query.search || '',
            sort: req.query.sort || '',
            limit: req.query.limit || null,
            offset: req.query.offset || null
        };
        
        const games = await Game.findAll(options);
        res.json(games);
    } catch (error) {
        console.error('Ошибка при получении игр:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении игр' });
    }
});

// Получить игру по ID
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: 'Игра не найдена' });
        }
        
        res.json(game);
    } catch (error) {
        console.error('Ошибка при получении игры:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении игры' });
    }
});

// Получить игры со скидками
router.get('/discounted/list', async (req, res) => {
    try {
        const options = {
            discounted: true,
            limit: req.query.limit || null
        };
        
        const games = await Game.findAll(options);
        res.json(games);
    } catch (error) {
        console.error('Ошибка при получении игр со скидками:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении игр со скидками' });
    }
});

module.exports = router;