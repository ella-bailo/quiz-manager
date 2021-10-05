const options: ClientConfig = {
  host: 'localhost',
  port: 5436,
  user: 'main',
  database: 'test-quiz-db',
  password: 'password',
};

jest.doMock('./options', () => ({ options }));
import { ClientConfig } from 'pg';
import {
  getQuizzes,
  getQuiz,
  verifyQuizId,
  addQuiz,
  deleteQuiz,
} from './quiz-service';
import { getQuestion } from './question-service';
import { getAnswer } from './answer-service';

const newQuizName = 'Test quiz';
const newQuizDescription = 'Test quiz description';
const newQuizId = '4';
const deletedQuizId = '1';
const deletedQuestionId = '1';
const deletedAnswerId = '1';

const sampleQuizOne = {
  quiz_id: '1',
  quiz_name: 'Maths Quiz',
  quiz_description: 'A quiz about maths!',
};

const sampleQuizTwo = {
  quiz_id: '2',
  quiz_name: 'English Quiz',
  quiz_description: 'A quiz about english!',
};

const sampleQuizThree = {
  quiz_id: '3',
  quiz_name: 'Science Quiz',
  quiz_description: 'A quiz about science!',
};

const validQuizId = '3';
const invalidQuizId = '100';

const sampleQuiz = {
  quiz_description: 'A quiz about science!',
  quiz_id: '3',
  quiz_name: 'Science Quiz',
  questions: {
    '30': {
      answers: {
        '92': { answer: 'A gas', answer_id: '92', question_id: '30' },
        '93': { answer: 'A solid', answer_id: '93', question_id: '30' },
        '94': { answer: 'A liquid', answer_id: '94', question_id: '30' },
        '95': { answer: 'A vaccum', answer_id: '95', question_id: '30' },
        '96': { answer: 'An element', answer_id: '96', question_id: '30' },
      },
      correct_answer: '94',
      question: 'What is water?',
      question_id: '30',
      quiz_id: '3',
    },
    '31': {
      answers: {
        '97': { answer: 'Li', answer_id: '97', question_id: '31' },
        '98': { answer: 'Pb', answer_id: '98', question_id: '31' },
        '99': { answer: 'Ag', answer_id: '99', question_id: '31' },
      },
      correct_answer: '98',
      question: 'What is the symbol for lead?',
      question_id: '31',
      quiz_id: '3',
    },
    '32': {
      answers: {
        '100': {
          answer: 'A type of fish',
          answer_id: '100',
          question_id: '32',
        },
        '101': { answer: 'An organ', answer_id: '101', question_id: '32' },
        '102': { answer: 'An illness', answer_id: '102', question_id: '32' },
      },
      correct_answer: '100',
      question: 'What is the heart?',
      question_id: '32',
      quiz_id: '3',
    },
  },
};

beforeEach(() => {
  options.host = 'localhost';
  options.port = 5433;
  options.user = 'main';
  options.database = 'quiz-manager-db';
  options.password = 'password';
});

describe('quiz-service', () => {
  describe('getQuizzes', () => {
    it('returns a list of quizzes', async () => {
      const result = await getQuizzes();
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining(sampleQuizOne),
          expect.objectContaining(sampleQuizTwo),
          expect.objectContaining(sampleQuizThree),
        ])
      );
    });
  });
  describe('verifyQuizId', () => {
    it('returns true if quizId is in the database', async () => {
      const result = await verifyQuizId(validQuizId);
      expect(result).toEqual(true);
    });
    it('returns undefined if quizId is not the database', async () => {
      const result = await verifyQuizId(invalidQuizId);
      expect(result).toEqual(undefined);
    });
  });
  describe('addQuiz', () => {
    it('returns quiz id of new quiz', async () => {
      const result = await addQuiz(newQuizName, newQuizDescription);
      expect(result).toEqual(newQuizId);
    });
  });
  describe('deleteQuiz', () => {
    it('deletes quiz and corresponding questions and answers and returns undefined', async () => {
      const response = await deleteQuiz(deletedQuizId);
      const question = await getQuestion(deletedQuestionId);
      const answer = await getAnswer(deletedAnswerId);
      expect(response).toEqual(undefined);
      expect(question).toEqual(undefined);
      expect(answer).toEqual(undefined);
    });
  });
  describe('getQuiz', () => {
    it('returns a quiz of the correct structure', async () => {
      const result = await getQuiz(validQuizId);
      expect(result).toEqual(sampleQuiz);
    });
  });
});
