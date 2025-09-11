import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText>Your kindness streak and settings!</ThemedText>
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