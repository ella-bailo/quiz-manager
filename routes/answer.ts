import express from 'express';
import { checkPermissions } from '../middleware/check-permissions';
import { middleware } from '../middleware/middleware';
import {
  addAnswer,
  checkNumberOfAnswersLessThanFive,
  updateAnswer,
  checkNumberOfAnswersMoreThanThree,
  deleteAnswer,
  checkAnswerIsNotCorrect,
} from '../services/answer-service';
import { getQuestion } from '../services/question-service';

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
  const { quizId, questionId, answer } = req.body;
  try {
    let errorParams: null | string = null;
    let errorAnswers: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!quizId || !questionId || !answer) {
      const message = 'Answer must be provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    }
    const numberOfAnswers = await checkNumberOfAnswersLessThanFive(questionId);
    if (numberOfAnswers === undefined) {
      const message = 'Maximum of 5 answers permitted per question';
      errorAnswers = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    }
    if (errorParams === null && errorAnswers === null) {
      const newAnswer = await addAnswer(answer, questionId);
      const message = `answer with id ${newAnswer} added`;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/update', async (req, res) => {
  let errorParams: null | string = null;

  const { answer, answerId, questionId } = req.body;
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    const question = await getQuestion(questionId);
    const quizId = question['quiz_id'];
    if (!answer || !answerId || !questionId) {
      const message = 'Update must be provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    }
    if (errorParams === null) {
      await updateAnswer(answerId, answer);
      const message = 'Answer updated succsessfully';
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
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
  const { answerId, questionId } = req.body;
  try {
    let errorParams: null | string = null;
    let errorNumbers: null | string = null;
    let errorCorrect: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!answerId || !questionId) {
      const message = 'Required parameters have not been provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }

    const question = await getQuestion(questionId);
    const quizId = question['quiz_id'];
    const numberOfAnswers = await checkNumberOfAnswersMoreThanThree(questionId);
    const isNotCorrect = await checkAnswerIsNotCorrect(answerId);

    if (numberOfAnswers === undefined) {
      const message = 'Minimum of three answers required per question';
      errorNumbers = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }
    if (isNotCorrect == undefined) {
      const message = 'Correct answers cannot be deleted';
      errorCorrect = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 1,
        httpOnly: false,
      });
    }

    if (
      errorParams === null &&
      errorNumbers === null &&
      errorCorrect === null
    ) {
      await deleteAnswer(answerId);
      const message = 'Answer deleted successfully';
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
