import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EditProfileScreen from '@/src/screens/EditProfileScreen';
import { NotificationSettings, User, UserProfile, UserStreak } from '@/src/utils/dataModels';
import {
  clearAllData,
  getNotificationSettings,
  getUser,
  getUserProfile,
  getUserStreak,
  saveNotificationSettings
} from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

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

      // Create default notification settings if none exist
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

  const toggleNotifications = async () => {
    if (!notifications || !user) return;

    try {
      const updatedSettings: NotificationSettings = {
        ...notifications,
        enabled: !notifications.enabled,
      };

      await saveNotificationSettings(updatedSettings);
      setNotifications(updatedSettings);

      Alert.alert(
        'Settings Updated',
        `Notifications ${updatedSettings.enabled ? 'enabled' : 'disabled'}`
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Could not update notification settings');
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
    console.log('Delete button clicked!');
    console.log('Bypassing alert - calling clearAllData directly');

    try {
      console.log('Before clearAllData');
      const userBefore = await getUser();
      const profileBefore = await getUserProfile();
      console.log('User before:', userBefore);
      console.log('Profile before:', profileBefore);

      await clearAllData();
      console.log('After clearAllData - success');

      const userAfter = await getUser();
      const profileAfter = await getUserProfile();
      console.log('User after:', userAfter);
      console.log('Profile after:', profileAfter);

      console.log('Resetting component state...');
      setUser(null);
      setProfile(null);
      setStreak(null);
      setNotifications(null);

      console.log('Reloading profile data...');
      loadProfileData();
    } catch (error) {
      console.error('Error in clearAllData:', error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  // Show edit profile screen if in edit mode
  if (showEditProfile) {
    return (
      <EditProfileScreen
        onComplete={() => {
          setShowEditProfile(false);
          loadProfileData(); // Reload data to show updates
        }}
      />
    );
  }

  // Show message if no user data exists
  if (!user || !profile) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ThemedText type="title">Welcome!</ThemedText>
          <ThemedText style={styles.noProfileText}>
            Let's get your profile set up first.
          </ThemedText>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => {
              Alert.alert(
                'Profile Setup',
                'Please go to the Home tab to complete your profile setup.'
              );
            }}
          >
            <ThemedText type="defaultSemiBold" style={styles.setupButtonText}>
              Set Up Profile
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {(profile?.first_name?.[0] || user?.name?.[0] || 'K').toUpperCase()}
            </ThemedText>
          </ThemedView>
          <ThemedText type="title">
            {profile?.first_name} {profile?.last_name}
          </ThemedText>
          <ThemedText type="subtitle">
            {profile?.location_city || 'Kindness Warrior'}
          </ThemedText>
          <ThemedText>
            Feeling {profile?.emotional_state || 'good'} • {profile?.mental_wellbeing?.replace('_', ' ') || 'good'}
          </ThemedText>
        </ThemedView>

        {/* Stats Grid */}
        <ThemedView style={styles.statsGrid}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="title" style={styles.darkText}>
              {streak?.current_streak_days || 0}
            </ThemedText>
            <ThemedText style={styles.darkText}>Current Streak</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText type="title" style={styles.darkText}>
              {streak?.longest_streak_days || 0}
            </ThemedText>
            <ThemedText style={styles.darkText}>Best Streak</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText type="title" style={styles.darkText}>
              {streak?.total_days_active || 0}
            </ThemedText>
            <ThemedText style={styles.darkText}>Total Days</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText type="title" style={styles.darkText}>
              {user ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))) : 0}
            </ThemedText>
            <ThemedText style={styles.darkText}>Days Joined</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Notification Settings */}
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
                trackColor={{ false: '#E0E0E0', true: '#58CC02' }}
                thumbColor={notifications?.enabled ? '#ffffff' : '#f4f3f4'}
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
                    trackColor={{ false: '#E0E0E0', true: '#58CC02' }}
                    thumbColor={notifications?.quiet_hours_enabled ? '#ffffff' : '#f4f3f4'}
                  />
                </ThemedView>
              </ThemedView>
            </>
          )}
        </ThemedView>

        {/* Mental Wellbeing Section */}
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

        {/* Action Buttons */}
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
    padding: 20,
  },
  noProfileText: {
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  darkText: {
    color: '#000000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#666666',
    fontSize: 14,
    marginTop: 5,
  },
  wellbeingSection: {
    marginBottom: 30,
  },
  wellbeingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionalState: {
    fontSize: 18,
    marginTop: 5,
  },
  wellbeingLevel: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
  },
  setupButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  setupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});