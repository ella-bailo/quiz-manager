import express from 'express';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { router as userRouter } from './routes/users';
import { router as quizRouter } from './routes/quiz';

const app = express();
const port = process.env.PORT || 3000;
const error404 = { error: 404, message: 'Page not found.' };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'handlebars');

app.engine(
  'handlebars',
  handlebars({
    layoutsDir: `./views/layouts`,
    helpers: {
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          '+': lvalue + rvalue,
        }[operator];
      },
      json: function (context) {
        return JSON.stringify(context);
      },
    },
  })
);

app.use('/', userRouter);
app.use('/quiz', quizRouter);
app.use((_, res) => {
  res.render('error-page.handlebars', error404);
});

app.listen(port, () => console.log(`Running on port ${port}`));

module.exports = app;
