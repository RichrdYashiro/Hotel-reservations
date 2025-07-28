const express = require('express');
const router = express.Router();
const { authorize, register } = require('../controllers/authController');

router.post('/login', authorize);
router.post('/register', register);

module.exports = router;
