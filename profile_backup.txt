import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EditNotificationSettings from '@/src/screens/EditNotificationSettings';
import EditProfileScreen from '@/src/screens/EditProfileScreen';
import { borderRadius, colors, spacing, typography } from '@/src/styles/globalStyles';
import { NotificationSettings, User, UserProfile, UserStreak } from '@/src/utils/dataModels';
import {
  cancelAllNotifications,
  registerForPushNotificationsAsync,
  scheduleDailyReminders,
  sendTestNotification
} from '@/src/utils/notificationService';
import {
  clearAllData,
  getNotificationSettings,
  getUser,
  getUserProfile,
  getUserStreak,
  recalculateStreak,
  saveNotificationSettings
} from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditNotifications, setShowEditNotifications] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      const userData = await getUser();
      const profileData = await getUserProfile();
      const streakData = await getUserStreak();
      let notificationData = await getNotificationSettings();

      if (!notificationData && userData) {
        notificationData = {
          user_id: userData.id,
          enabled: true,
          frequency_hours: 12,
          preferred_time_1: '09:00',
          preferred_time_2: '21:00',
          quiet_hours_enabled: true,
          quiet_start: '22:00',
          quiet_end: '08:00',
        };
        await saveNotificationSettings(notificationData);
      }

      setUser(userData);
      setProfile(profileData);
      setStreak(streakData);
      setNotifications(notificationData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateStreak = async () => {
    try {
      await recalculateStreak();
      await loadProfileData();
      Alert.alert(
        'Success!',
        'Your streak has been recalculated based on your calendar data.'
      );
    } catch (error) {
      console.error('Error recalculating streak:', error);
      Alert.alert('Error', 'Failed to recalculate streak.');
    }
  };

  const toggleNotifications = async () => {
    if (!notifications || !user) return;

    try {
      const newEnabled = !notifications.enabled;

      console.log('Toggle notifications:', {
        currentState: notifications.enabled,
        newState: newEnabled
      });

      if (newEnabled) {
        const hasPermission = await registerForPushNotificationsAsync();

        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings.'
          );
          return;
        }

        const updatedSettings: NotificationSettings = {
          ...notifications,
          enabled: true,
        };

        await saveNotificationSettings(updatedSettings);
        console.log('Settings saved:', updatedSettings);

        await scheduleDailyReminders();

        Alert.alert(
          'Notifications Enabled! 🎉',
          `You'll receive reminders every 2 minutes for testing. Check your notifications!`
        );
      } else {
        await cancelAllNotifications();

        Alert.alert(
          'Notifications Disabled',
          "You won't receive any more reminders."
        );
      }

      const updatedSettings: NotificationSettings = {
        ...notifications,
        enabled: newEnabled,
      };

      await saveNotificationSettings(updatedSettings);
      setNotifications(updatedSettings);

      console.log('Final notification state:', updatedSettings.enabled);
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert('Error', 'Could not update notification settings');
    }
  };

  const handleTestNotification = async () => {
    try {
      const hasPermission = await registerForPushNotificationsAsync();

      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings first.'
        );
        return;
      }

      await sendTestNotification();

      Alert.alert(
        'Test Sent! 🔔',
        'You should receive a test notification in 2 seconds.'
      );
    } catch (error) {
      console.error('Error sending test:', error);
      Alert.alert('Error', 'Could not send test notification');
    }
  };

  const toggleQuietHours = async () => {
    if (!notifications || !user) return;

    try {
      const updatedSettings: NotificationSettings = {
        ...notifications,
        quiet_hours_enabled: !notifications.quiet_hours_enabled,
      };

      await saveNotificationSettings(updatedSettings);
      setNotifications(updatedSettings);
    } catch (error) {
      console.error('Error updating quiet hours:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await clearAllData();
      setUser(null);
      setProfile(null);
      setStreak(null);
      setNotifications(null);
      loadProfileData();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (showEditProfile || !user || !profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EditProfileScreen
          onComplete={() => {
            setShowEditProfile(false);
            loadProfileData();
          }}
        />
      </SafeAreaView>
    );
  }

  if (showEditNotifications && notifications) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EditNotificationSettings
          currentSettings={notifications}
          onComplete={() => {
            setShowEditNotifications(false);
            loadProfileData();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>

          <ThemedView style={styles.profileHeader}>
            <ThemedView style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {(profile?.first_name?.[0] || user?.name?.[0] || 'K').toUpperCase()}
              </ThemedText>
            </ThemedView>

            {/* User Name with Sun Logos */}
            <View style={styles.nameWithLogos}>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
              <ThemedText type="title" style={styles.headerTitle}>
                {profile?.first_name} {profile?.last_name}
              </ThemedText>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
            </View>

            <ThemedText type="subtitle" style={styles.headerSubtitle}>
              {profile?.location_city || 'Kindness Warrior'}
            </ThemedText>
            <ThemedText style={styles.headerInfo}>
              Feeling {profile?.emotional_state || 'good'} • {profile?.mental_wellbeing?.replace('_', ' ') || 'good'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statCard}>
              <ThemedText type="title" style={styles.statNumber}>
                {streak?.current_streak_days || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText type="title" style={styles.statNumber}>
                {streak?.longest_streak_days || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Best Streak</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText type="title" style={styles.statNumber}>
                {streak?.total_days_active || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Days</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText type="title" style={styles.statNumber}>
                {user ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))) : 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Days Joined</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.settingsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Notification Settings
            </ThemedText>

            <ThemedView style={styles.settingCard}>
              <ThemedView style={styles.settingRow}>
                <ThemedView style={styles.settingInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.darkText}>
                    Push Notifications
                  </ThemedText>
                  <ThemedText style={styles.darkText}>
                    Get reminded to spread kindness
                  </ThemedText>
                </ThemedView>
                <Switch
                  value={notifications?.enabled || false}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#d4dcc4', true: '#40ae49' }}
                  thumbColor={notifications?.enabled ? '#ffffff' : '#f2f2f2'}
                />
              </ThemedView>
            </ThemedView>

            {notifications?.enabled && (
              <>
                <ThemedView style={styles.settingCard}>
                  <ThemedText type="defaultSemiBold" style={styles.darkText}>
                    Reminder Schedule
                  </ThemedText>
                  <ThemedText style={styles.darkText}>
                    Every {notifications.frequency_hours} hours
                  </ThemedText>
                  <ThemedText style={styles.settingDetail}>
                    {notifications.preferred_time_1} and {notifications.preferred_time_2}
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.editTimesButton}
                    onPress={() => setShowEditNotifications(true)}
                  >
                    <ThemedText style={styles.editTimesButtonText}>
                      ✏️ Edit Times
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.settingCard}>
                  <ThemedView style={styles.settingRow}>
                    <ThemedView style={styles.settingInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.darkText}>
                        Quiet Hours
                      </ThemedText>
                      <ThemedText style={styles.darkText}>
                        {notifications.quiet_start} - {notifications.quiet_end}
                      </ThemedText>
                    </ThemedView>
                    <Switch
                      value={notifications?.quiet_hours_enabled || false}
                      onValueChange={toggleQuietHours}
                      trackColor={{ false: '#d4dcc4', true: '#40ae49' }}
                      thumbColor={notifications?.quiet_hours_enabled ? '#ffffff' : '#f2f2f2'}
                    />
                  </ThemedView>
                </ThemedView>

                <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
                  <ThemedText type="defaultSemiBold" style={styles.testButtonText}>
                    🔔 Send Test Notification
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
          </ThemedView>

          <ThemedView style={styles.wellbeingSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Wellbeing Check-in
            </ThemedText>

            <ThemedView style={styles.wellbeingCard}>
              <ThemedText type="defaultSemiBold" style={styles.darkText}>
                Current Emotional State
              </ThemedText>
              <ThemedText style={[styles.darkText, styles.emotionalState]}>
                {profile?.emotional_state ?
                  profile.emotional_state.charAt(0).toUpperCase() + profile.emotional_state.slice(1) :
                  'Not set'}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={[styles.darkText, { marginTop: 15 }]}>
                Mental Wellbeing
              </ThemedText>
              <ThemedText style={[styles.darkText, styles.wellbeingLevel]}>
                {profile?.mental_wellbeing ?
                  profile.mental_wellbeing.replace('_', ' ').charAt(0).toUpperCase() +
                  profile.mental_wellbeing.replace('_', ' ').slice(1) :
                  'Not set'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity style={styles.recalculateButton} onPress={handleRecalculateStreak}>
            <ThemedText type="defaultSemiBold" style={styles.recalculateButtonText}>
              🔄 Fix Streak Counter
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
            <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>
              Delete Profile (Testing)
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton} onPress={() => setShowEditProfile(true)}>
            <ThemedText type="defaultSemiBold" style={styles.editButtonText}>
              Edit Profile
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton}>
            <ThemedText type="defaultSemiBold" style={styles.shareButtonText}>
              Invite Friends
            </ThemedText>
          </TouchableOpacity>

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
    paddingBottom: 100,
  },
  content: {
    padding: spacing.md,
    backgroundColor: 'transparent',
  },
  loadingText: {
    color: '#ffffff',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#febe10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: typography.weights.bold,
    color: '#000000',
  },
  nameWithLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: spacing.xs,
  },
  sunLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: '#ffffff',
  },
  headerSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
  },
  headerInfo: {
    color: '#ffffff',
    opacity: 0.9,
  },
  darkText: {
    color: '#000000',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    backgroundColor: 'transparent',
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    color: '#febe10',
  },
  statLabel: {
    color: '#000000',
  },

  settingsSection: {
    marginBottom: spacing.xl,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: '#ffffff',
  },
  settingCard: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  settingInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  settingDetail: {
    color: '#000000',
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  editTimesButton: {
    backgroundColor: '#40ae49',
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  editTimesButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  testButton: {
    backgroundColor: '#88c78d',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.md,
  },

  wellbeingSection: {
    marginBottom: spacing.xl,
    backgroundColor: 'transparent',
  },
  wellbeingCard: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emotionalState: {
    fontSize: typography.sizes.lg,
    marginTop: spacing.xs,
  },
  wellbeingLevel: {
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
    fontWeight: typography.weights.semibold,
  },

  recalculateButton: {
    backgroundColor: '#88c78d',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recalculateButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.md,
  },
  deleteButton: {
    backgroundColor: colors.ui.error,
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.sm,
  },
  editButton: {
    backgroundColor: '#40ae49',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.md,
  },
  shareButton: {
    backgroundColor: '#febe10',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#000000',
    fontSize: typography.sizes.md,
  },
});