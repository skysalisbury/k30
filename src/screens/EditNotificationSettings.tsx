import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationSettings } from '@/src/utils/dataModels';
import { scheduleDailyReminders } from '@/src/utils/notificationService';
import { saveNotificationSettings } from '@/src/utils/storage';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EditNotificationSettingsProps {
  currentSettings: NotificationSettings;
  onComplete: () => void;
}

export default function EditNotificationSettings({ currentSettings, onComplete }: EditNotificationSettingsProps) {
  const [time1, setTime1] = useState(currentSettings.preferred_time_1);
  const [time2, setTime2] = useState(currentSettings.preferred_time_2);
  const [quietStart, setQuietStart] = useState(currentSettings.quiet_start);
  const [quietEnd, setQuietEnd] = useState(currentSettings.quiet_end);
  const [saving, setSaving] = useState(false);

  const validateTime = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleSave = async () => {
    if (!validateTime(time1) || !validateTime(time2) || !validateTime(quietStart) || !validateTime(quietEnd)) {
      Alert.alert('Invalid Time', 'Please enter times in HH:MM format (e.g., 09:00)');
      return;
    }

    setSaving(true);

    try {
      const updatedSettings: NotificationSettings = {
        ...currentSettings,
        preferred_time_1: time1,
        preferred_time_2: time2,
        quiet_start: quietStart,
        quiet_end: quietEnd,
      };

      await saveNotificationSettings(updatedSettings);

      if (currentSettings.enabled) {
        await scheduleDailyReminders();
      }

      Alert.alert(
        'Settings Updated! ✅',
        'Your notification schedule has been updated. You may receive a test notification shortly as the schedule is reset. Daily reminders will arrive at your chosen times starting tomorrow.',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Could not save notification settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>Edit Reminders</ThemedText>
            <ThemedText style={styles.subtitle}>
              Customize when you receive kindness reminders
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Daily Reminders
              </ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Morning Reminder</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor="#999999"
                  value={time1}
                  onChangeText={setTime1}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <ThemedText style={styles.hint}>Format: HH:MM (24-hour time)</ThemedText>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Evening Reminder</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="21:00"
                  placeholderTextColor="#999999"
                  value={time2}
                  onChangeText={setTime2}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <ThemedText style={styles.hint}>Format: HH:MM (24-hour time)</ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Quiet Hours</ThemedText>
              <ThemedText style={styles.description}>
                You won't receive notifications during these hours
              </ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Start Time</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="22:00"
                  placeholderTextColor="#999999"
                  value={quietStart}
                  onChangeText={setQuietStart}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>End Time</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="08:00"
                  placeholderTextColor="#999999"
                  value={quietEnd}
                  onChangeText={setQuietEnd}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.exampleBox}>
              <ThemedText style={styles.exampleTitle}>⏰ Time Format Examples</ThemedText>
              <ThemedText style={styles.exampleText}>
                • 9:00 AM → 09:00{'\n'}• 2:30 PM → 14:30{'\n'}• 9:00 PM → 21:00{'\n'}• 11:45 PM → 23:45
              </ThemedText>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onComplete}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <ThemedText style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#40ae49',
  },
  container: {
    flex: 1,
    backgroundColor: '#40ae49',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#ffffff',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
    color: '#ffffff',
  },
  form: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#40ae49',
  },
  description: {
    opacity: 0.7,
    marginBottom: 15,
    fontSize: 14,
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d4dcc4',
    color: '#000000',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 5,
    color: '#000000',
  },
  exampleBox: {
    backgroundColor: '#fcebb4',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#febe10',
  },
  exampleTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#40ae49',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});