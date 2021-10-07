CREATE TABLE user_account (
    uuid bigserial,
    username varchar(255) UNIQUE NOT NULL,
    user_type smallint DEFAULT 1,
    salt varchar NOT NULL,
    hashed_password varchar(255) NOT NULL,
    PRIMARY KEY (uuid),
    CONSTRAINT valid_user_type CHECK (user_type < 4 AND user_type > 0)
);

CREATE TABLE quiz (
    quiz_id bigserial,
    quiz_name varchar UNIQUE NOT NULL,
    quiz_description varchar NOT NULL,
    PRIMARY KEY (quiz_id)
);

CREATE TABLE question (
    question_id bigserial,
    quiz_id bigint,
    question varchar NOT NULL, 
    correct_answer bigint NOT NULL,
    PRIMARY KEY (question_id),
    CONSTRAINT fk_quiz FOREIGN KEY(quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE
);

CREATE TABLE answer (
    answer_id bigserial,
    question_id bigint,
    answer varchar NOT NULL,
    CONSTRAINT fk_question FOREIGN KEY(question_id) REFERENCES question(question_id) ON DELETE CASCADE
);

CREATE INDEX quiz_idx ON quiz (quiz_id);
CREATE INDEX question_idx ON question (question_id);
CREATE INDEX answer_idx ON answer (answer_id);