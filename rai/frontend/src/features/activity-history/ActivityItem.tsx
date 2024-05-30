import React from 'react';
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
  [Attributes.Strength]: 'bg-red-200',
  [Attributes.Endurance]: 'bg-orange-200',
  [Attributes.Flexibility]: 'bg-blue-200',
  [Attributes.Agility]: 'bg-green-200',
}

const ActivityItem: React.FC<Props> = ({ activity }) => {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="mb-2 text-lg font-semibold text-gray-700">{activity.description}</div>
      <div className="text-sm text-gray-500">{activity.date}</div>
      <div className="mt-4 space-y-4">
        {activity.attributes.map((attribute) => (
          <div key={attribute.name}>
            <div className="mb-1 text-sm font-medium text-gray-700">{attribute.name}</div>
            <div className="relative w-full h-6 bg-gray-200 rounded">
              <div
                className={`absolute top-0 bottom-0 left-0 rounded ${AttributeColors[attribute.name]}`}
                style={{ width: `${attribute.percent}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
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