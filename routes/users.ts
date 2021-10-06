import express from 'express';
import {
  getPayload,
  verifyPassword,
  verifyUsername,
  hashPassword,
} from '../services/login-service';
export const router = express.Router();

router.get('/log-out', (_, res) => {
  res.clearCookie('X-JWT-Token');
  res.redirect(302, '/');
});

router.get('/', (_, res) => {
  res.render('log-in.handlebars');
});

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const error = 'username and password must be provided';
      return res.render('log-in.handlebars', { error: error });
    }
    const verifyUser = await verifyUsername(username);
    if (verifyUser == undefined) {
      const error = 'username does not exist';
      res.render('log-in.handlebars', { error: error });
    }
    const hashedPassword = await hashPassword(username, password);
    const verifyPass = await verifyPassword(username, hashedPassword);
    if (verifyPass == undefined) {
      const error = 'password is incorrect';
      res.render('log-in.handlebars', { error: error });
    }
    if (verifyUser && verifyPass) {
      const payload = await getPayload(username, hashedPassword);
      res.cookie('X-JWT-Token', payload.token, {
        maxAge: 1000 * 60 * 10,
        httpOnly: false,
      });
      res.redirect(302, '/quiz/all');
    }
  } catch {
    return res.render('log-in.handlebars');
  }
});
