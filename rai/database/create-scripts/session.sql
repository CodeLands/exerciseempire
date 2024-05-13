-- CREATE TABLE IF NOT EXISTS session (
--   sid varchar NOT NULL PRIMARY KEY,
--   sess json NOT NULL,
--   expire timestamp(6) NOT NULL
-- );

-- Session Table for Storing Login Sessions and Device Tokens
CREATE TABLE IF NOT EXISTS sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    device_token VARCHAR(255),
    session_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP
);