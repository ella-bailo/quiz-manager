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
    let errorParams: null | string = null;
    let errorQuestions: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!quizId || !question || !answerOne || !answerTwo || !answerThree) {
      const message = 'All fields must be filled in';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    }
    const numberOfQuestions = await checkNumberOfQuestions(quizId);
    if (numberOfQuestions === undefined) {
      const message = 'Max of 26 questions reached';
      errorQuestions = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }
    if (errorQuestions === null && errorParams === null) {
      const newQuestion = await addQuestion(question, quizId);
      await addAnswer(answerTwo, newQuestion);
      await addAnswer(answerThree, newQuestion);
      const correctAnswer = await addAnswer(answerOne, newQuestion);
      await updateCorrectAnswer(newQuestion, correctAnswer);
      const message = `question with id ${newQuestion} added`;

      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
      res.redirect(302, `/quiz/edit/${quizId}`);
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/update', async (req, res) => {
  const { quizId, question, questionId } = req.body;
  try {
    let errorParams: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !question || !quizId) {
      const message = 'update must be provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }
    if (errorParams === null) {
      await updateQuestion(questionId, question);
      const message = 'Question updated successfully';
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
      res.redirect(302, `/quiz/edit/${quizId}`);
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/update-correct-answer', async (req, res) => {
  const { quizId, correctAnswer, questionId } = req.body;
  try {
    let errorParams: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !correctAnswer || !quizId) {
      const message = 'New correct answer must be provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }
    if (errorParams === null) {
      await updateCorrectAnswer(questionId, correctAnswer);
      const message = 'Correct answer updated sucssesfully';
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
      res.redirect(302, `/quiz/edit/${quizId}`);
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/delete', async (req, res) => {
  const { quizId, questionId } = req.body;
  try {
    let errorParams: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!questionId || !quizId) {
      const message = 'Required parameters have not been provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }
    if (errorParams === null) {
      await deleteQuestion(questionId);
      const message = 'Question deleted sucsessfully';
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
      res.redirect(302, `/quiz/edit/${quizId}`);
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});
