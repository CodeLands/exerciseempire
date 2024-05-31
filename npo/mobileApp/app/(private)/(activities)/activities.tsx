import { Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

const activities = [
  {
    link: 'activity/1',
    name: 'Running',
  },
  {
    link: 'activity/2',
    name: 'Swimming',
  },
  {
    link: 'activity/3',
    name: 'Cycling',
  },
  {
    link: 'activity/4',
    name: 'Hiking',
  },
  {
    link: 'activity/5',
    name: 'Gym',
  },
  {
    link: 'activity/6',
    name: 'Yoga',
  },
  {
    link: 'activity/7',
    name: 'Dancing',
  },
  {
    link: 'activity/18',
    name: 'Gaming',
  },
  {
    link: 'activity/9',
    name: 'Rock climbing',
  },
  {
    link: 'activity/10',
    name: 'Skiing',
  },
  {
    link: 'activity/11',
    name: 'Snowboarding',
  },
  {
    link: 'activity/12',
    name: 'Surfing',
  }
]

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities:</Text>
      <FlatList
        style={styles.listItems}
        data={activities}
        renderItem={({item}) => <Link href="activity/1">
          <Pressable>
            <Text style={styles.listItem}>{item.name}</Text>
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
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  listItemText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
