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