import React, { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { PowerIcon } from '@heroicons/react/24/outline'
import { AttributeColorMap, Attributes } from '../../types/AtributeTypes'
import { AttributeColorsToTextAndBgMap } from '../profile-stats/ProfileStats'

enum Statuses {
  Paid = 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw = 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue = 'text-red-700 bg-red-50 ring-red-600/10',
}

type BaseStat = {
  id: number
  name: Attributes
  value: number
}

type Activity = {
  id: number,
  name: string,
  baseStats: BaseStat[]
}

type Category = {
  id: number,
  name: Attributes,
  icon: React.ReactNode
  activities: Activity[]
}

const CatagoriesAndActivitiesWithBaseStats: Category[] = [
  {
    id: 1,
    name: Attributes.Strength,
    icon: <PowerIcon className="h-6 w-6" />,
    activities: [
      {
        id: 1,
        name: 'Bench Press',
        baseStats: [
          {
            id: 1,
            name: Attributes.Strength,
            value: 100
          },
          {
            id: 2,
            name: Attributes.Endurance,
            value: 100
          },
          {
            id: 3,
            name: Attributes.Flexibility,
            value: 100
          },
          {
            id: 4,
            name: Attributes.Agility,
            value: 100
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: Attributes.Endurance,
    icon: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    activities: [
      {
        id: 1,
        name: 'Bench Press',
        baseStats: [
          {
            id: 1,
            name: Attributes.Strength,
            value: 100
          },
          {
            id: 2,
            name: Attributes.Endurance,
            value: 100
          },
          {
            id: 3,
            name: Attributes.Flexibility,
            value: 100
          },
          {
            id: 4,
            name: Attributes.Agility,
            value: 100
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: Attributes.Flexibility,
    icon: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    activities: [
      {
        id: 1,
        name: 'Bench Press',
        baseStats: [
          {
            id: 1,
            name: Attributes.Strength,
            value: 100
          },
          {
            id: 2,
            name: Attributes.Endurance,
            value: 100
          },
          {
            id: 3,
            name: Attributes.Flexibility,
            value: 100
          },
          {
            id: 4,
            name: Attributes.Agility,
            value: 100
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: Attributes.Agility,
    icon: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    activities: [
      {
        id: 1,
        name: 'Bench Press',
        baseStats: [
          {
            id: 1,
            name: Attributes.Strength,
            value: 100
          },
          {
            id: 2,
            name: Attributes.Endurance,
            value: 100
          },
          {
            id: 3,
            name: Attributes.Flexibility,
            value: 100
          },
          {
            id: 4,
            name: Attributes.Agility,
            value: 100
          }
        ]
      }
    ]
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function activityList() {
  return (
    <div id="accordion-open" data-accordion="open">
      {CatagoriesAndActivitiesWithBaseStats.map((category) => (
        <div key={category.id}>
          <h2 id="accordion-open-heading-1">
            <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
              <span>{category.name}</span>
              <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          {category.activities.map((activity) => (
        <div key={activity.id} id="accordion-open-body-1" className={/* hidden */ ""} aria-labelledby="accordion-open-heading-1">
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-gray-500 dark:text-gray-400">{activity.name}</p>
              <div className="text-gray-500 dark:text-gray-400">
                {activity.baseStats.map((attribute) => {
                        const colors = AttributeColorsToTextAndBgMap[AttributeColorMap[attribute.name]];
                        return (
                        <li key={attribute.name} className='my-4 bg-gray-100 dark:bg-gray-700 rounded'>
                            <div>
                                <p className="ml-1 text-gray-900 dark:text-gray-100 font-semibold">{attribute.name /* + " Lvl: " + attribute.lvl */}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded shadow-sm overflow-hidden p-1 my-1">
                                <div className="relative h-6 flex items-center justify-center">
                                <div className={`absolute top-0 bottom-0 left-0 rounded-lg w-[${attribute.value}%] ${colors.bg}`}></div>
                                <div className={`relative ${colors.text} font-medium text-sm`}>{attribute.value + '%'}</div>
                                </div>
                            </div>
                        </li>
                        );
                    })}
                </div>
            </div>
          </div>
          ))}
        </div>
      ))}
    </div>
  )
}
