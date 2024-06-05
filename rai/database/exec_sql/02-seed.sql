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
('Cycling', 1),
('Climbing', 1),
('Yoga', 2),
('Surfing', 3),
('Skiing', 1),
('Hiking', 1),
('Rowing', 3),
('Tennis', 1),
('Boxing', 2),
('Diving', 3);

-- Inserting stats
INSERT INTO Stats (stat) VALUES
('Endurance'),
('Strength'),
('Agility');

-- Inserting activity base stats
INSERT INTO ActivityBaseStats (activity_id, stat_id, base_stat_value) VALUES
(1, 1, 10), -- Running increases Endurance by 10
(1, 2, 20), -- Running increases Strength by 20
(1, 3, 15), -- Running increases Agility by 15
(2, 1, 10), -- Swimming increases Endurance by 10
(2, 2, 20), -- Swimming increases Strength by 20
(2, 3, 15), -- Swimming increases Agility by 15
(3, 1, 10), -- Cycling increases Endurance by 10
(3, 2, 20), -- Cycling increases Strength by 20
(3, 3, 15), -- Cycling increases Agility by 15
(4, 1, 10), -- Climbing increases Endurance by 10
(4, 2, 20), -- Climbing increases Strength by 20
(4, 3, 15), -- Climbing increases Agility by 15
(5, 1, 10), -- Yoga increases Endurance by 10
(5, 2, 20), -- Yoga increases Strength by 20
(5, 3, 15), -- Yoga increases Agility by 15
(6, 1, 10), -- Surfing increases Endurance by 10
(6, 2, 20), -- Surfing increases Strength by 20
(6, 3, 15), -- Surfing increases Agility by 15
(7, 1, 10), -- Skiing increases Endurance by 10
(7, 2, 20), -- Skiing increases Strength by 20
(7, 3, 15), -- Skiing increases Agility by 15
(8, 1, 15), -- Hiking increases Endurance by 15
(8, 2, 10), -- Hiking increases Strength by 10
(8, 3, 10), -- Hiking increases Agility by 10
(9, 1, 15), -- Rowing increases Endurance by 15
(9, 2, 25), -- Rowing increases Strength by 25
(9, 3, 10), -- Rowing increases Agility by 10
(10, 1, 10), -- Tennis increases Endurance by 10
(10, 2, 20), -- Tennis increases Strength by 20
(10, 3, 20), -- Tennis increases Agility by 20
(11, 1, 5), -- Boxing increases Endurance by 5
(11, 2, 30), -- Boxing increases Strength by 30
(11, 3, 25), -- Boxing increases Agility by 25
(12, 1, 20), -- Diving increases Endurance by 20
(12, 2, 10), -- Diving increases Strength by 10
(12, 3, 15); -- Diving increases Agility by 15

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
(3, 2),
(8, 1),
(8, 3),
(9, 2),
(9, 4),
(10, 1),
(11, 2),
(12, 4);

-- Inserting executed activities
INSERT INTO ExecutedActivities (user_id, activity_id, start_time, duration, is_active) VALUES
(1, 1, '2024-05-20 08:00:00', 60, TRUE),
(1, 2, '2024-05-22 08:00:00', 90, FALSE),
(1, 3, '2024-05-23 08:00:00', 20, FALSE),
(1, 4, '2024-05-24 08:00:00', 50, FALSE),
(1, 5, '2024-05-25 08:00:00', 40, FALSE),
(1, 6, '2024-05-26 08:00:00', 40, FALSE),
(1, 7, '2024-05-27 08:00:00', 40, FALSE),
(1, 8, '2024-05-28 08:00:00', 60, FALSE),
(1, 9, '2024-05-30 08:00:00', 90, FALSE),
(1, 10, '2024-06-02 08:00:00', 45, FALSE),
(1, 11, '2024-06-03 08:00:00', 30, FALSE),
(1, 12, '2024-06-05 08:00:00', 20, FALSE),
(2, 1, '2024-05-27 09:00:00', 20, FALSE),
(2, 2, '2024-05-28 08:00:00', 10, FALSE),
(2, 3, '2024-05-30 08:00:00', 10, FALSE),
(2, 4, '2024-06-01 08:00:00', 20, FALSE),
(2, 5, '2024-06-02 08:00:00', 30, FALSE),
(2, 6, '2024-06-03 08:00:00', 50, FALSE),
(2, 7, '2024-06-04 08:00:00', 70, FALSE);

