import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Calendar</ThemedText>
      <ThemedText>Track your daily acts of kindness here!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});