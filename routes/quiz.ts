import express from 'express';
import { middleware } from '../middleware/middleware';
import { getQuiz, getQuizzes, verifyQuizId } from '../services/quiz-service';
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
      const data = {
        quiz: quizList,
        permission: permissions,
      };
      res.render('view-all.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});

router.get('/new', async (req, res) => {
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
      const quiz = await getQuiz(quizId);
      const data = {
        quiz: quiz,
        permission: permissions,
      };
      res.render('edit-quiz.handlebars', data);
    } else {
      res.render('error-page.handlebars', error403);
    }
  } catch {
    res.render('error-page.handlebars', error500);
  }
});
