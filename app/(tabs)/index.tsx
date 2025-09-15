import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProfileSetupScreen from '@/src/screens/ProfileSetupScreen';
import WelcomeScreen from '@/src/screens/WelcomeScreen';
import { KindnessAct, User, UserProfile, UserStreak } from '@/src/utils/dataModels';
import {
  getTodaysKindnessActs,
  getUser,
  getUserProfile,
  getUserStreak,
  isUserSetupComplete,
  saveKindnessAct,
  saveUserStreak
} from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  // State variables - data that can change
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [todaysActs, setTodaysActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSetupComplete, setUserSetupComplete] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Load data when screen loads
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Check if user setup is complete
      const setupComplete = await isUserSetupComplete();

      if (!setupComplete) {
        setUserSetupComplete(false);
        setLoading(false);
        return;
      }

      // Load actual user data
      const userData = await getUser();
      const profileData = await getUserProfile();
      const streakData = await getUserStreak();
      const actsData = await getTodaysKindnessActs();

      setUser(userData);
      setProfile(profileData);
      setStreak(streakData);
      setTodaysActs(actsData);
      setUserSetupComplete(true);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a kindness act
  const addKindnessAct = async () => {
    if (!user) return;

    try {
      const newAct: KindnessAct = {
        id: Date.now().toString(),
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        title: 'Helped someone today',
        description: 'Made someone smile with a kind gesture',
        category: 'random',
        impact_level: 'medium',
        mood_after: 'happy',
        created_at: new Date().toISOString(),
      };

      await saveKindnessAct(newAct);

      // Update streak
      if (streak) {
        const updatedStreak: UserStreak = {
          ...streak,
          current_streak_days: streak.current_streak_days + 1,
          longest_streak_days: Math.max(streak.longest_streak_days, streak.current_streak_days + 1),
          last_activity_date: new Date().toISOString().split('T')[0],
          total_days_active: streak.total_days_active + 1,
        };
        await saveUserStreak(updatedStreak);
        setStreak(updatedStreak);
      }

      // Refresh today's acts
      const updatedActs = await getTodaysKindnessActs();
      setTodaysActs(updatedActs);

      Alert.alert('Success!', 'Your kindness act has been recorded! 🎉');
    } catch (error) {
      console.error('Error adding kindness act:', error);
      Alert.alert('Error', 'Could not save your kindness act');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading your kindness data...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Show setup flow if user hasn't completed setup
  if (!userSetupComplete) {
    // Show profile setup if they've passed welcome
    if (showProfileSetup) {
      return (
        <ProfileSetupScreen
          onComplete={() => {
            setShowProfileSetup(false);
            setUserSetupComplete(true);
            loadUserData(); // Reload data after setup
          }}
        />
      );
    }

    // Show welcome screen first
    return (
      <WelcomeScreen
        onGetStarted={() => setShowProfileSetup(true)}
      />
    );
  }

  const dailyGoal = 3;
  const completedToday = todaysActs.length;
  const progressPercentage = Math.min((completedToday / dailyGoal) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        {/* Welcome Section */}
        <ThemedView style={styles.welcomeSection}>
          <ThemedText type="title">Welcome back! 👋</ThemedText>
          <ThemedText type="subtitle">
            {profile?.first_name || user?.name || 'Kindness Warrior'}
          </ThemedText>
          <ThemedText>Spread kindness, one act at a time</ThemedText>
        </ThemedView>

        {/* Streak Counter */}
        <ThemedView style={styles.streakCard}>
          <ThemedText type="title" style={styles.streakNumber}>
            {streak?.current_streak_days || 0}
          </ThemedText>
          <ThemedText type="subtitle">Day Streak! 🔥</ThemedText>
          <ThemedText>
            Best: {streak?.longest_streak_days || 0} days
          </ThemedText>
        </ThemedView>

        {/* Daily Progress */}
        <ThemedView style={styles.progressCard}>
          <ThemedText type="subtitle" style={styles.darkText}>Today's Progress</ThemedText>
          <ThemedText style={styles.darkText}>{completedToday} of {dailyGoal} acts completed</ThemedText>

          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </ThemedView>

          <ThemedText style={styles.darkText}>
            {completedToday >= dailyGoal ? '🎉 Goal achieved!' : `${dailyGoal - completedToday} more to go!`}
          </ThemedText>
        </ThemedView>

        {/* Today's Acts */}
        <ThemedView style={styles.actsSection}>
          <ThemedText type="subtitle">Today's Kindness Acts</ThemedText>
          {todaysActs.length > 0 ? (
            todaysActs.map((act, index) => (
              <ThemedView key={act.id} style={styles.actCard}>
                <ThemedText type="defaultSemiBold" style={styles.darkText}>{act.title}</ThemedText>
                <ThemedText style={styles.darkText}>{act.description}</ThemedText>
                <ThemedText style={styles.actMeta}>
                  {act.category} • {act.impact_level} impact • Feeling {act.mood_after}
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedText>No acts of kindness recorded today. Start with one below! 💝</ThemedText>
          )}
        </ThemedView>

        {/* Add Kindness Button */}
        <TouchableOpacity style={styles.addButton} onPress={addKindnessAct}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            ✨ Add Kindness Act
          </ThemedText>
        </TouchableOpacity>

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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  streakCard: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkText: {
    color: '#000000',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 10,
  },
  actsSection: {
    marginBottom: 20,
  },
  actCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#58CC02',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});