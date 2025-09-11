import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function JournalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Journal</ThemedText>
      <ThemedText>Write about your kindness experiences here!</ThemedText>
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