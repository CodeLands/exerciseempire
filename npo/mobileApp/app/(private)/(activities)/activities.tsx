import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Constants from 'expo-constants';

export enum ActivityStats {
  Strength = 'Strength',
  Endurance = 'Endurance',
  Flexibility = 'Flexibility',
  Agility = 'Agility',
}

export const StatColors = {
  [ActivityStats.Strength]: 'deeppink',
  [ActivityStats.Endurance]: 'royalblue',
  [ActivityStats.Flexibility]: 'green',
  [ActivityStats.Agility]: 'yellow',
}

export const StatWeakColors = {
  [ActivityStats.Strength]: 'pink',
  [ActivityStats.Endurance]: 'lightblue',
  [ActivityStats.Flexibility]: 'lightgreen',
  [ActivityStats.Agility]: 'palegoldenrod',
}

type BaseStat = {
  id: number;
  name: string;
  value: number;
};

type Activity = {
  id: number;
  name: string;
  bestStat: ActivityStats;
  baseStats: BaseStat[];
  category: string;
};

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchData() {
      const api = process.env.EXPO_PUBLIC_API_URL;
      if (!api) {
        console.error('No API URL found');
        return;
      }

      const route = api + "/activities";
      console.log('Fetching from:', route);

      try {
        console.log('Starting fetch request...');
        const response = await fetch(route, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Response received:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log('JSON parsed:', json);
        if (json.success) {
          const data = json.data;
          const transformedActivities = data.flatMap((categoryData: any) => {
            return categoryData.activities.map((activityData: any) => ({
              id: activityData.id,
              name: activityData.activity,
              baseStats: activityData.stats.map((statData: any, index: number) => ({
                id: index, // Use index as key for stats since stat_id is not available
                name: statData.stat,
                value: statData.base_stat_value,
              })),
              category: categoryData.category,
              bestStat: determineBestStat(activityData.stats),
            }));
          });
          console.log('Transformed activities:', transformedActivities);
          setActivities(transformedActivities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }

    fetchData();
  }, []);

  function determineBestStat(stats) {
    // Logic to determine best stat based on your criteria
    // For now, let's assume the first stat is the best
    return stats[0].stat;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities:</Text>
      <FlatList
        style={styles.listItems}
        data={activities.sort((a, b) => a.bestStat.localeCompare(b.bestStat))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: activity }) => (
          <Link href={`activity/${activity.id}`} asChild>
            <Pressable>
              <View style={[styles.listItem, { backgroundColor: StatWeakColors[activity.bestStat] }]}>
                <Text style={styles.listItemText}>{activity.name}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItems: {
    width: '100%',
  },
  listItem: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
  },
  listItemText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
