const _express = require('express');

const auth = require('./auth/auth.routes')
const categories = require('./categories/categories.routes')
const questions = require('./questions/questions.routes')
const question = require('./question/question.routes')


const router = _express.Router();

router.use('/auth', auth);
router.use('/categories', categories)
router.use('/questions', questions)
router.use('/question', question)

module.exports = router;