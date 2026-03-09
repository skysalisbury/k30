import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

// HARDCODED NOTIFICATION TIMES
const MORNING_HOUR = 9;  // 9:00 AM
const MORNING_MINUTE = 0;
const EVENING_HOUR = 21; // 9:00 PM
const EVENING_MINUTE = 0;

// HARDCODED QUIET HOURS
const QUIET_START_HOUR = 22;   // 10:00 PM
const QUIET_START_MINUTE = 0;
const QUIET_END_HOUR = 8;      // 8:00 AM
const QUIET_END_MINUTE = 0;

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
 * This is different from CalendarTriggerInput and may avoid the immediate fire bug
 */
export async function scheduleDailyReminders(): Promise<void> {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('======================================');
    console.log('SCHEDULING DAILY REMINDERS');
    console.log('Using DailyTriggerInput (not CalendarTrigger)');
    console.log('======================================');
    console.log('Cancelled all existing notifications');

    const reminders = [
      {
        hour: MORNING_HOUR,
        minute: MORNING_MINUTE,
        title: '🌟 Morning Kindness Reminder',
        body: 'Start your day with an act of kindness! What will you do today?',
      },
      {
        hour: EVENING_HOUR,
        minute: EVENING_MINUTE,
        title: '💚 Evening Check-in',
        body: 'Did you spread kindness today? Log your act before the day ends!',
      },
    ];

    const now = new Date();
    console.log('Current time:', now.toLocaleString());
    console.log('Quiet hours: 10:00 PM - 8:00 AM');
    console.log('--------------------------------------');

    for (const reminder of reminders) {
      // Check if this time falls within quiet hours
      if (isInQuietHours(reminder.hour, reminder.minute)) {
        console.log('⏸️ SKIPPED:', reminder.title);
        console.log('   Reason: Falls within quiet hours');
        console.log('--------------------------------------');
        continue;
      }

      // Use DailyTriggerInput instead of CalendarTriggerInput
      // This might avoid the immediate fire bug
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: reminder.hour,
          minute: reminder.minute,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        } as Notifications.DailyTriggerInput,
      });

      const timeString = `${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')}`;
      console.log('✅ SCHEDULED:', reminder.title);
      console.log('   Time:', timeString, '(daily)');
      console.log('   Trigger type: DailyTriggerInput');
      console.log('   Next fire: Next occurrence of', timeString);
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
 * Check if a given time falls within hardcoded quiet hours (10 PM - 8 AM)
 */
function isInQuietHours(hour: number, minute: number): boolean {
  const currentTimeMinutes = hour * 60 + minute;
  const quietStartMinutes = QUIET_START_HOUR * 60 + QUIET_START_MINUTE;
  const quietEndMinutes = QUIET_END_HOUR * 60 + QUIET_END_MINUTE;

  // Handle quiet hours that span midnight (10 PM to 8 AM)
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