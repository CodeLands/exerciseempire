import { Link } from 'react-router-dom'
import './ProfileStats.css'
import { AttributeColorMap, AttributeColors, Attributes } from '../../types/AtributeTypes'
import { useEffect, useState } from 'react'
import axios from 'axios'

enum AttributeBgColors {
    red = 'bg-red-200 dark:bg-red-700',
    orange = 'bg-orange-200 dark:bg-orange-700',
    blue = 'bg-blue-200 dark:bg-blue-700',
    green = 'bg-green-200 dark:bg-green-700',
}

enum AttributeTextColors {
    red = 'text-red-900 dark:text-red-100',
    orange = 'text-orange-900 dark:text-orange-100',
    blue = 'text-blue-900 dark:text-blue-100',
    green = 'text-green-900 dark:text-green-100',
}

export const AttributeColorsToTextAndBgMap: Record<AttributeColors, {text: AttributeTextColors, bg: AttributeBgColors}> = {
    [AttributeColors.Red]: {text: AttributeTextColors.red, bg: AttributeBgColors.red},
    [AttributeColors.Orange]: {text: AttributeTextColors.orange, bg: AttributeBgColors.orange},
    [AttributeColors.Blue]: {text: AttributeTextColors.blue, bg: AttributeBgColors.blue},
    [AttributeColors.Green]: {text: AttributeTextColors.green, bg: AttributeBgColors.green},
}

enum ActiveStatus {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
}

type UserStats = {
    name: string,
    lvl: number,
    active: ActiveStatus,
    attributes: Attribute[]
}

type Attribute = {
    stat: string,
    lvl: number,
    total_value: number,
}

const userStatsConst: UserStats = {
    name: 'Chad',
    lvl: 50,
    active: ActiveStatus.Daily,
    attributes: [
        {
            stat: Attributes.Strength,
            lvl: 50,
            total_value: 25,
        },
        {
            stat: Attributes.Endurance,
            lvl: 33,
            total_value: 50,
        },
        {
            stat: Attributes.Flexibility,
            lvl: 25,
            total_value: 75,
        },
        {
            stat: Attributes.Agility,
            lvl: 10,
            total_value: 99,
        },
    ]
}

type ServerData = {
    stat_id: number,
    stat: string,
    total_value: number
}

/* const userStatsConst2 = {
    stat_id: 1,
    stat: "Endurance",
    total_value: 655
} */

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function calcExp(value: number) {
    return Math.floor(value / 100)
}

function calcLvl(value: number) {
    return Math.floor(value / 100)
}

function calcTotalLvl(lvls: number[]) {
    console.log("Lvls: ", lvls)
    return lvls.reduce((acc, curr) => acc + curr)
}

function mapServerData(serverData: ServerData[]): Attribute[] {
    return serverData.map((data) => {
        return {
            stat: data.stat,
            lvl: calcLvl(data.total_value),
            total_value: calcExp(data.total_value)
        }
    })
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;


export default function ProfileStats() {
    const [ userStats, setUserStats ] = useState<UserStats | null>(null)
    //const [ serverData, setServerData ] = useState<ServerData[]>([])

    useEffect(() => {
        async function fetchUserStats() {
            const response = await axios.get(apiBaseUrl + '/aggregate-stats?user_id=1')
            console.log("Response: ", response.data.data)
            //setServerData(response.data.data)

            console.log("Mapped: ", mapServerData(response.data.data))

            const mappedServerData = mapServerData(response.data.data)

            const lvls = mappedServerData.map((stat) => {
                return stat.lvl
            })

            console.log("Total Lvl: ", calcTotalLvl(lvls))
            setUserStats({
                name: 'Chad',
                lvl: calcTotalLvl(lvls),
                active: ActiveStatus.Daily,
                attributes: mapServerData(response.data.data)
            })
        }
        fetchUserStats()

    }, [])

    return (
        
<>
{userStats && (
            <div
            className={classNames('z-10 bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-700')}
            >
            <div className="p-8 xl:p-10">
                <h3
                id="profile"
                className={classNames('text-gray-900 dark:text-gray-300 text-sm font-semibold leading-6')}
                >
                Profile Stats
                </h3>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                <div className="mt-2 flex items-center gap-x-4">
                    <p
                    className={classNames('text-gray-900 dark:text-gray-100 text-4xl font-bold tracking-tight')}
                    >
                    Lvl: {userStats.lvl}
                    </p>
                    <div className="text-sm leading-5">
                    <p className={'text-gray-900 dark:text-gray-100'}>{/* BodyBuilder,  */}{userStatsConst.name}</p>
                    <p
                        className={'text-gray-500 dark:text-gray-400'}
                    >{`Active: ${userStatsConst.active}`}</p>
                    </div>
                </div>
                <Link
                    to={'/profile'}
                    aria-describedby="profile-details"
                    className={classNames('bg-indigo-600 dark:bg-indigo-500 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2')}
                >
                    See more
                </Link>
                </div>
                <div className="flow-root sm:mt-10 border-t border-gray-300 dark:border-gray-700 py-4">

                <ul
                    role="list"
                    className={classNames('divide-gray-900/5 dark:divide-gray-700 text-gray-600 dark:text-gray-400 divide-y border-t text-sm leading-6 lg:border-t-0')}
                >
                    {userStats.attributes.map((attribute) => {
                        const colors = AttributeColorsToTextAndBgMap[AttributeColorMap[attribute.stat as Attributes]];
                        return (
                        <li key={attribute.stat} className='my-4 bg-gray-100 dark:bg-gray-700 rounded'>
                            <div>
                                <p className="ml-1 text-gray-900 dark:text-gray-100 font-semibold">{attribute.stat + " Lvl: " + attribute.lvl}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded shadow-sm overflow-hidden p-1 my-1">
                                <div className="relative h-6 flex items-center justify-center">
                                <div className={`absolute top-0 bottom-0 left-0 rounded-lg w-[${attribute.total_value}%] ${colors.bg}`}></div>
                                <div className={`relative ${colors.text} font-medium text-sm`}>{attribute.total_value + '%'}</div>
                                </div>
                            </div>
                        </li>
                        );
                    })}
                </ul>
                </div>
            </div>
            </div>

        )}
        </>
    )
}