-- Inserting executed activity sensor data
INSERT INTO ExecutedActivitySensorData (value, timestamp, sensor_id, executed_activity_id) VALUES
('15 m/s', '2024-05-20 08:01:00', 1, 1),
('100 steps', '2024-05-20 08:02:00', 4, 1),
('12 m/s', '2024-05-22 08:11:00', 4, 2),
('10 m/s^2', '2024-05-23 08:15:00', 2, 3),
('150 steps', '2024-05-24 08:20:00', 4, 4),
('13 m/s', '2024-05-25 08:25:00', 1, 5),
('8 m/s^2', '2024-05-26 08:30:00', 2, 6),
('9 m/s', '2024-05-27 08:35:00', 1, 7),
('160 steps', '2024-05-28 08:40:00', 4, 8),
('15 m/s', '2024-05-30 08:50:00', 2, 9),
('10 m/s^2', '2024-06-02 08:55:00', 1, 10),
('11 m/s', '2024-06-03 09:00:00', 2, 11),
('200 steps', '2024-06-05 09:05:00', 4, 12),
('9 m/s', '2024-05-27 09:10:00', 1, 13),
('100 steps', '2024-05-27 09:15:00', 4, 13),
('10 m/s^2', '2024-05-28 09:20:00', 2, 14),
('150 steps', '2024-05-30 09:25:00', 4, 15),
('12 m/s', '2024-06-01 09:30:00', 3, 16),
('8 m/s^2', '2024-06-02 09:35:00', 2, 17),
('7 m/s', '2024-06-03 09:40:00', 1, 18),
('110 steps', '2024-06-04 09:45:00', 4, 19);

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
(1, 1, 55, '2024-05-20 08:05:00'), -- Endurance for Running
(1, 2, 30, '2024-05-20 08:06:00'), -- Strength for Running
(1, 3, 25, '2024-05-20 08:07:00'), -- Agility for Running
(2, 1, 40, '2024-05-22 09:05:00'), -- Endurance for Swimming
(2, 2, 20, '2024-05-22 09:06:00'), -- Strength for Swimming
(2, 3, 15, '2024-05-22 09:07:00'), -- Agility for Swimming
(3, 1, 45, '2024-05-24 08:10:00'), -- Endurance for Cycling
(3, 2, 25, '2024-05-24 08:11:00'), -- Strength for Cycling
(3, 3, 20, '2024-05-24 08:12:00'), -- Agility for Cycling
(4, 1, 50, '2024-05-26 08:13:00'), -- Endurance for Climbing
(4, 2, 30, '2024-05-26 08:14:00'), -- Strength for Climbing
(4, 3, 25, '2024-05-26 08:15:00'), -- Agility for Climbing
(5, 1, 35, '2024-05-28 08:16:00'), -- Endurance for Yoga
(5, 2, 20, '2024-05-28 08:17:00'), -- Strength for Yoga
(5, 3, 15, '2024-05-28 08:18:00'), -- Agility for Yoga
(6, 1, 60, '2024-05-30 08:19:00'), -- Endurance for Surfing
(6, 2, 35, '2024-05-30 08:20:00'), -- Strength for Surfing
(6, 3, 30, '2024-05-30 08:21:00'), -- Agility for Surfing
(7, 1, 55, '2024-06-01 08:22:00'), -- Endurance for Skiing
(7, 2, 40, '2024-06-01 08:23:00'), -- Strength for Skiing
(7, 3, 35, '2024-06-01 08:24:00'), -- Agility for Skiing
(8, 1, 65, '2024-06-05 08:30:00'), -- Endurance for Hiking
(8, 2, 25, '2024-06-05 08:31:00'), -- Strength for Hiking
(8, 3, 30, '2024-06-05 08:32:00'), -- Agility for Hiking
(9, 1, 70, '2024-06-06 08:40:00'), -- Endurance for Rowing
(9, 2, 45, '2024-06-06 08:41:00'), -- Strength for Rowing
(9, 3, 35, '2024-06-06 08:42:00'), -- Agility for Rowing
(10, 1, 55, '2024-06-07 08:50:00'), -- Endurance for Tennis
(10, 2, 60, '2024-06-07 08:51:00'), -- Strength for Tennis
(10, 3, 40, '2024-06-07 08:52:00'), -- Agility for Tennis
(11, 1, 50, '2024-06-08 09:00:00'), -- Endurance for Boxing
(11, 2, 70, '2024-06-08 09:01:00'), -- Strength for Boxing
(11, 3, 55, '2024-06-08 09:02:00'), -- Agility for Boxing
(12, 1, 75, '2024-06-09 09:10:00'), -- Endurance for Diving
(12, 2, 35, '2024-06-09 09:11:00'), -- Strength for Diving
(12, 3, 45, '2024-06-09 09:12:00'), -- Agility for Diving
(13, 1, 55, '2024-05-20 08:05:00'), -- Endurance for Running
(13, 2, 30, '2024-05-20 08:06:00'), -- Strength for Running
(13, 3, 25, '2024-05-20 08:07:00'), -- Agility for Running
(14, 1, 40, '2024-05-22 09:05:00'), -- Endurance for Swimming
(14, 2, 20, '2024-05-22 09:06:00'), -- Strength for Swimming
(14, 3, 15, '2024-05-22 09:07:00'), -- Agility for Swimming
(15, 1, 45, '2024-05-24 08:10:00'), -- Endurance for Cycling
(15, 2, 25, '2024-05-24 08:11:00'), -- Strength for Cycling
(15, 3, 20, '2024-05-24 08:12:00'), -- Agility for Cycling
(16, 1, 50, '2024-05-26 08:13:00'), -- Endurance for Climbing
(16, 2, 30, '2024-05-26 08:14:00'), -- Strength for Climbing
(16, 3, 25, '2024-05-26 08:15:00'), -- Agility for Climbing
(17, 1, 35, '2024-05-28 08:16:00'), -- Endurance for Yoga
(17, 2, 20, '2024-05-28 08:17:00'), -- Strength for Yoga
(17, 3, 15, '2024-05-28 08:18:00'), -- Agility for Yoga
(18, 1, 60, '2024-05-30 08:19:00'), -- Endurance for Surfing
(18, 2, 35, '2024-05-30 08:20:00'), -- Strength for Surfing
(18, 3, 30, '2024-05-30 08:21:00'), -- Agility for Surfing
(19, 1, 55, '2024-06-01 08:22:00'), -- Endurance for Skiing
(19, 2, 40, '2024-06-01 08:23:00'), -- Strength for Skiing
(19, 3, 35, '2024-06-01 08:24:00'); -- Agility for Skiing

