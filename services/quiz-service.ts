import { Client } from 'pg';
import { options } from './options';
import { QuizList } from './quiz-service-types';

const connect = async (): Promise<Client> => {
  const client = new Client(options);
  await client.connect();
  return client;
};

export const getQuizzes = async (): Promise<QuizList> => {
  const client = await connect();
  const response = await client.query('SELECT * FROM quiz');
  client.end();
  const result = await response.rows;
  return result;
};

export const verifyQuizId = async (quizId: string): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM quiz WHERE quiz_id = $1;',
    [quizId]
  );
  client.end();
  if (response.rows[0]) {
    return true;
  }
};

export const addQuiz = async (
  quizName: string,
  quizDescription: string
): Promise<string> => {
  const client = await connect();
  const response = await client.query(
    'INSERT INTO quiz (quiz_name, quiz_description) VALUES($1, $2) RETURNING quiz_id',
    [quizName, quizDescription]
  );
  client.end();
  return response.rows[0]['quiz_id'];
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  const client = await connect();
  await client.query('DELETE FROM quiz WHERE quiz_id = $1', [quizId]);
  const response = await client.query(
    'DELETE FROM  question WHERE quiz_id = $1 RETURNING question_id',
    [quizId]
  );
  const questionId = response.rows[0]['question_id'];
  await client.query('DELETE FROM answer WHERE question_id = $1', [questionId]);
  client.end();
  return;
};

export const getQuiz = async (quizId: string): Promise<unknown> => {
  const client = await connect();
  const quizData = await client.query(
    'SELECT * FROM quiz WHERE quiz_id = $1;',
    [quizId]
  );
  const quiz = quizData.rows[0];

  const questionData = await client.query(
    'SELECT * FROM question WHERE quiz_id = $1;',
    [quizId]
  );
  const questions = questionData.rows;

  const getquestionIds = () => {
    const array: string[] = [];
    questions.map((question) => {
      array.push(question['question_id']);
    });
    return array;
  };
  const questionIds = getquestionIds();

  const answerData = await client.query(
    'SELECT * FROM answer WHERE question_id = ANY($1)',
    [questionIds]
  );
  client.end();
  const answers = answerData.rows;

  const questionsWithAnswers: unknown[] = [];
  const obj = {};
  questions.forEach((question) => {
    questionsWithAnswers.push({ ...question, answers: {} });
  });
  questionsWithAnswers.map((item: any) => (obj[item.question_id] = item));
  for (const item in obj) {
    answers.forEach((answer) => {
      if (answer.question_id == item) {
        obj[item]['answers'][answer.answer_id] = answer;
      }
    });
  }
  return {
    ...quiz,
    questions: obj,
  };
};
