DROP TABLE users;

CREATE TABLE users (
    id        varchar(80) primary key,
    rev       varchar(80),
    pw        varchar(80),
    balance   real,
    gems      int,
    score     int
);

INSERT INTO users VALUES ('a', '0', 'a', 5, 0, 0);
INSERT INTO users VALUES ('b', '0', 'b', 0, 0, 0);

