CREATE TABLE accelerometer_summaries (
    summary_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    date DATE NOT NULL,
    average_x REAL NOT NULL,
    average_y REAL NOT NULL,
    average_z REAL NOT NULL,
    min_x REAL NOT NULL,
    min_y REAL NOT NULL,
    min_z REAL NOT NULL,
    max_x REAL NOT NULL,
    max_y REAL NOT NULL,
    max_z REAL NOT NULL
);