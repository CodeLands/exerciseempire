import React, { useEffect, useState } from 'react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { AttributeColorMap, Attributes } from '../../types/AtributeTypes';
import { AttributeColorsToTextAndBgMap } from '../profile-stats/ProfileStats';
import axios from 'axios';

enum Statuses {
  Paid = 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw = 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue = 'text-red-700 bg-red-50 ring-red-600/10',
}

type BaseStat = {
  id: number;
  name: Attributes;
  value: number;
};

type Activity = {
  id: number;
  name: string;
  baseStats: BaseStat[];
};

type Category = {
  id: number;
  name: Attributes;
  icon: React.ReactNode;
  activities: Activity[];
};

const defaultCategories: Category[] = [];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ActivityList() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/activities'); // Adjust the URL to match your backend endpoint
        if (response.data.success) {
          const data = response.data.data;
          console.log('Fetched Data:', data); // Log the fetched data
          const transformedCategories = data.map((categoryData: any) => {
            const categoryId = categoryData.activities.length > 0 ? categoryData.activities[0].category_id : null;
            console.log('Category Data:', categoryData); // Log category data
            return {
              id: categoryId,
              name: categoryData.category,
              icon: getCategoryIcon(categoryData.category), // Define this function to return appropriate icon
              activities: categoryData.activities.map((activityData: any) => {
                console.log('Activity Data:', activityData); // Log activity data
                return {
                  id: activityData.id,
                  name: activityData.activity,
                  baseStats: activityData.stats.map((statData: any, index: number) => ({
                    id: index, // Use index as key for stats since stat_id is not available
                    name: statData.stat,
                    value: statData.base_stat_value,
                  })),
                };
              }),
            };
          });
          setCategories(transformedCategories);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }

    fetchData();
  }, []);

  function getCategoryIcon(category: string) {
    switch (category) {
      case Attributes.Strength:
        return <PowerIcon className="h-6 w-6" />;
      // Add more cases as needed for other attributes
      default:
        return <PowerIcon className="h-6 w-6" />;
    }
  }

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div id="accordion-open" data-accordion="collapse">
      {categories.map((category, index) => {
        if (category.id === null) return null; // Skip if no valid category ID
        return (
          <div key={category.id} className="border-b border-gray-200 dark:border-gray-700">
            <h2 id={`accordion-open-heading-${category.id}`}>
              <button
                type="button"
                className={`flex items-center justify-between w-full p-5 font-medium text-gray-500 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${index === categories.length - 1 ? 'rounded-b-xl' : ''}`}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={expandedCategory === category.id}
                aria-controls={`accordion-collapse-body-${category.id}`}
              >
                <span>{category.name}</span>
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 shrink-0 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-collapse-body-${category.id}`}
              className={`${expandedCategory === category.id ? '' : 'hidden'}`}
              aria-labelledby={`accordion-open-heading-${category.id}`}
            >
              {category.activities.map((activity) => {
                const uniqueActivityKey = `${category.id}-${activity.id}`;
                console.log('Activity ID:', uniqueActivityKey); // Log unique activity keys
                return (
                  <div key={uniqueActivityKey} id={`accordion-open-body-${uniqueActivityKey}`} className="" aria-labelledby={`accordion-open-heading-${category.id}`}>
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                      <p className="mb-2 text-gray-500 dark:text-gray-400">{activity.name}</p>
                      <div className="text-gray-500 dark:text-gray-400">
                        <ul>
                          {activity.baseStats.map((attribute) => {
                            const colors = AttributeColorsToTextAndBgMap[AttributeColorMap[attribute.name]];
                            return (
                              <li key={attribute.id} className="my-4 bg-gray-100 dark:bg-gray-700 rounded">
                                <div>
                                  <p className="ml-1 text-gray-900 dark:text-gray-100 font-semibold">{attribute.name}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded shadow-sm overflow-hidden p-1 my-1">
                                  <div className="relative h-6 flex items-center justify-center">
                                    <div className={`absolute top-0 bottom-0 left-0 rounded-lg ${colors.bg}`} style={{ width: `${attribute.value}%` }}></div>
                                    <div className={`relative ${colors.text} font-medium text-sm`}>{attribute.value}%</div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
