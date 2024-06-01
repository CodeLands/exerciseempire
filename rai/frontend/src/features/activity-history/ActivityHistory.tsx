import React from 'react';
import ActivityItem from './ActivityItem';
import styles from './ActivityHistory.module.css';

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

const activities: Activity[] = [
  {
    id: 1,
    description: '50km marathon in the mountains',
    date: '2024-05-01',
    attributes: [
      { name: Attributes.Strength, percent: 20 },
      { name: Attributes.Endurance, percent: 70 },
      { name: Attributes.Flexibility, percent: 5 },
      { name: Attributes.Agility, percent: 5 },
    ],
  },
  {
    id: 2,
    description: 'Hiking in Kranjska Gora',
    date: '2024-05-05',
    attributes: [
      { name: Attributes.Strength, percent: 20 },
      { name: Attributes.Endurance, percent: 50 },
      { name: Attributes.Flexibility, percent: 10 },
      { name: Attributes.Agility, percent: 20 },
    ],
  },
  {
    id: 3,
    description: 'Gym workout',
    date: '2024-05-10',
    attributes: [
      { name: Attributes.Strength, percent: 25 },
      { name: Attributes.Endurance, percent: 25 },
      { name: Attributes.Flexibility, percent: 25 },
      { name: Attributes.Agility, percent: 25 },
    ],
  }
];

const ActivityHistory: React.FC = () => {
  return (
    <div className={`${styles.activityHistory} bg-white dark:bg-gray-800 p-6 rounded shadow-md`}>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Activity History</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default ActivityHistory;
