import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User, UserProfile } from '@/src/utils/dataModels';
import { getUser, getUserProfile, saveUser, saveUserProfile } from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      console.log('Validation failed: Required fields missing');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return;
    }

    setSaving(true);

    try {
      const userId = user?.id || Date.now().toString();
      const now = new Date().toISOString();

      const updatedUser: User = {
        id: userId,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        created_at: user?.created_at || now,
      };

      const updatedProfile: UserProfile = {
        user_id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        location_city: city.trim() || undefined,
        emotional_state: emotionalState,
        mental_wellbeing: profile?.mental_wellbeing || 'good',
        updated_at: now,
      };

      await saveUser(updatedUser);
      await saveUserProfile(updatedProfile);

      console.log('Profile saved successfully');
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.centerContent}>
            <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>Edit Profile</ThemedText>
            <ThemedText style={styles.subtitle}>Update your information</ThemedText>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    color: '#ffffff',
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