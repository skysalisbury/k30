import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationSettings, User, UserProfile, UserStreak } from '@/src/utils/dataModels';
import { saveNotificationSettings, saveUser, saveUserProfile, saveUserStreak } from '@/src/utils/storage';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'excited', label: 'Excited', icon: '🎉' },
    { value: 'peaceful', label: 'Peaceful', icon: '😌' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'stressed', label: 'Stressed', icon: '😤' },
    { value: 'sad', label: 'Sad', icon: '😢' },
  ] as const;

  const completeSetup = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsCreating(true);

    try {
      const userId = Date.now().toString();

      const user: User = {
        id: userId,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
      };

      const profile: UserProfile = {
        user_id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        location_city: city.trim() || undefined,
        emotional_state: emotionalState,
        mental_wellbeing: 'good',
        updated_at: new Date().toISOString(),
      };

      const streak: UserStreak = {
        user_id: userId,
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        total_days_active: 0,
      };

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

      await saveUser(user);
      await saveUserProfile(profile);
      await saveUserStreak(streak);
      await saveNotificationSettings(notificationSettings);

      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Could not create profile. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.headerTitle}>Create Your Profile</ThemedText>
              <ThemedText style={styles.subtitle}>
                Tell us a bit about yourself to personalize your kindness journey
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>First Name *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                />
              </View>

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
                        {state.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.createButton, isCreating && styles.createButtonDisabled]}
              onPress={completeSetup}
              disabled={isCreating}
            >
              <ThemedText type="defaultSemiBold" style={styles.createButtonText}>
                {isCreating ? 'Creating Profile...' : 'Create Profile'}
              </ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.disclaimer}>* Required fields</ThemedText>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
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
    lineHeight: 22,
    color: '#ffffff',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionalOption: {
    width: '30%',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#d4dcc4',
  },
  emotionalOptionSelected: {
    borderColor: '#40ae49',
    backgroundColor: '#88c78d',
  },
  emotionalIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  emotionalLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000000',
  },
  emotionalLabelSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#febe10',
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
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    opacity: 0.9,
    color: '#ffffff',
  },
});