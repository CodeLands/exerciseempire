-- Insert data into 'users'
INSERT INTO users (username, email, pass_hash) VALUES
('john_doe', 'john.doe@example.com', 'hashedpassword123'),
('jane_doe', 'jane.doe@example.com', 'hashedpassword456');

-- Insert data into 'stats'
INSERT INTO stats (name, description) VALUES
('Strength', 'Measures the strength capacity of a user.'),
('Stamina', 'Measures the stamina endurance of a user.');

-- Insert data into 'user_stats'
INSERT INTO user_stats (user_id, stat_id, level, experience) VALUES
(1, 1, 1, 0),
(1, 2, 1, 0),
(2, 1, 1, 0),
(2, 2, 1, 0);

-- Insert data into 'level_requirements'
INSERT INTO level_requirements (level, exp_required) VALUES
(1, 0),
(2, 100),
(3, 300),
(4, 600);

-- Insert accelerometer data
INSERT INTO accelerometer_data (user_id, timestamp, x_axis, y_axis, z_axis) VALUES
(1, NOW(), 0.5, 1.2, 0.7),
(2, NOW(), 0.4, 1.1, 0.6);

-- Insert gyroscope data
INSERT INTO gyroscope_data (user_id, timestamp, x_rotation, y_rotation, z_rotation) VALUES
(1, NOW(), 30, 60, 90),
(2, NOW(), 35, 65, 95);

-- Insert GPS data
INSERT INTO gps_data (user_id, timestamp, latitude, longitude, altitude) VALUES
(1, NOW(), 34.0522, -118.2437, 305),
(2, NOW(), 40.7128, -74.0060, 10);

-- Insert data into 'accelerometer_summaries' (if using summary tables)
INSERT INTO accelerometer_summaries (user_id, date, average_x, average_y, average_z, min_x, min_y, min_z, max_x, max_y, max_z) VALUES
(1, '2023-05-01', 0.55, 1.25, 0.75, 0.5, 1.2, 0.7, 0.6, 1.3, 0.8),
(2, '2023-05-01', 0.45, 1.15, 0.65, 0.4, 1.1, 0.6, 0.5, 1.2, 0.7);

-- Assuming you also want to add recovery_codes and sessions as mentioned
-- Insert recovery codes for users
INSERT INTO recovery_codes (user_id, recovery_code, valid_until) VALUES
(1, 'ABC123XYZ', NOW() + INTERVAL '1 day'),
(2, 'XYZ789ABC', NOW() + INTERVAL '1 day');

-- Insert session data for users
INSERT INTO sessions (user_id, device_token, session_start, session_end) VALUES
(1, 'devicetoken1234', NOW(), NOW() + INTERVAL '1 hour'),
(2, 'devicetoken5678', NOW(), NOW() + INTERVAL '1 hour');
