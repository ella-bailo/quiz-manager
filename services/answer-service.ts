import { Client } from 'pg';
import { options } from './options';

const connect = async (): Promise<Client> => {
  const client = new Client(options);
  await client.connect();
  return client;
};

type Answer = {
  answer_id: number;
  answer: string;
};

export const getAnswer = async (answerId: string): Promise<Answer> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM answer WHERE answer_id = $1',
    [answerId]
  );
  return response.rows[0];
};

export const checkNumberOfAnswers = async (
  answerId: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT question_id FROM answer WHERE answer_id = $1',
    [answerId]
  );
  const questionId = response.rows[0]['question_id'];
  const secondResponse = await client.query(
    'SELECT * FROM answer WHERE question_id = $1',
    [questionId]
  );
  client.end();
  if (secondResponse.rows.length < 5) {
    return true;
  }
};

export const addAnswer = async (
  answer: string,
  questionId: string
): Promise<string> => {
  const client = await connect();
  const response = await client.query(
    'INSERT INTO answer (answer, question_id) VALUES($1, $2) RETURNING answer_id',
    [answer, questionId]
  );
  return response.rows[0]['answer_id'];
};

export const checkAnswerIsNotCorrect = async (
  answerId: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT question_id FROM answer WHERE answer_id = $1',
    [answerId]
  );
  const questionId = response.rows[0].question_id;

  const secondResponse = await client.query(
    'SELECT * FROM question WHERE correct_answer = $1 AND  question_id = $2',
    [answerId, questionId]
  );
  if (secondResponse.rows[0]) {
    return undefined;
  }
  return true;
};

export const deleteAnswer = async (answerId: string): Promise<void> => {
  const client = await connect();
  await client.query('DELETE FROM answer WHERE answer_id = $1', [answerId]);
  return;
};

export const updateAnswer = async (
  answerId: string,
  updateText: string
): Promise<void> => {
  const client = await connect();
  await client.query('UPDATE answer SET answer = $1 WHERE answer_id = $2', [
    updateText,
    answerId,
  ]);
  return;
};
