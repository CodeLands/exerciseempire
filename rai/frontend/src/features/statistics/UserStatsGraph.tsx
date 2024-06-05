import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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

const labels = ['2024-06-01', '2024-05-05', '2024-05-10', '2024-05-15', '2024-05-20'];

const data = {
  labels,
  datasets: [
    {
      label: 'Strength',
      data: [50, 55, 60, 65, 70],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: true,
    },
    {
      label: 'Endurance',
      data: [40, 45, 50, 55, 60],
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      fill: true,
    },
    {
      label: 'Flexibility',
      data: [30, 35, 40, 45, 50],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      fill: true,
    },
    {
      label: 'Agility',
      data: [20, 25, 30, 35, 40],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      fill: true,
    },
  ],
};

const UserStatsGraph: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedOption, setSelectedOption] = useState('all'); // Default option

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

  const filteredData = () => {
    switch (selectedOption) {
      case 'all':
        return data;
      case 'lastMonth':
        return filterDataByDate(-30); // Filter data for the last month
      case 'lastWeek':
        return filterDataByDate(-7); // Filter data for the last week
      default:
        return data;
    }
  };

  const filterDataByDate = (daysAgo: number) => {
    const today = new Date();
    console.log("Today:", today);
  
    const filteredLabels = labels.filter((label, index) => {
      console.log("Original Label:", label);
      const labelDate = new Date(label);
      console.log("Parsed Label Date:", labelDate);
      const diffTime = today.getTime() - labelDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log("Difference in Days:", diffDays);
      return diffDays <= daysAgo;
    });
  
    console.log("Filtered Labels:", filteredLabels);
  
    const filteredDatasets = data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.slice(labels.length - filteredLabels.length),
    }));
  
    console.log("Filtered Datasets:", filteredDatasets);
  
    const filteredData = {
      labels: filteredLabels,
      datasets: filteredDatasets,
    };
  
    return filteredData;
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