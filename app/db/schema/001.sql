CREATE TABLE user_account (
    uuid bigserial,
    username varchar(255) UNIQUE NOT NULL,
    user_type smallint DEFAULT 1,
    salt varchar NOT NULL,
    hashed_password varchar(255) NOT NULL,
    PRIMARY KEY (uuid),
    CONSTRAINT valid_user_type CHECK (user_type < 4 AND user_type > 0)
);