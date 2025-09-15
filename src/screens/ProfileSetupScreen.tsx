import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationSettings, User, UserProfile, UserStreak } from '@/src/utils/dataModels';
import { saveNotificationSettings, saveUser, saveUserProfile, saveUserStreak } from '@/src/utils/storage';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export default function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [emotionalState, setEmotionalState] = useState<'happy' | 'neutral' | 'sad' | 'anxious' | 'stressed' | 'excited' | 'peaceful'>('happy');
  const [isCreating, setIsCreating] = useState(false);

  const emotionalStates = [
    { value: 'happy', label: 'Happy 😊', icon: '😊' },
    { value: 'excited', label: 'Excited 🎉', icon: '🎉' },
    { value: 'peaceful', label: 'Peaceful 😌', icon: '😌' },
    { value: 'neutral', label: 'Neutral 😐', icon: '😐' },
    { value: 'anxious', label: 'Anxious 😰', icon: '😰' },
    { value: 'stressed', label: 'Stressed 😤', icon: '😤' },
    { value: 'sad', label: 'Sad 😢', icon: '😢' },
  ] as const;

  const completeSetup = async () => {
    console.log('Create Profile button clicked!'); // Debug log
    console.log('Form values:', { firstName, lastName, email, city, emotionalState }); // Debug log

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name and email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    console.log('Validation passed, creating profile...'); // Debug log
    setIsCreating(true);

    try {
      const userId = Date.now().toString();
      console.log('Generated userId:', userId); // Debug log

      // Create user
      const user: User = {
        id: userId,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
      };

      // Create profile
      const profile: UserProfile = {
        user_id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        location_city: city.trim() || undefined,
        emotional_state: emotionalState,
        mental_wellbeing: 'good',
        updated_at: new Date().toISOString(),
      };

      // Create initial streak (starting fresh)
      const streak: UserStreak = {
        user_id: userId,
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        total_days_active: 0,
      };

      // Create default notification settings
      const notificationSettings: NotificationSettings = {
        user_id: userId,
        enabled: true,
        frequency_hours: 12,
        preferred_time_1: '09:00',
        preferred_time_2: '21:00',
        quiet_hours_enabled: true,
        quiet_start: '22:00',
        quiet_end: '08:00',
      };

      console.log('Saving data to storage...'); // Debug log

      // Save all data
      await saveUser(user);
      console.log('User saved'); // Debug log

      await saveUserProfile(profile);
      console.log('Profile saved'); // Debug log

      await saveUserStreak(streak);
      console.log('Streak saved'); // Debug log

      await saveNotificationSettings(notificationSettings);
      console.log('Notifications saved'); // Debug log

      console.log('All data saved successfully!'); // Debug log
      console.log('All data saved successfully!'); // Debug log
      console.log('Calling onComplete callback to return to main app');
      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Could not create profile. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Create Your Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tell us a bit about yourself to personalize your kindness journey
          </ThemedText>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>First Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Last Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>City (Optional)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>

          {/* Emotional State Selection */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>How are you feeling today?</ThemedText>
            <View style={styles.emotionalGrid}>
              {emotionalStates.map((state) => (
                <TouchableOpacity
                  key={state.value}
                  style={[
                    styles.emotionalOption,
                    emotionalState === state.value && styles.emotionalOptionSelected
                  ]}
                  onPress={() => setEmotionalState(state.value)}
                >
                  <ThemedText style={styles.emotionalIcon}>{state.icon}</ThemedText>
                  <ThemedText style={[
                    styles.emotionalLabel,
                    emotionalState === state.value && styles.emotionalLabelSelected
                  ]}>
                    {state.value.charAt(0).toUpperCase() + state.value.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Create Profile Button */}
        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.createButtonDisabled]}
          onPress={completeSetup}
          disabled={isCreating}
        >
          <ThemedText type="defaultSemiBold" style={styles.createButtonText}>
            {isCreating ? 'Creating Profile...' : 'Create Profile'}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.disclaimer}>
          * Required fields
        </ThemedText>

      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionalOption: {
    width: '30%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  emotionalOptionSelected: {
    borderColor: '#58CC02',
    backgroundColor: '#F0F8E8',
  },
  emotionalIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  emotionalLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  emotionalLabelSelected: {
    color: '#58CC02',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#58CC02',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    opacity: 0.6,
  },
});