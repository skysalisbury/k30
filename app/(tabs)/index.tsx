import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getChallengeForDay } from '@/src/data/kind30Challenges';
import { ChallengeProgress, User, UserStreak } from '@/src/utils/dataModels';
import {
  getChallengeProgress,
  getTodaysKindnessActs,
  getUser,
  getUserStreak,
  recalculateStreak,
  startKIND30Challenge
} from '@/src/utils/storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [challenge, setChallenge] = useState<ChallengeProgress | null>(null);
  const [todaysActsCount, setTodaysActsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Home screen focused - refreshing data');
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);

      try {
        await recalculateStreak();
        console.log('Streak recalculated on home screen load');
      } catch (error) {
        console.log('Could not recalculate streak (this is OK if no user exists yet)');
      }

      const [userData, streakData, challengeData, todaysActs] = await Promise.all([
        getUser(),
        getUserStreak(),
        getChallengeProgress(),
        getTodaysKindnessActs()
      ]);

      console.log('Home screen loaded data:', {
        user: userData,
        streak: streakData,
        challenge: challengeData,
        todaysActs: todaysActs.length
      });

      setUser(userData);
      setStreak(streakData);
      setChallenge(challengeData);
      setTodaysActsCount(todaysActs.length);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async () => {
    if (!user) {
      Alert.alert('Error', 'Please complete your profile first');
      return;
    }

    try {
      await startKIND30Challenge(user.id);
      await loadData();
      Alert.alert(
        'Challenge Started!',
        'Welcome to KIND30! Complete one act of kindness each day for 30 days.',
        [{ text: 'Let\'s Go!' }]
      );
    } catch (error) {
      console.error('Error starting challenge:', error);
      Alert.alert('Error', 'Failed to start challenge');
    }
  };

  const navigateToCalendar = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate('calendar');
  };

  const navigateToJournal = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate('journal');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.centerContent}>
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const currentDayChallenge = challenge ? getChallengeForDay(challenge.current_day) : null;
  const progressPercentage = challenge ? (challenge.completed_days.length / 30) * 100 : 0;

  console.log('Challenge display data:', {
    completedDays: challenge?.completed_days,
    completedCount: challenge?.completed_days.length,
    currentDay: challenge?.current_day,
    progressPercentage
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>

          {/* Welcome Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {moment().format('dddd, MMMM Do')}
            </ThemedText>
          </ThemedView>

          {/* Challenge Section */}
          {challenge && challenge.is_active ? (
            <ThemedView style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <ThemedText type="subtitle" style={styles.challengeTitle}>
                  KIND30 Challenge
                </ThemedText>
                <ThemedView style={styles.dayBadge}>
                  <ThemedText style={styles.dayBadgeText}>
                    Day {challenge.completed_days.length}/30
                  </ThemedText>
                </ThemedView>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <ThemedText style={styles.progressText}>
                  {challenge.completed_days.length} days completed
                </ThemedText>
              </View>

              {/* Today's Challenge */}
              {currentDayChallenge && challenge.current_day <= 30 && (
                <ThemedView style={styles.todayChallenge}>
                  <View style={styles.challengeTypeRow}>
                    <ThemedText style={styles.challengeType}>
                      {currentDayChallenge.type === 'challenge' && '🎯 Challenge'}
                      {currentDayChallenge.type === 'reflection' && '💭 Reflection'}
                      {currentDayChallenge.type === 'inspiration' && '✨ Inspiration'}
                      {currentDayChallenge.type === 'info' && '📚 Learn'}
                      {currentDayChallenge.type === 'story' && '📖 Story'}
                      {currentDayChallenge.type === 'launch' && '🚀 Launch'}
                    </ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.challengeTodayTitle}>
                    {currentDayChallenge.title}
                  </ThemedText>
                  <ThemedText style={styles.challengeDescription}>
                    {currentDayChallenge.description}
                  </ThemedText>
                  <ThemedView style={styles.actionPromptBox}>
                    <ThemedText style={styles.actionPromptLabel}>Today's Action:</ThemedText>
                    <ThemedText style={styles.actionPrompt}>
                      {currentDayChallenge.actionPrompt}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              )}

              {/* Complete Challenge Message */}
              {challenge.current_day > 30 && (
                <ThemedView style={styles.completeMessage}>
                  <ThemedText style={styles.completeEmoji}>🎉</ThemedText>
                  <ThemedText type="subtitle" style={styles.completeTitle}>
                    Challenge Complete!
                  </ThemedText>
                  <ThemedText style={styles.completeText}>
                    You've completed all 30 days. Keep the kindness going!
                  </ThemedText>
                </ThemedView>
              )}

              {/* Action Buttons */}
              {challenge.current_day <= 30 && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={navigateToCalendar}
                  >
                    <ThemedText style={styles.primaryButtonText}>
                      Log Today's Act
                    </ThemedText>
                  </TouchableOpacity>

                  {(currentDayChallenge?.type === 'reflection' || currentDayChallenge?.type === 'story') && (
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={navigateToJournal}
                    >
                      <ThemedText style={styles.secondaryButtonText}>
                        Write Reflection
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ThemedView>
          ) : (
            <ThemedView style={styles.noChallengeCard}>
              <ThemedText style={styles.noChallengeEmoji}>💚</ThemedText>
              <ThemedText type="subtitle" style={styles.noChallengeTitle}>
                Start Your Kindness Journey
              </ThemedText>
              <ThemedText style={styles.noChallengeText}>
                Join the KIND30 challenge: 30 days of intentional kindness to build a lifelong habit.
              </ThemedText>
              <TouchableOpacity style={styles.startButton} onPress={handleStartChallenge}>
                <ThemedText style={styles.startButtonText}>
                  Start KIND30 Challenge
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {streak?.current_streak_days || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {todaysActsCount}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Acts Today</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>
                {streak?.longest_streak_days || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Best Streak</ThemedText>
            </ThemedView>
          </View>

          {/* Quick Actions */}
          <ThemedView style={styles.quickActions}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Quick Actions
            </ThemedText>

            <TouchableOpacity style={styles.quickActionButton} onPress={navigateToCalendar}>
              <View style={styles.quickActionContent}>
                <ThemedText style={styles.quickActionIcon}>📅</ThemedText>
                <View style={styles.quickActionText}>
                  <ThemedText type="defaultSemiBold" style={styles.quickActionTitle}>Calendar</ThemedText>
                  <ThemedText style={styles.quickActionSubtext}>
                    Log your daily kindness
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={navigateToJournal}>
              <View style={styles.quickActionContent}>
                <ThemedText style={styles.quickActionIcon}>📝</ThemedText>
                <View style={styles.quickActionText}>
                  <ThemedText type="defaultSemiBold" style={styles.quickActionTitle}>Journal</ThemedText>
                  <ThemedText style={styles.quickActionSubtext}>
                    Reflect on your journey
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          </ThemedView>

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
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#ffffff',
  },
  subtitle: {
    opacity: 0.9,
    marginTop: 5,
    color: '#ffffff',
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  challengeTitle: {
    color: '#40ae49',
  },
  dayBadge: {
    backgroundColor: '#febe10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayBadgeText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#d4dcc4',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#40ae49',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
    color: '#000000',
  },
  todayChallenge: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  challengeTypeRow: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  challengeType: {
    fontSize: 12,
    color: '#40ae49',
    fontWeight: '600',
  },
  challengeTodayTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#000000',
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#000000',
  },
  actionPromptBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#febe10',
  },
  actionPromptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#febe10',
    marginBottom: 4,
  },
  actionPrompt: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  completeMessage: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  completeEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  completeTitle: {
    marginBottom: 8,
    color: '#40ae49',
  },
  completeText: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#000000',
  },
  actionButtons: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#40ae49',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#88c78d',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  noChallengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  noChallengeEmoji: {
    fontSize: 64,
    marginBottom: 15,
  },
  noChallengeTitle: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#40ae49',
  },
  noChallengeText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
    color: '#000000',
  },
  startButton: {
    backgroundColor: '#febe10',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#febe10',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    color: '#000000',
  },
  quickActions: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#ffffff',
  },
  quickActionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quickActionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    color: '#40ae49',
  },
  quickActionSubtext: {
    fontSize: 13,
    marginTop: 3,
    color: '#000000',
    opacity: 0.7,
  },
});