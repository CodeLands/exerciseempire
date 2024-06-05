import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { ActivityStats, StatColors, StatWeakColors, activities } from '../activities'

export type ActivityStat = {
  stat: ActivityStats,
  percentValue: number,
}


export default function ActivityScreen() {
  const { id } = useLocalSearchParams()

  const currentActivity = activities.find(activity => activity.link === `activity/${id}`)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerTitle: `Activity: ${currentActivity?.name} - Details`,
        headerBackVisible: true

        }} />
      <Text style={styles.title}>Activity: {currentActivity?.name}</Text>
      <Text style={styles.description}>Best Stat: {currentActivity?.bestStat}</Text>
      <FlatList
        style={styles.listItems}
        data={currentActivity?.stats}
        renderItem={({ item: stat }) =>
          <>
          <View style={styles.listItemStat}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',

              }}>
              <Text style={{
                ...styles.listItemText,
              }}>
                {stat.stat}:
              </Text>
              <Text style={{
                ...styles.listItemText,
              }}>
                {stat.percentValue}%
                </Text>
            </View>


            <View style={{ flexDirection: 'row' }}>
              <Text style={{
                ...styles.listItemBar,
                backgroundColor: StatColors[stat.stat],
                width: `${stat.percentValue}%`,
              }}></Text>
              <Text style={{
                ...styles.listItemBar,
                backgroundColor: StatWeakColors[stat.stat],
                width: `${100 - stat.percentValue}%`,
              }}></Text>
            </View>
            </View>
          </>
        }
      />
      <Link href={`/lastActivity/${id}`} asChild>
        <Pressable>
          <Text style={styles.selectActivityBtn}>Select Activity</Text>
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
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
    maxHeight: '60%',
  },
  listItemStat: {
    //borderWidth: 1,
  },
  listItemText: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 0,
  },
  listItemBar: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
  },
  selectActivityBtn: {
    padding: 15,
    borderRadius: 5,
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 0,
    backgroundColor: 'lightgreen',
    borderWidth: 1,
  },
});
