const express = require('express');

const auth = require('./auth/auth.routes')
const categories = require('./categories/categories.routes')
const questions = require('./questions/questions.routes')


const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);
router.use('/categories', categories)
router.use('/questions', questions)

module.exports = router;