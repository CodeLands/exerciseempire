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

export const StatColors: { [key in ActivityStats]: string } = {
  [ActivityStats.Strength]: 'deeppink',
  [ActivityStats.Endurance]: 'royalblue',
  [ActivityStats.Flexibility]: 'green',
  [ActivityStats.Agility]: 'yellow',
}

export const StatWeakColors: { [key in ActivityStats]: string } = {
  [ActivityStats.Strength]: 'pink',
  [ActivityStats.Endurance]: 'lightblue',
  [ActivityStats.Flexibility]: 'lightgreen',
  [ActivityStats.Agility]: 'palegoldenrod',
}

const CategoryColors: { [key: number]: string } = {
  1: 'lightgreen', // Outdoor
  2: 'lightcoral', // Indoor
  3: 'lightblue',  // Water Sports
  // Add more colors if there are more categories
};

type BaseStat = {
  stat: ActivityStats;
  base_stat_value: number;
};

type Activity = {
  id: number;
  name: string;
  bestStat: ActivityStats;
  baseStats: BaseStat[];
  category: string;
  categoryId: number;
};

type Category = {
  categoryId: number;
  categoryName: string;
  activities: Activity[];
};

export let activities: Activity[] = [];

export default function ActivitiesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

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
          const transformedCategories = data.map((categoryData: any) => ({
            categoryId: categoryData.activities.length > 0 ? categoryData.activities[0].category_id : null,
            categoryName: categoryData.category,
            activities: categoryData.activities.map((activityData: any) => ({
              id: activityData.id,
              name: activityData.activity,
              baseStats: activityData.stats.map((statData: any) => ({
                stat: statData.stat as ActivityStats,
                base_stat_value: statData.base_stat_value,
              })),
              category: categoryData.category,
              categoryId: activityData.category_id,
              bestStat: determineBestStat(activityData.stats),
            })),
          }));
          console.log('Transformed categories:', transformedCategories);
          setCategories(transformedCategories);

          // Flatten activities and update the exported activities array
          activities = transformedCategories.flatMap((category: Category) => category.activities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }

    fetchData();
  }, []);

  function determineBestStat(stats: BaseStat[]): ActivityStats {
    // Find the stat with the highest base_stat_value
    let bestStat = stats[0];
    for (let i = 1; i < stats.length; i++) {
      if (stats[i].base_stat_value > bestStat.base_stat_value) {
        bestStat = stats[i];
      }
    }
    return bestStat.stat;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listItems}
        data={categories}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={({ item: category }) => (
          <View>
            <Text style={styles.categoryTitle}>{category.categoryName}</Text>
            {category.activities.map((activity) => (
              <Link href={`activity/${activity.id}`} asChild key={activity.id}>
                <Pressable>
                  <View style={[styles.listItem, { backgroundColor: CategoryColors[activity.categoryId] }]}>
                    <Text style={styles.listItemText}>{activity.name}</Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
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
