CREATE TABLE IF NOT EXISTS UsersAuth (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    hasSet2FA BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ActivityCategories (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Stats (
    id SERIAL PRIMARY KEY,
    stat VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Activities (
    id SERIAL PRIMARY KEY,
    activity VARCHAR(255) NOT NULL,
    category_id INT REFERENCES ActivityCategories(id)
);

CREATE TABLE IF NOT EXISTS ActivityBaseStats (
    activity_id INT REFERENCES Activities(id),
    stat_id INT REFERENCES Stats(id),
    base_stat_value INT,
    PRIMARY KEY (activity_id, stat_id)
);

CREATE TABLE IF NOT EXISTS Sensors (
    id SERIAL PRIMARY KEY,
    sensor VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS ActivitySensor (
    activity_id INT REFERENCES Activities(id),
    sensor_id INT REFERENCES Sensors(id),
    PRIMARY KEY (activity_id, sensor_id)
);

CREATE TABLE IF NOT EXISTS ExecutedActivities (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES UsersAuth(id),
    activity_id INT REFERENCES Activities(id),
    start_time TIMESTAMP NOT NULL,
    duration INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ExecutedActivitySensorData (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    sensor_id INT REFERENCES Sensors(id),
    executed_activity_id INT REFERENCES ExecutedActivities(id)
);

CREATE TABLE IF NOT EXISTS UserCurrentStats (
    user_id INT REFERENCES UsersAuth(id),
    stat_id INT REFERENCES Stats(id),
    value INT,
    PRIMARY KEY (user_id, stat_id)
);

CREATE TABLE IF NOT EXISTS StatLevels (
    id SERIAL PRIMARY KEY,
    level INT UNIQUE NOT NULL,
    required_exp INT NOT NULL
);

CREATE TABLE IF NOT EXISTS RealTimeStats (
    id SERIAL PRIMARY KEY,
    executed_activity_id INT REFERENCES ExecutedActivities(id),
    stat_id INT REFERENCES Stats(id),
    current_value INT,
    last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ActivitySummary (
    id SERIAL PRIMARY KEY,
    executed_activity_id INT REFERENCES ExecutedActivities(id),
    summary_details TEXT
);

CREATE TABLE IF NOT EXISTS StrengthExercisesScrapeData (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS SportsScrapeData (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rating VARCHAR(255)
);
