import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User, UserProfile } from '@/src/utils/dataModels';
import { getUser, getUserProfile, saveUser, saveUserProfile } from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface EditProfileScreenProps {
  onComplete: () => void;
}

export default function EditProfileScreen({ onComplete }: EditProfileScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [emotionalState, setEmotionalState] = useState<'happy' | 'neutral' | 'sad' | 'anxious' | 'stressed' | 'excited' | 'peaceful'>('happy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const emotionalStates = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'excited', label: 'Excited', icon: '🎉' },
    { value: 'peaceful', label: 'Peaceful', icon: '😌' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'stressed', label: 'Stressed', icon: '😤' },
    { value: 'sad', label: 'Sad', icon: '😢' },
  ] as const;

  useEffect(() => {
    loadCurrentProfile();
  }, []);

  const loadCurrentProfile = async () => {
    try {
      const userData = await getUser();
      const profileData = await getUserProfile();

      if (userData && profileData) {
        setUser(userData);
        setProfile(profileData);

        // Pre-fill form with current data
        setFirstName(profileData.first_name);
        setLastName(profileData.last_name);
        setEmail(userData.email);
        setCity(profileData.location_city || '');
        setEmotionalState(profileData.emotional_state || 'happy');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      // Skip Alert and just console log the validation error
      console.log('Validation failed: Required fields missing');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return;
    }

    if (!user || !profile) return;

    setSaving(true);

    try {
      // Update user data
      const updatedUser: User = {
        ...user,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
      };

      // Update profile data
      const updatedProfile: UserProfile = {
        ...profile,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        location_city: city.trim() || undefined,
        emotional_state: emotionalState,
        updated_at: new Date().toISOString(),
      };

      await saveUser(updatedUser);
      await saveUserProfile(updatedProfile);

      console.log('Profile updated successfully');
      onComplete(); // Return to profile view
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading profile...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        <View style={styles.header}>
          <ThemedText type="title">Edit Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Update your information
          </ThemedText>
        </View>

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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onComplete}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={saving}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </ThemedText>
          </TouchableOpacity>
        </View>

      </ThemedView>
    </ScrollView>
  );
}

// ... (keep all the existing styles exactly the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});