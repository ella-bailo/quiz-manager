import express from 'express';
import { checkPermissions } from '../middleware/check-permissions';
import {
  checkNumberOfQuestions,
  addQuestion,
  updateCorrectAnswer,
} from '../services/question-service';
import { addAnswer } from '../services/answer-service';
import { middleware } from '../middleware/middleware';

export const router = express.Router();
const error403 = {
  error: 403,
  message: 'You do not have the permissions required to view this page.',
};
const error500 = {
  error: 500,
  message: 'Something went wrong, please try again.',
};

router.use('/', middleware);

router.post('/add', async (req, res) => {
  const { quizId, question, answerOne, answerTwo, answerThree } = req.body;
  try {
    if (!quizId || !question || !answerOne || !answerTwo || !answerThree) {
      const message = 'all fields must be filled in';
      console.log(message);
    }
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    const numberOfQuestions = await checkNumberOfQuestions;
    if (numberOfQuestions === undefined) {
      const message = 'Max of 26 questions reached';
      console.log(message);
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
    const newQuestion = await addQuestion(question, quizId);
    await addAnswer(answerTwo, newQuestion);
    await addAnswer(answerThree, newQuestion);
    const correctAnswer = await addAnswer(answerOne, newQuestion);
    await updateCorrectAnswer(newQuestion, correctAnswer);
    const message = `question with id ${newQuestion} added`;
    console.log(message);
    res.redirect(302, `/quiz/edit/${quizId}`);
  } catch {
    res.render('error-page.handlebars', error500);
  }
});
