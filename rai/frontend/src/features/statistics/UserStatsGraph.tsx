import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDarkMode } from '../settings/DarkModeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;


const UserStatsGraph: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedOption, setSelectedOption] = useState('all');
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Strength',
        data: [],
        borderColor: 'rgb(185, 28, 28)', // dark:bg-red-700
        backgroundColor: 'rgba(185, 28, 28, 0.5)',
        fill: true,
      },
      {
        label: 'Endurance',
        data: [],
        borderColor: 'rgb(217, 119, 6)', // dark:bg-orange-700
        backgroundColor: 'rgba(217, 119, 6, 0.5)',
        fill: true,
      },
      {
        label: 'Agility',
        data: [],
        borderColor: 'rgb(4, 120, 87)', // dark:bg-green-700
        backgroundColor: 'rgba(4, 120, 87, 0.5)',
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(apiBaseUrl + '/list-activity-stats', {
          params: { user_id: 1 }, // Replace with the actual user ID
        });

        if (response.data && response.data.success) {
          console.log('Fetched Data:', response.data.data); // Logging fetched data for debugging
          processActivityData(response.data.data);
        } else {
          console.error('Failed to fetch activity stats:', response.data);
        }
      } catch (error) {
        console.error('Error fetching activity stats:', error);
      }
    };

    fetchActivities();
  }, []);

  const processActivityData = (activities: any[]) => {
    const activityMap: { [key: string]: { [key: string]: number } } = {};
    const allLabels: Set<string> = new Set();

    activities.forEach((activity) => {
      const date = new Date(activity.start_time).toISOString().split('T')[0];
      if (!activityMap[date]) {
        activityMap[date] = { Strength: 0, Endurance: 0, Agility: 0 };
      }
      activityMap[date][activity.stat] = activity.current_value;
      allLabels.add(date);
    });

    const sortedLabels = Array.from(allLabels).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const datasets = data.datasets.map((dataset) => ({
      ...dataset,
      data: sortedLabels.map((label) => activityMap[label][dataset.label as keyof typeof activityMap[0]] || 0),
    }));

    console.log('Processed Labels:', sortedLabels); // Logging processed labels for debugging
    console.log('Processed Datasets:', datasets); // Logging processed datasets for debugging

    setLabels(sortedLabels);
    setData({
      labels: sortedLabels,
      datasets: datasets,
    });
  };

  const filterDataByDate = (daysAgo: number) => {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - daysAgo);

    console.log('Today:', today); // Log the current date
    console.log('Target Date:', targetDate); // Log the target date for filtering

    const filteredLabels = labels.filter((label) => {
      const labelDate = new Date(label);
      const isWithinRange = labelDate >= targetDate;
      console.log(`Label: ${label}, Date: ${labelDate}, Is Within Range: ${isWithinRange}`); // Log each label and whether it's within range
      return isWithinRange;
    });

    const filteredDatasets = data.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.slice(labels.length - filteredLabels.length),
    }));

    console.log('Filtered Labels:', filteredLabels); // Log the filtered labels
    console.log('Filtered Datasets:', filteredDatasets); // Log the filtered datasets

    return {
      labels: filteredLabels,
      datasets: filteredDatasets,
    };
  };

  const filteredData = () => {
    switch (selectedOption) {
      case 'all':
        return data;
      case 'lastMonth':
        return filterDataByDate(30); // Filter data for the last month
      case 'lastWeek':
        return filterDataByDate(7); // Filter data for the last week
      default:
        return data;
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(100, 100, 100, 0.7)',
        },
      },
      title: {
        display: true,
        text: 'User Stats Over Time',
        font: {
          size: 24,
        },
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(100, 100, 100, 0.9)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(100, 100, 100, 0.7)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(100, 100, 100, 0.7)',
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">User Stats Over Time</h2>
      <select
        className="mb-4"
        value={selectedOption}
        onChange={e => setSelectedOption(e.target.value)}
      >
        <option value="all">All Time Statistics</option>
        <option value="lastMonth">Last Month</option>
        <option value="lastWeek">Last Week</option>
      </select>
      <Line data={filteredData()} options={options} />
    </div>
  );
}

export default UserStatsGraph;