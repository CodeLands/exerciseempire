import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StatColors, StatWeakColors, activities } from '../(activities)/activities';
import { SensorDataService } from '../../../sensors/sensorData'; // Import your sensor data service
import Constants from 'expo-constants';

export default function LastActivityScreen() {
    const [isStarted, setIsStarted] = useState(false);
    const [sensorData, setSensorData] = useState<any[]>([]);
    const { id } = useLocalSearchParams();

    const selectedActivity = activities.find(activity => activity.id === Number(id));

    const getSensorId = (sensorType: any) => {
        switch (sensorType) {
            case 'accelerometer':
                return 1;
            case 'gyroscope':
                return 2;
            case 'location':
                return 3; // GPS
            case 'pedometer':
                return 4;
            default:
                return -1; // Unknown sensor
        }
    };

    useEffect(() => {
        const api = process.env.EXPO_PUBLIC_API_URL; // Use the API URL from the environment variables
        if (!api) {
            console.error('No API URL found');
            return;
        }

        if (isStarted) {
            try {
                SensorDataService.startSensors((data) => {
                    console.log("Sensor data received: ", data);
                    setSensorData(prevData => [...prevData, data]);

                    const sensorId = getSensorId(data.type);
                    if (sensorId === -1) {
                        console.error("Unknown sensor type:", data.type);
                        return;
                    }

                    const route = `${api}/sensor-data`;
                    console.log('Sending to:', route);

                    fetch(route, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            executed_activity_id: id, // Adjust as needed
                            sensor_id: sensorId,
                            value: data.data,
                            timestamp: Date.now(),
                        })
                    }).catch(error => console.error("Error sending sensor data: ", error));
                });
            } catch (error) {
                console.error("Error starting sensors: ", error);
            }
        } else {
            try {
                SensorDataService.stopSensors();
            } catch (error) {
                console.error("Error stopping sensors: ", error);
            }
        }

        return () => {
            try {
                SensorDataService.stopSensors();
            } catch (error) {
                console.error("Error stopping sensors on unmount: ", error);
            }
        };
    }, [isStarted]);

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
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={styles.description}>Started for: </Text>
                            <Text style={{ ...styles.description, textAlign: 'center', borderWidth: 1, padding: 5, borderRadius: 5 }}>x seconds</Text>
                        </View>
                    )}
                    <Text style={styles.description}>Stats gained during session:</Text>

                    <FlatList
                        style={styles.listItems}
                        data={selectedActivity?.baseStats}
                        keyExtractor={(item) => item.stat}
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
                                            width: `${stat.base_stat_value}%`,
                                        }}></Text>
                                        <Text style={{
                                            ...styles.listItemBar,
                                            backgroundColor: StatWeakColors[stat.stat],
                                            width: `${100 - stat.base_stat_value}%`,
                                        }}></Text>
                                    </View>
                                </View>
                            </>
                        }
                    />
                    {isStarted && (
                        <View style={styles.debugContainer}>
                            <Text>Sensor Data DEBUG:</Text>
                            <FlatList
                                data={sensorData}
                                renderItem={({ item }) => (
                                    <View>
                                        {/* <Text>Type: {item.type}</Text>
                                        <Text>Data: {JSON.stringify(item.data)}</Text> */}
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    )}

                    <Pressable onPress={() => {
                        console.log(`Selected Activity ID: ${id}`);
                        setIsStarted(!isStarted);
                    }}>
                        <Text style={
                            isStarted ? styles.stopActivityBtn :
                                styles.startActivityBtn
                        }>{isStarted ? 'Stop Activity' : 'Start Activity'}</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.container}>
                    <Stack.Screen options={{
                        headerTitle: `No Activity Selected...`,
                        headerRight: () => <Link href="/activities" asChild>
                            <Pressable style={styles.notSelectActivityHeaderButton}>
                                <Text>SELECT</Text>
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
    );
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
});