-- Inserting activity summaries (example of how summaries might be stored post-activity)
INSERT INTO ActivitySummary (executed_activity_id, summary_details) VALUES
(1, 'Total distance run: 5km, average speed: 10km/h'),
(2, 'Total distance swam: 1km, average speed: 2km/h'),
(3, 'Total distance cycled: 20km, average speed: 15km/h'),
(4, 'Total distance climbed: 500m, average speed: 2m/min'),
(5, 'Total time spent in Yoga: 1 hour'),
(6, 'Total distance surfed: 3km, average speed: 5km/h'),
(7, 'Total distance skied: 10km, average speed: 10km/h'),
(8, 'Total distance hiked: 10km, average speed: 5km/h'),
(9, 'Total distance rowed: 15km, average speed: 8km/h'),
(10, 'Total time spent playing tennis: 1.5 hours'),
(11, 'Total time spent boxing: 1 hour'),
(12, 'Total time spent diving: 45 minutes'),
(13, 'Total distance run: 5km, average speed: 10km/h'),
(14, 'Total distance swam: 1km, average speed: 2km/h'),
(15, 'Total distance cycled: 20km, average speed: 15km/h'),
(16, 'Total distance climbed: 500m, average speed: 2m/min'),
(17, 'Total time spent in Yoga: 1 hour'),
(18, 'Total distance surfed: 3km, average speed: 5km/h'),
(19, 'Total distance skied: 10km, average speed: 10km/h');