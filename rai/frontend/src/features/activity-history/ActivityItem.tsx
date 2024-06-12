import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityHistory.module.css';

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

interface Props {
  activity: Activity;
}

const AttributeColors: Record<Attributes, string> = {
  [Attributes.Strength]: 'bg-red-200 dark:bg-red-700',
  [Attributes.Endurance]: 'bg-orange-200 dark:bg-orange-700',
  [Attributes.Flexibility]: 'bg-blue-200 dark:bg-blue-700',
  [Attributes.Agility]: 'bg-green-200 dark:bg-green-700',
}

const ActivityItem: React.FC<Props> = ({ activity }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/activity-detail/${activity.id}`);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-md cursor-pointer" onClick={handleItemClick}>
      <div className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-100">{activity.description}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</div>
      <div className="mt-4 space-y-4">
        {activity.attributes.map((attribute) => (
          <div key={attribute.name}>
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{attribute.name}</div>
            <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-800 rounded">
              <div
                className={`absolute top-0 bottom-0 left-0 rounded ${AttributeColors[attribute.name]}`}
                style={{ width: `${attribute.percent}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {attribute.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityItem;