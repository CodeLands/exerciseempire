import { Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { ActivityStat } from './activity/[id]';

export enum ActivityStats {
  Strength = 'Strength',
  Endurance = 'Endurance',
  Flexibility = 'Flexibility',
  Agility = 'Agility',
  // Balance: 'Balance',
  // Coordination: 'Coordination',
}

export const StatColors = {
  [ActivityStats.Strength]: 'deeppink',
  [ActivityStats.Endurance]: 'royalblue',
  [ActivityStats.Flexibility]: 'green',
  [ActivityStats.Agility]: 'yellow',
  // [ActivityStat.Balance]: 'purple',
  // [ActivityStat.Coordination]: 'orange',
}

export const StatWeakColors = {
  [ActivityStats.Strength]: 'pink',
  [ActivityStats.Endurance]: 'lightblue',
  [ActivityStats.Flexibility]: 'lightgreen',
  [ActivityStats.Agility]: 'palegoldenrod',
  // [ActivityStat.Balance]: 'purple',
  // [ActivityStat.Coordination]: 'orange',
}

type Activity = {
  link: string,
  name: string,
  bestStat: ActivityStats,
  stats: ActivityStat[],
}

export const activities: Activity[] = [
  {
    link: 'activity/1',
    name: 'Running',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
  {
    link: 'activity/2',
    name: 'Swimming',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/3',
    name: 'Cycling',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 20,
      },
    ]
  },
  {
    link: 'activity/4',
    name: 'Hiking',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 20,
      },
    ]
  },
  {
    link: 'activity/5',
    name: 'Gym',
    bestStat: ActivityStats.Strength,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/6',
    name: 'Yoga',
    bestStat: ActivityStats.Flexibility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 30,
      },
    ]
  },
  {
    link: 'activity/7',
    name: 'Dancing',
    bestStat: ActivityStats.Agility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
  {
    link: 'activity/18',
    name: 'Gaming',
    bestStat: ActivityStats.Agility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
  {
    link: 'activity/9',
    name: 'Rock climbing',
    bestStat: ActivityStats.Strength,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/10',
    name: 'Skiing',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/11',
    name: 'Snowboarding',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/12',
    name: 'Surfing',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/13',
    name: 'Football',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/14',
    name: 'Tennis',
    bestStat: ActivityStats.Agility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
  {
    link: 'activity/15',
    name: 'Golf',
    bestStat: ActivityStats.Flexibility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 30,
      },
    ]
  },
  {
    link: 'activity/16',
    name: 'Baseball',
    bestStat: ActivityStats.Agility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
  {
    link: 'activity/17',
    name: 'Volleyball',
    bestStat: ActivityStats.Endurance,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 40,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 10,
      },
    ]
  },
  {
    link: 'activity/18',
    name: 'Basketball',
    bestStat: ActivityStats.Agility,
    stats: [
      {
        stat: ActivityStats.Strength,
        percentValue: 20,
      },
      {
        stat: ActivityStats.Endurance,
        percentValue: 30,
      },
      {
        stat: ActivityStats.Flexibility,
        percentValue: 10,
      },
      {
        stat: ActivityStats.Agility,
        percentValue: 40,
      },
    ]
  },
]

export default function ActivitiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities:</Text>
      <FlatList
        style={styles.listItems}
        data={activities.sort((a, b) => a.bestStat.localeCompare(b.bestStat))}
        renderItem={({item: activity}) => <Link href={activity.link} asChild>
          <Pressable>
            <Text style={{
            ...styles.listItem,
            backgroundColor: StatWeakColors[activity.bestStat]
            }}>{activity.name}</Text>
          </Pressable>
        </Link>
      }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItems: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    minWidth: 200,
    width: '90%',
    overflow: 'scroll',
    maxHeight: '90%',
  },
  listItem: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  listItemText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
