-- Inserting users
INSERT INTO UsersAuth (email, pass_hash, hasSet2FA) VALUES
('user1@example.com', 'hash1', TRUE),
('user2@example.com', 'hash2', FALSE),
('user3@example.com', 'hash3', TRUE);

-- Inserting activity categories
INSERT INTO ActivityCategories (category) VALUES
('Outdoor'),
('Indoor'),
('Water Sports');

-- Inserting activities linked to categories
INSERT INTO Activities (activity, category_id) VALUES
('Running', 1),
('Swimming', 3),
('Cycling', 1);

-- Inserting stats
INSERT INTO Stats (stat) VALUES
('Endurance'),
('Strength'),
('Agility');

-- Inserting activity base stats
INSERT INTO ActivityBaseStats (activity_id, stat_id, base_stat_value) VALUES
(1, 1, 10), -- Running increases Endurance by 10
(2, 2, 20), -- Swimming increases Strength by 20
(3, 3, 15); -- Cycling increases Agility by 15

-- Inserting sensors
INSERT INTO Sensors (sensor) VALUES
('Accelerometer'),
('Gyroscope'),
('GPS'),
('Pedometer');

-- Linking activities to sensors
INSERT INTO ActivitySensor (activity_id, sensor_id) VALUES
(1, 1),
(1, 3),
(2, 4),
(3, 2);

-- Inserting executed activities
INSERT INTO ExecutedActivities (user_id, activity_id, start_time, duration, is_active) VALUES
(1, 1, '2023-05-20 08:00:00', 60, TRUE),
(2, 2, '2023-05-20 09:00:00', 30, FALSE);

-- Inserting executed activity sensor data
INSERT INTO ExecutedActivitySensorData (value, timestamp, sensor_id, executed_activity_id) VALUES
('15 m/s', '2023-05-20 08:01:00', 1, 1),
('100 steps', '2023-05-20 08:02:00', 4, 1);

-- Inserting user current stats
INSERT INTO UserCurrentStats (user_id, stat_id, value) VALUES
(1, 1, 50),
(2, 2, 30);

-- Inserting stat levels
INSERT INTO StatLevels (level, required_exp) VALUES
(1, 100),
(2, 250),
(3, 375);

-- Inserting real-time stats (mock data assuming real-time updates are happening)
INSERT INTO RealTimeStats (executed_activity_id, stat_id, current_value, last_updated) VALUES
(1, 1, 55, '2023-05-20 08:05:00');

-- Inserting activity summaries (example of how summaries might be stored post-activity)
INSERT INTO ActivitySummary (executed_activity_id, summary_details) VALUES
(1, 'Total distance run: 5km, average speed: 10km/h');
