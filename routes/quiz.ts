import express from 'express';
import { middleware } from '../middleware/middleware';
import { getQuizzes } from '../services/quiz-service';
import { checkPermissions } from '../middleware/check-permissions';

const error403 = {
  error: 403,
  message: 'You do not have the permissions required to view this page.',
};
const error500 = {
  error: 500,
  message: 'Something went wrong, please try again.',
};

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
