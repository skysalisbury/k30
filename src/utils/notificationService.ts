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
    shouldShowBanner: true,
    shouldShowList: true,
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
 * Schedule daily kindness reminders using DailyTriggerInput
 * Reads times from user settings (not hardcoded)
 */
export async function scheduleDailyReminders(): Promise<void> {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('======================================');
    console.log('SCHEDULING DAILY REMINDERS');
    console.log('Using DailyTriggerInput');
    console.log('======================================');
    console.log('Cancelled all existing notifications');

    // Get user's notification settings
    const settings = await getNotificationSettings();

    if (!settings || !settings.enabled) {
      console.log('Notifications disabled by user');
      return;
    }

    const reminders = [
      {
        time: settings.preferred_time_1,
        title: '🌟 Morning Kindness Reminder',
        body: 'Start your day with an act of kindness! What will you do today?',
      },
      {
        time: settings.preferred_time_2,
        title: '💚 Evening Check-in',
        body: 'Did you spread kindness today? Log your act before the day ends!',
      },
    ];

    const now = new Date();
    console.log('Current time:', now.toLocaleString());
    console.log('Quiet hours enabled:', settings.quiet_hours_enabled);
    if (settings.quiet_hours_enabled) {
      console.log('Quiet hours:', settings.quiet_start, '-', settings.quiet_end);
    }
    console.log('--------------------------------------');

    for (const reminder of reminders) {
      const [hours, minutes] = reminder.time.split(':').map(Number);

      // Check if this time falls within quiet hours
      if (settings.quiet_hours_enabled && isInQuietHours(hours, minutes, settings)) {
        console.log('⏸️ SKIPPED:', reminder.title);
        console.log('   Reason: Falls within quiet hours');
        console.log('--------------------------------------');
        continue;
      }

      // Use DailyTriggerInput
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
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        } as Notifications.DailyTriggerInput,
      });

      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      console.log('✅ SCHEDULED:', reminder.title);
      console.log('   Time:', timeString, '(daily)');
      console.log('   Trigger type: DailyTriggerInput');
      console.log('--------------------------------------');
    }

    // Log all scheduled notifications for debugging
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('======================================');
    console.log('SUMMARY');
    console.log('======================================');
    console.log('Total scheduled notifications:', allScheduled.length);
    allScheduled.forEach((notif, index) => {
      console.log((index + 1) + '.', notif.content.title);
      const trigger = notif.trigger as any;
      console.log('   Type:', trigger.type || 'unknown');
      if (trigger.hour !== undefined) {
        console.log('   Fires daily at:', String(trigger.hour).padStart(2, '0') + ':' + String(trigger.minute).padStart(2, '0'));
      }
    });
    console.log('======================================');

  } catch (error) {
    console.error('❌ Error scheduling reminders:', error);
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
        body: 'Your kindness reminders are working! You will receive daily reminders at 9:00 AM and 9:00 PM.',
        sound: true,
      },
      trigger: {
        seconds: 2,
      } as Notifications.TimeIntervalTriggerInput,
    });
    console.log('Test notification scheduled for 2 seconds from now');
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
    console.log('======================================');
    console.log('SCHEDULED NOTIFICATIONS');
    console.log('======================================');
    console.log('Total:', scheduled.length);
    scheduled.forEach((notif, index) => {
      console.log((index + 1) + '.', notif.content.title);
      const trigger = notif.trigger as any;
      console.log('   Trigger:', JSON.stringify(trigger));
    });
    console.log('======================================');
    return scheduled;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}