import { Link } from 'react-router-dom'
import './ProfileStats.css'
import { AttributeColorMap, AttributeColors, Attributes } from '../../types/AtributeTypes'

enum AttributeBgColors {
    red = 'bg-red-200',
    orange = 'bg-orange-200',
    blue = 'bg-blue-200',
    green = 'bg-green-200',
}
  
enum AttributeTextColors {
    red = 'text-red-900',
    orange = 'text-orange-900',
    blue = 'text-blue-900',
    green = 'text-green-900',
}

const AttributeColorsToTextAndBgMap: Record<AttributeColors, {text: AttributeTextColors, bg: AttributeBgColors}> = {
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
    name: Attributes,
    lvl: number,
    percentOfLvl: number,
}

const userStats: UserStats = {
    name: 'Chad',
    lvl: 50,
    active: ActiveStatus.Daily,
    attributes: [
        {
            name: Attributes.Strength,
            lvl: 50,
            percentOfLvl: 25,
        },
        {
            name: Attributes.Endurance,
            lvl: 33,
            percentOfLvl: 50,
        },
        {
            name: Attributes.Flexibility,
            lvl: 25,
            percentOfLvl: 75,
        },
        {
            name: Attributes.Agility,
            lvl: 10,
            percentOfLvl: 99,
        },
    ]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProfileStats() {
    return (
        <>
            <div
            className={classNames('z-10 bg-white shadow-xl ring-1 ring-gray-900/10')}
            >
            <div className="p-8 xl:p-10">
                <h3
                id="profile"
                className={classNames('text-gray-900 text-sm font-semibold leading-6')}
                >
                Profile Stats
                </h3>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                <div className="mt-2 flex items-center gap-x-4">
                    <p
                    className={classNames('text-gray-900 text-4xl font-bold tracking-tight')}
                    >
                    Lvl: 50
                    </p>
                    <div className="text-sm leading-5">
                    <p className={'text-gray-900'}>{/* BodyBuilder,  */}Chad</p>
                    <p
                        className={'text-gray-500'}
                    >{`Active: Daily`}</p>
                    </div>
                </div>
                <Link
                    to={'/profile'}
                    aria-describedby="profile-details"
                    className={classNames('bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2')}
                >
                    See more
                </Link>
                </div>
                <div className="flow-root sm:mt-10 border-t border-gray-300 py-4">
                    
                <ul
                    role="list"
                    className={classNames('divide-gray-900/5 text-gray-600 divide-y border-t text-sm leading-6 lg:border-t-0')}
                >
                    {userStats.attributes.map((attribute) => {
                        const colors = AttributeColorsToTextAndBgMap[AttributeColorMap[attribute.name]];
                        return (
                        <li key={attribute.name} className='my-4 bg-gray-100 rounded'>
                            <div>
                                <p className="ml-1 text-gray-900 font-semibold">{attribute.name + " Lvl: " + attribute.lvl}</p>
                            </div>
                            <div className="bg-gray-100 rounded shadow-sm overflow-hidden p-1 my-1">
                                <div className="relative h-6 flex items-center justify-center">
                                <div className={`absolute top-0 bottom-0 left-0 rounded-lg w-[${attribute.percentOfLvl}%] ${colors.bg}`}></div>
                                <div className={`relative ${colors.text} font-medium text-sm`}>{attribute.percentOfLvl + '%'}</div>
                                </div>
                            </div>
                        </li>
                        );
                    })}
                </ul>
                </div>
            </div>
            </div>
        </>
    )
}
