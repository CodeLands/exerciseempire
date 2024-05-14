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

-- Accelerometer Data Table
CREATE TABLE IF NOT EXISTS accelerometer_data (
    data_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    timestamp TIMESTAMP NOT NULL,
    x_axis REAL NOT NULL,
    y_axis REAL NOT NULL,
    z_axis REAL NOT NULL
);

-- Gyroscope Data Table
CREATE TABLE IF NOT EXISTS gyroscope_data (
    data_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    timestamp TIMESTAMP NOT NULL,
    x_rotation REAL NOT NULL,
    y_rotation REAL NOT NULL,
    z_rotation REAL NOT NULL
);

-- GPS Data Table
CREATE TABLE IF NOT EXISTS gps_data (
    data_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    timestamp TIMESTAMP NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    altitude REAL NOT NULL
);

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

-- Stats Table
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    stat_id INT REFERENCES stats(id),
    level INT NOT NULL DEFAULT 1,
    experience INT NOT NULL DEFAULT 0
);

-- Level Requirements Table
CREATE TABLE IF NOT EXISTS level_requirements (
    level INT PRIMARY KEY,
    exp_required INT NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);