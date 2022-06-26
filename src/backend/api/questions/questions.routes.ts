const express = require('express');
import { getQuestionsByCategory, registerAnswer } from "../../../utils/questions";
import { authWithToken } from "../../../utils/auth";


const router = express.Router();

router.get('/:categoryID', async (req, res, next) => {
  try {
    const questions = await getQuestionsByCategory(req.params.categoryID)

    res.json({
        questions
    });
  } catch (err) {
    next(err);
  }
})


router.post('/:questionID/answer/:answerID', async (req, res, next) => {
  try {
    const user = await authWithToken(req, res)

    const correct = await registerAnswer(res, user, req.params.questionID, req.params.answerID)
    
    res.json({correct})
  } catch (err) {
    next(err)
  }
})

module.exports = router;