-- Facial Recognition Data Table
CREATE TABLE IF NOT EXISTS facial_recognition_data (
    fr_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    model_data BYTEA,
    model_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Two-Factor Authentication Recovery Codes Table
CREATE TABLE IF NOT EXISTS recovery_codes (
    code_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    recovery_code VARCHAR(255) NOT NULL,
    valid_until TIMESTAMP NOT NULL
);