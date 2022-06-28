const express = require('express');
import { getQuestionById, registerAnswer } from "../../../utils/questions";
import { authWithToken } from "../../../utils/auth";
import { getQuestion } from "../../../utils/questions"


const router = express.Router();


router.get('/next', async (req, res, next) => {
    try {
        const user = await authWithToken(req, res)

        const question = await getQuestion({id: user.id}, true)

        res.json(question)
    } catch(err) {
        next(err)
    }
})


router.post('/:questionID/answer/:answerID', async (req, res, next) => {
    try {
      const user = await authWithToken(req, res)

      const question = await getQuestionById(req.params.questionID)
  
      const correct = await registerAnswer(res, user, question, req.params.answerID)
      
      //@ts-ignore
      res.json({correct, answer_explanation: question.answer_explanation})
    } catch (err) {
      next(err)
    }
})


module.exports = router;