const options: ClientConfig = {
  host: 'localhost',
  port: 5435,
  user: 'main',
  database: 'test-answer-db',
  password: 'password',
};

jest.doMock('./options', () => ({ options }));
import { ClientConfig } from 'pg';
import {
  getAnswer,
  checkNumberOfAnswersLessThanFive,
  checkNumberOfAnswersMoreThanThree,
  addAnswer,
  checkAnswerIsNotCorrect,
  deleteAnswer,
  updateAnswer,
} from './answer-service';

const questionId = '1';
const questionIdFiveAnswers = '30';
const newAnswerText = 'Mg';
const newAnswerQuestionId = '31';
const newAnswerId = '103';
const correctAnswerId = '80';
const incorrectAnswerId = '82';
const deleteAnswerId = incorrectAnswerId;
const updateAnswerId = '81';
const updateAnswerText = 'will be';

describe('answer-service', () => {
  describe('checkNumberOfAnswersLessThanFive', () => {
    it('returns true if number of answers is less than five', async () => {
      const result = await checkNumberOfAnswersLessThanFive(questionId);
      expect(result).toEqual(true);
    });
    it('returns undefined if the number of answers is more than 4', async () => {
      const result = await checkNumberOfAnswersLessThanFive(
        questionIdFiveAnswers
      );
      expect(result).toEqual(undefined);
    });
  });
  describe('checkNumberOfAnswersMoreThanThree', () => {
    it('returns true if number of answers is more than three', async () => {
      const result = await checkNumberOfAnswersMoreThanThree(
        questionIdFiveAnswers
      );
      expect(result).toEqual(true);
    });
    it('returns undefined if the number of answers is more than 4', async () => {
      const result = await checkNumberOfAnswersMoreThanThree(questionId);
      expect(result).toEqual(undefined);
    });
  });
  describe('addAnswer', () => {
    it('returns answer id of new answer', async () => {
      const result = await addAnswer(newAnswerText, newAnswerQuestionId);
      expect(result).toEqual(newAnswerId);
    });
  });
  describe('checkAnswerIsNotCorrect', () => {
    it('returns true if the answer is not correct', async () => {
      const result = await checkAnswerIsNotCorrect(incorrectAnswerId);
      expect(result).toEqual(true);
    });
    it('returns undefined if the answer is correct', async () => {
      const result = await checkAnswerIsNotCorrect(correctAnswerId);
      expect(result).toEqual(undefined);
    });
  });
  describe('deleteAnswer', () => {
    it('deletes answer and returns undefined', async () => {
      const response = await deleteAnswer(deleteAnswerId);
      const answer = await getAnswer(deleteAnswerId);
      expect(response).toEqual(undefined);
      expect(answer).toEqual(undefined);
    });
  });
  describe('updateAnswer', () => {
    it('updates answer and returns undefined', async () => {
      const response = await updateAnswer(updateAnswerId, updateAnswerText);
      const answer = await getAnswer(updateAnswerId);
      expect(response).toEqual(undefined);
      expect(answer['answer']).toEqual(updateAnswerText);
    });
  });
});
