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