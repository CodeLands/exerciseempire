import React, { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import styles from './ActivityHistory.module.css';
import axios from 'axios';
//import { useAuth } from '../auth/AuthContext';

enum Attributes {
  Strength = 'Strength',
  Endurance = 'Endurance',
  Flexibility = 'Flexibility',
  Agility = 'Agility',
}

interface Attribute {
  name: Attributes;
  percent: number;
}

interface Activity {
  id: number;
  description: string;
  date: string;
  attributes: Attribute[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

const ActivityHistory: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  //const {user} = useAuth()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(apiBaseUrl + '/list-activity-stats', {
          params: { user_id: /* user.id */ 1 } // Replace with the actual user ID
        });

        console.log('Response:', response); // Log the full response for debugging

        if (response.data && response.data.success) {
          const data = response.data.data;
          const activitiesMap: { [key: number]: Activity } = {};

          data.forEach((entry: any) => {
            if (!activitiesMap[entry.executed_activity_id]) {
              activitiesMap[entry.executed_activity_id] = {
                id: entry.executed_activity_id,
                description: `Activity ${entry.activity_id}`, // Replace with actual description if available
                date: new Date(entry.start_time).toLocaleDateString(),
                attributes: []
              };
            }
            activitiesMap[entry.executed_activity_id].attributes.push({
              name: entry.stat as Attributes,
              percent: entry.current_value,
            });
          });

          console.log('Activities Map:', activitiesMap); // Log the transformed activities map

          setActivities(Object.values(activitiesMap));
        } else {
          console.error('Failed response structure:', response.data);
          setError('Failed to fetch activity stats');
        }
      } catch (error) {
        console.error('Error fetching activity stats:', error);
        setError('Error fetching activity stats');
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={`${styles.activityHistory} bg-white dark:bg-gray-800 p-6 rounded shadow-md`}>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Activity History</h2>
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default ActivityHistory;