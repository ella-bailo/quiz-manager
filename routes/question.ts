import express from 'express';
import { checkPermissions } from '../middleware/check-permissions';
import {
  checkNumberOfQuestions,
  addQuestion,
  updateCorrectAnswer,
  updateQuestion,
  deleteQuestion,
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
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!quizId || !question || !answerOne || !answerTwo || !answerThree) {
      const message = 'all fields must be filled in';
      console.log(message);
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

router.post('/update', async (req, res) => {
  const { quizId, question, questionId } = req.body;
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !question || !quizId) {
      const message = 'update must be provided';
      console.log(message);
    }
    await updateQuestion(questionId, question);
    const message = 'question updated sucssesfully';
    console.log(message);
    res.redirect(302, `/quiz/edit/${quizId}`);
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/update-correct-answer', async (req, res) => {
  const { quizId, correctAnswer, questionId } = req.body;
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !correctAnswer || !quizId) {
      const message = 'update must be provided';
      console.log(message);
    }
    await updateCorrectAnswer(questionId, correctAnswer);
    const message = 'correct answer updated sucssesfully';
    console.log(message);
    res.redirect(302, `/quiz/edit/${quizId}`);
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/delete', async (req, res) => {
  const { quizId, questionId } = req.body;
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !quizId) {
      const message = 'required paramters have not been provided';
      console.log(message);
    }
    await deleteQuestion(questionId);
    const message = 'question deleted sucsessfully';
    console.log(message);
    res.redirect(302, `/quiz/edit/${quizId}`);
  } catch {
    res.render('error-page.handlebars', error500);
  }
});
