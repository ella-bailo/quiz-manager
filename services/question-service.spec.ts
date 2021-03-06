const options: ClientConfig = {
  host: 'localhost',
  port: 5434,
  user: 'main',
  database: 'test-question-db',
  password: 'password',
};

jest.doMock('./options', () => ({ options }));
import { ClientConfig } from 'pg';
import {
  getQuestion,
  checkNumberOfQuestions,
  checkCorrectAnswerExists,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  updateCorrectAnswer,
} from './question-service';
import { addAnswer, getAnswer } from './answer-service';

const questionId = '30';
const quizId26Questions = '1';
const validQuizId = '2';
const invalidCorrectAnswer = '0';
const newQuestionQuizId = '3';
const newQuestionText = 'What percentage of the human body is water?';
const newQuestionId = '33';
const deletedAnswerId = '93';
const updateQuestionId = '32';
const updateQuestionText = 'test';
const updateCorrectAnswerQuestionId = '31';
const updateCorrectAnswerId = '97';

describe('question-service', () => {
  describe('checkNumberOfQuestions', () => {
    it('returns true if number of questions is less than 26', async () => {
      const result = await checkNumberOfQuestions(validQuizId);
      expect(result).toEqual(true);
    });
    it('returns undefined if number of questions is 26 or more', async () => {
      const result = await checkNumberOfQuestions(quizId26Questions);
      expect(result).toEqual(undefined);
    });
  });
  describe('checkCorrectAnswerExists', () => {
    it('returns true if the correct answer exists', async () => {
      const correctAnswer = await await addAnswer('A frog', questionId);
      const result = await checkCorrectAnswerExists(correctAnswer);
      expect(result).toEqual(true);
    });
    it('returns undefined if correct answer does not exist', async () => {
      const result = await checkCorrectAnswerExists(invalidCorrectAnswer);
      expect(result).toEqual(undefined);
    });
  });
  describe('addQuestion', () => {
    it('returns question id of new question', async () => {
      const result = await addQuestion(newQuestionText, newQuestionQuizId);
      expect(result).toEqual(newQuestionId);
    });
  });
  describe('deleteQuestion', () => {
    it('deletes question and corresponding answers and returns undefined', async () => {
      const response = await deleteQuestion(questionId);
      const question = await getQuestion(questionId);
      const answer = await getAnswer(deletedAnswerId);
      expect(response).toEqual(undefined);
      expect(question).toEqual(undefined);
      expect(answer).toEqual(undefined);
    });
  });
  describe('updateQuestion', () => {
    it('updates answer and returns undefined', async () => {
      const response = await updateQuestion(
        updateQuestionId,
        updateQuestionText
      );
      const question = await getQuestion(updateQuestionId);
      expect(response).toEqual(undefined);
      expect(question['question']).toEqual(updateQuestionText);
    });
  });
  describe('updateCorrectAnswer', () => {
    it('updates correct answer and returns undefined', async () => {
      const response = await updateCorrectAnswer(
        updateCorrectAnswerQuestionId,
        updateCorrectAnswerId
      );
      const question = await getQuestion(updateCorrectAnswerQuestionId);
      expect(response).toEqual(undefined);
      expect(question['correct_answer']).toEqual(updateCorrectAnswerId);
    });
  });
});
