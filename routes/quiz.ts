import express from 'express';
import { middleware } from '../middleware/middleware';
import {
  deleteQuiz,
  getQuiz,
  getQuizzes,
  verifyQuizId,
  addQuiz,
  checkQuizName,
} from '../services/quiz-service';
import { checkPermissions } from '../middleware/check-permissions';

const error403 = {
  error: 403,
  message: 'You do not have the permissions required to view this page.',
};
const error500 = {
  error: 500,
  message: 'Something went wrong, please try again.',
};

const error404 = { error: 404, message: 'Page not found.' };

export const router = express.Router();

router.use('/', middleware);

router.get('/all', async (req, res) => {
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['invalid']) {
      const quizList = await getQuizzes();
      const message = req.cookies['EDIT-MESSAGE'];
      const data = {
        quiz: quizList,
        permission: permissions,
        message: message,
      };
      res.render('view-all.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.get('/add', async (req, res) => {
  try {
    const permissions = await checkPermissions(req);
    if (permissions['edit']) {
      const data = {
        permission: permissions,
      };
      res.render('create-quiz.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.get('/:quizId', async (req, res) => {
  try {
    const permissions = await checkPermissions(req);
    if (!permissions['invalid']) {
      const { quizId } = req.params;
      const quizIdIsValid = await verifyQuizId(quizId);
      if (quizIdIsValid === undefined) {
        res.render('error-page.handlebars', error404);
      }
      const quiz = await getQuiz(quizId);
      const data = {
        quiz: quiz,
        permission: permissions,
      };
      res.render('view-quiz.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.get('/edit/:quizId', async (req, res) => {
  try {
    const permissions = await checkPermissions(req);
    if (permissions['edit']) {
      const { quizId } = req.params;
      const quizIdIsValid = await verifyQuizId(quizId);
      if (quizIdIsValid === undefined) {
        res.render('error-page.handlebars', error404);
      }
      const message = req.cookies['EDIT-MESSAGE'];
      const quiz = await getQuiz(quizId);
      const data = {
        quiz: quiz,
        permission: permissions,
        message: message,
      };
      res.render('edit-quiz.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/add', async (req, res) => {
  const { quizName, quizDescription } = req.body;
  try {
    let errorParams: null | string = null;
    let errorName: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!quizName || !quizDescription) {
      const message = 'Name and description must be provided';
      errorParams = message;
      const data = { message: message, permissions: permissions };
      res.render('create-quiz.handlebars', data);
    }
    const validQuizName = await checkQuizName(quizName);
    if (validQuizName === undefined) {
      const message = 'Quiz name already exists';
      errorName = message;
      const data = { message: message, permissions: permissions };
      res.render('create-quiz.handlebars', data);
    }
    if (errorParams === null && errorName === null) {
      const newQuiz = await addQuiz(quizName, quizDescription);
      const message = `Quiz with id ${newQuiz} created`;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
      res.redirect(302, `/quiz/edit/${newQuiz}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.post('/delete', async (req, res) => {
  const { quizId } = req.body;
  try {
    let errorParams: null | string = null;

    const permissions = await checkPermissions(req);
    if (!permissions['edit']) {
      res.render('error-page.handlebars', error403);
    }
    if (!quizId) {
      const message = 'Required parameters have not been provided';
      errorParams = message;
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
    }
    if (errorParams === null) {
      await deleteQuiz(quizId);
      const message = 'Quiz deleted succsessfully';
      res.cookie('EDIT-MESSAGE', message, {
        maxAge: 1000 * 10,
        httpOnly: false,
      });
      res.redirect(302, '/quiz/all');
    } else {
      res.redirect(302, `/quiz/edit/${quizId}`);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});
