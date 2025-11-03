import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getNotificationSettings } from './storage';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions from the user
 * Returns true if granted, false otherwise
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#58CC02',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
}

/**
 * Schedule daily kindness reminders based on user settings
 */
export async function scheduleDailyReminders(): Promise<void> {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get user's notification settings
    const settings = await getNotificationSettings();

    if (!settings || !settings.enabled) {
      console.log('Notifications disabled by user');
      return;
    }

    const reminders = [
      {
        time: settings.preferred_time_1, // e.g., "09:00"
        title: '🌟 Morning Kindness Reminder',
        body: 'Start your day with an act of kindness! What will you do today?',
      },
      {
        time: settings.preferred_time_2, // e.g., "21:00"
        title: '💚 Evening Check-in',
        body: 'Did you spread kindness today? Log your act before the day ends!',
      },
    ];

    for (const reminder of reminders) {
      const [hours, minutes] = reminder.time.split(':').map(Number);

      // Check if this time falls within quiet hours
      if (settings.quiet_hours_enabled && isInQuietHours(hours, minutes, settings)) {
        console.log(`Skipping reminder at ${reminder.time} - in quiet hours`);
        continue;
      }

      // Calculate next occurrence of this time
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
        console.log(`Time ${reminder.time} already passed today, scheduling for tomorrow`);
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });

      console.log(`✅ Scheduled reminder at ${reminder.time} (${hours}:${minutes})`);
      console.log(`   Current time: ${new Date().toLocaleString()}`);
      console.log(`   Next trigger: ${scheduledTime.toLocaleString()}`);
    }

    console.log('All reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    throw error;
  }
}

/**
 * Check if a given time falls within quiet hours
 */
function isInQuietHours(
  hour: number,
  minute: number,
  settings: { quiet_start: string; quiet_end: string }
): boolean {
  const [quietStartHour, quietStartMin] = settings.quiet_start.split(':').map(Number);
  const [quietEndHour, quietEndMin] = settings.quiet_end.split(':').map(Number);

  const currentTimeMinutes = hour * 60 + minute;
  const quietStartMinutes = quietStartHour * 60 + quietStartMin;
  const quietEndMinutes = quietEndHour * 60 + quietEndMin;

  // Handle quiet hours that span midnight
  if (quietStartMinutes > quietEndMinutes) {
    return currentTimeMinutes >= quietStartMinutes || currentTimeMinutes <= quietEndMinutes;
  }

  return currentTimeMinutes >= quietStartMinutes && currentTimeMinutes <= quietEndMinutes;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    throw error;
  }
}

/**
 * Send an immediate test notification
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Test Notification',
        body: 'Your kindness reminders are working! You\'ll receive daily reminders at your preferred times.',
        sound: true,
      },
      trigger: {
        seconds: 2,
      } as Notifications.TimeIntervalTriggerInput,
    });
    console.log('Test notification scheduled');
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduled.length);
    return scheduled;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}