// ActivityDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
//import styles from './ActivityDetail.module.css';

interface Attribute {
  name: string;
  percent: number;
}

interface ActivityDetail {
  id: number;
  description: string;
  date: string;
  attributes: Attribute[];
  summaryDetails: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activityDetail, setActivityDetail] = useState<ActivityDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/activity-detail`, {
          params: { activity_id: id }
        });

        if (response.data && response.data.success) {
          const data = response.data.data;

          setActivityDetail({
            id: data.id,
            description: data.description || `Activity ${data.activity_id}`,
            date: new Date(data.start_time).toLocaleDateString(),
            attributes: data.attributes.map((attr: any) => ({
              name: attr.stat,
              percent: attr.current_value,
            })),
            summaryDetails: data.summary_details,
          });
        } else {
          setError('Failed to fetch activity details');
        }
      } catch (error) {
        setError('Error fetching activity details');
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!activityDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded shadow-md`}>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">{activityDetail.description}</h2>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{activityDetail.date}</div>
      <div className="space-y-4">
        {activityDetail.attributes.map((attribute) => (
          <div key={attribute.name}>
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{attribute.name}</div>
            <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-800 rounded">
              <div
                className="absolute top-0 bottom-0 left-0 rounded bg-green-400 dark:bg-green-600"
                style={{ width: `${attribute.percent}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {attribute.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h3>
        <p className="text-gray-700 dark:text-gray-300">{activityDetail.summaryDetails}</p>
      </div>
    </div>
  );
};

export default ActivityDetail;