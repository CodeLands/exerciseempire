import React, { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { PowerIcon } from '@heroicons/react/24/outline'
import { Attributes } from '../../types/AtributeTypes'

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
    <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {CatagoriesAndActivitiesWithBaseStats.map((client) => (
        <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <img
              src={client.icon}
              alt={client.name}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm font-medium leading-6 text-gray-900">{client.name}</div>
            <Menu as="div" className="relative ml-auto">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        View<span className="sr-only">, {client.name}</span>
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit<span className="sr-only">, {client.name}</span>
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Last invoice</dt>
              <dd className="text-gray-700">
                <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Amount</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">{client.lastInvoice.amount}</div>
                <div
                  className={classNames(
                    Statuses[client.lastInvoice.status],
                    'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {client.lastInvoice.status}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
