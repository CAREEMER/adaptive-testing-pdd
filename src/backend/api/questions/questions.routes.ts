const express = require('express');
import { getQuestionsByCategory } from "../../../utils/questions";


const router = express.Router();

router.get('/:categoryID', async (req, res, next) => {
  try {
    const questions = await getQuestionsByCategory(req.params.categoryID)

    res.json(questions);
  } catch (err) {
    next(err);
  }
})

module.exports = router;