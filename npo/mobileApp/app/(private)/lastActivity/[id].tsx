import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { StatColors, StatWeakColors, activities } from '../(activities)/activities'

export default function LastActivityScreen() {
    let [ isStarted, setIsStarted ] = useState(false)
    const { id } = useLocalSearchParams()   

    const selectedActivity = activities.find(activity => activity.link === `activity/${id}`)

    return (
        <>
            {id !== undefined ? (
                <View style={styles.container}>
                    <Stack.Screen options={{
                        headerTitle: `Last Activity: ${selectedActivity?.name}`
                        }} />
                    <Text style={styles.title}>Selected Activity: {selectedActivity?.name}</Text>
                    <Text style={styles.description}>{`Is Started?: ${isStarted}`}</Text>
                    {isStarted && (
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                      <Text style={styles.description}>Started for: </Text>
                      <Text style={{...styles.description, textAlign: 'center', borderWidth: 1, padding: 5, borderRadius: 5}}>x seconds</Text>
                    </View>
                    )}
                    <Text style={styles.description}>Stats gained during session:</Text>

                    <FlatList
        style={styles.listItems}
        data={selectedActivity?.stats}
        renderItem={({ item: stat }) =>
          <>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 8,
            
            }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
              }}>
              <Text style={{
                ...styles.listItemText,
              }}>
                {stat.stat}:
              </Text>
              <Text style={{
                ...styles.listItemText,
              }}>
                xy levels + xy exp
                </Text>
            </View>


            <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15, minHeight: 30 }}>
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
      {isStarted && (
      <View style={styles.debugContainer}>
        <Text>
            Sensor Data DEBUG:
        </Text>
        <Text>
            Accelometer:
        </Text>
        <Text>
            Gyroscope:
        </Text>
        <Text>
            ...:
        </Text>
      </View>
      )}
            
        <Pressable onPress={() => setIsStarted(!isStarted)}>
          <Text style={
            isStarted ? styles.stopActivityBtn :
            styles.startActivityBtn
            }>{isStarted ? 'Stop Activity' : 'Start Activity' }</Text>
        </Pressable>
                </View>
            ) : (
                <View style={styles.container}>
                    <Stack.Screen options={{
                        headerTitle: `No Activity Selected...`,
                        headerRight: () => <Link  href="/activities" asChild>
                            <Pressable style={styles.notSelectActivityHeaderButton}>
                                <Text >SELECT</Text>
                            </Pressable>
                        </Link>,
                        headerStyle: {
                            backgroundColor: 'orange'
                        },
                        }} />
                    <Text style={styles.title}>No activity selected yet...</Text>
                    <Link href="/activities" asChild>
                            <Pressable>
                                <Text style={styles.selectActivityButton}>Go To Activities</Text>
                            </Pressable>
                        </Link>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'scroll',
        padding: 20,
    },
    // No-activity-selected styles
    notSelectActivityHeaderButton: {
        backgroundColor: 'lightgreen',
        padding: 10,
        color: 'black',
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 5,
        borderWidth: 1,
    },
    selectActivityButton: {
        backgroundColor: 'lightgreen',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        borderWidth: 1,
    },
    // Selected-activity styles
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    // timeRunning: {
    //     borderColor: "black",
    //     borderRadius: 5,
    //     borderWidth: 1,
    //     padding: 5
    // },

    listItems: {
        margin: 5,
        padding: 0,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        minWidth: 200,
        width: '90%',
        overflow: 'scroll',
        height: 'auto',
      },
      listItemText: {
        //padding: 10,
        borderRadius: 5,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
      },
      listItemBar: {
        padding: 0,
        borderRadius: 5,
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
        borderWidth: 1,
      },

      startActivityBtn: {
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
      debugContainer: {
        padding: 10,
        borderRadius: 5,
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 0,
        backgroundColor: 'orange',
        borderWidth: 1,
      },
      stopActivityBtn: {
        padding: 15,
        borderRadius: 5,
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 0,
        backgroundColor: 'red',
      },
})