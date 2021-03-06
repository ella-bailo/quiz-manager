import { Client } from 'pg';
import { options } from './options';

const connect = async (): Promise<Client> => {
  const client = new Client(options);
  await client.connect();
  return client;
};

type Question = {
  question_id: number;
  question_string: string;
  correct_answer: number;
};

export const getQuestion = async (questionId: string): Promise<Question> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM question WHERE question_id = $1',
    [questionId]
  );
  client.end();
  return response.rows[0];
};

export const checkNumberOfQuestions = async (
  quizId: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM question WHERE quiz_id = $1',
    [quizId]
  );
  client.end();

  if (response.rows.length < 25) {
    return true;
  }
};

export const checkCorrectAnswerExists = async (
  correctAnswer: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM answer where answer_id = $1',
    [correctAnswer]
  );
  client.end();
  if (response.rows[0]) {
    return true;
  }
};

export const addQuestion = async (
  question: string,
  quizId: string
): Promise<string> => {
  const client = await connect();
  const response = await client.query(
    'INSERT INTO question (question, correct_answer, quiz_id) VALUES($1, 0, $2) RETURNING question_id',
    [question, quizId]
  );
  client.end();
  return response.rows[0]['question_id'];
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const client = await connect();
  await client.query('DELETE FROM question WHERE question_id = $1', [
    questionId,
  ]);
  client.end();
  return;
};

export const updateQuestion = async (
  questionId: string,
  updateText: string
): Promise<void> => {
  const client = await connect();
  await client.query(
    'UPDATE question SET question = $1 WHERE question_id = $2',
    [updateText, questionId]
  );
  client.end();
  return;
};

export const updateCorrectAnswer = async (
  questionId: string,
  updateId: string
): Promise<void> => {
  const client = await connect();
  await client.query(
    'UPDATE question SET correct_answer = $1 WHERE question_id = $2',
    [updateId, questionId]
  );
  client.end();
  return;
};
