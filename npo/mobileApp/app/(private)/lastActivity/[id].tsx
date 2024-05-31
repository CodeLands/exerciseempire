import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'

export default function LastActivityScreen() {
    const { id } = useLocalSearchParams()   

    return (
        <>
            {id !== undefined ? (
                <View style={styles.container}>
                    <Stack.Screen options={{
                        headerTitle: `Last Activity #${id}`
                        }} />
                    <Text>Last Activity: {id}</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <Stack.Screen options={{
                        headerTitle: `No Activity Selected...`,
                        headerRight: () => <Link href="/activities" asChild>
                            <Pressable>
                                <Text style={styles.selectActivityHeaderButton}>SELECT</Text>
                            </Pressable>
                        </Link>,
                        headerStyle: {
                            backgroundColor: 'orange'
                        },
                        }} />
                    <Text>No activity selected yet...</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectActivityHeaderButton: {
        backgroundColor: 'lightgreen',
        padding: 10,
        color: 'black',
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
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
    }
})