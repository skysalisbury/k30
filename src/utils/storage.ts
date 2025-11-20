import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { ChallengeProgress, JournalEntry, KindnessAct, NotificationSettings, User, UserProfile, UserStreak } from './dataModels';

const STORAGE_KEYS = {
  USER: 'user',
  USER_PROFILE: 'user_profile',
  USER_STREAK: 'user_streak',
  KINDNESS_ACTS: 'kindness_acts',
  JOURNAL_ENTRIES: 'journal_entries',
  NOTIFICATION_SETTINGS: 'notification_settings',
  CHALLENGE_PROGRESS: 'challenge_progress',
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserStreak = async (streak: UserStreak): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error('Error saving user streak:', error);
    throw error;
  }
};

export const getUserStreak = async (): Promise<UserStreak | null> => {
  try {
    const streakData = await AsyncStorage.getItem(STORAGE_KEYS.USER_STREAK);
    return streakData ? JSON.parse(streakData) : null;
  } catch (error) {
    console.error('Error getting user streak:', error);
    return null;
  }
};

export const recalculateStreak = async (): Promise<void> => {
  try {
    const user = await getUser();
    if (!user) {
      console.log('No user found');
      return; // Just return, don't throw error
    }

    const acts = await getKindnessActs();
    const datesWithActs = [...new Set(acts.map(act => act.date))].sort();

    // If no acts, initialize streak with zeros - this is normal for new users
    if (datesWithActs.length === 0) {
      console.log('No acts found - initializing empty streak for new user');
      const emptyStreak: UserStreak = {
        user_id: user.id,
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: moment().format('YYYY-MM-DD'),
        total_days_active: 0,
      };
      await saveUserStreak(emptyStreak);
      return;
    }

    console.log('Dates with acts:', datesWithActs);

    const today = moment().format('YYYY-MM-DD');
    let currentStreak = 0;
    let checkDate = moment();

    const hasActToday = datesWithActs.includes(today);
    const hasActYesterday = datesWithActs.includes(moment().subtract(1, 'days').format('YYYY-MM-DD'));

    if (!hasActToday && !hasActYesterday) {
      currentStreak = 0;
    } else {
      if (hasActToday) {
        currentStreak = 1;
        checkDate = moment().subtract(1, 'days');
      } else {
        currentStreak = 1;
        checkDate = moment().subtract(2, 'days');
      }

      while (datesWithActs.includes(checkDate.format('YYYY-MM-DD'))) {
        currentStreak++;
        checkDate = checkDate.subtract(1, 'days');
      }
    }

    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < datesWithActs.length; i++) {
      const prevDate = moment(datesWithActs[i - 1]);
      const currDate = moment(datesWithActs[i]);
      const daysDiff = currDate.diff(prevDate, 'days');

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const lastActivityDate = datesWithActs[datesWithActs.length - 1];

    const updatedStreak: UserStreak = {
      user_id: user.id,
      current_streak_days: currentStreak,
      longest_streak_days: Math.max(longestStreak, currentStreak),
      last_activity_date: lastActivityDate,
      total_days_active: datesWithActs.length,
    };

    await saveUserStreak(updatedStreak);
    console.log('Streak recalculated successfully:', updatedStreak);
  } catch (error) {
    console.error('Error recalculating streak:', error);
    // Don't throw - just log the error so app can continue
  }
};

export const saveKindnessAct = async (act: KindnessAct): Promise<void> => {
  try {
    const existingActs = await getKindnessActs();
    const existingIndex = existingActs.findIndex(existingAct => existingAct.id === act.id);

    if (existingIndex >= 0) {
      existingActs[existingIndex] = act;
    } else {
      existingActs.push(act);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.KINDNESS_ACTS, JSON.stringify(existingActs));
  } catch (error) {
    console.error('Error saving kindness act:', error);
    throw error;
  }
};

export const getKindnessActs = async (): Promise<KindnessAct[]> => {
  try {
    const actsData = await AsyncStorage.getItem(STORAGE_KEYS.KINDNESS_ACTS);
    return actsData ? JSON.parse(actsData) : [];
  } catch (error) {
    console.error('Error getting kindness acts:', error);
    return [];
  }
};

export const getTodaysKindnessActs = async (): Promise<KindnessAct[]> => {
  try {
    const allActs = await getKindnessActs();
    const today = new Date().toISOString().split('T')[0];
    return allActs.filter(act => act.date === today);
  } catch (error) {
    console.error('Error getting today\'s acts:', error);
    return [];
  }
};

export const saveJournalEntry = async (entry: JournalEntry): Promise<void> => {
  try {
    const existingEntries = await getJournalEntries();
    const existingIndex = existingEntries.findIndex(existingEntry => existingEntry.id === entry.id);

    if (existingIndex >= 0) {
      existingEntries[existingIndex] = entry;
    } else {
      existingEntries.push(entry);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(existingEntries));
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const entriesData = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return entriesData ? JSON.parse(entriesData) : [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
};

export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  try {
    const existingEntries = await getJournalEntries();
    const filteredEntries = existingEntries.filter(entry => entry.id !== entryId);
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

export const getJournalEntriesForDate = async (date: string): Promise<JournalEntry[]> => {
  try {
    const allEntries = await getJournalEntries();
    return allEntries.filter(entry => entry.created_at.split('T')[0] === date);
  } catch (error) {
    console.error('Error getting journal entries for date:', error);
    return [];
  }
};

export const getJournalEntriesForKindnessAct = async (kindnessActId: string): Promise<JournalEntry[]> => {
  try {
    const allEntries = await getJournalEntries();
    return allEntries.filter(entry => entry.kindness_act_id === kindnessActId);
  } catch (error) {
    console.error('Error getting journal entries for kindness act:', error);
    return [];
  }
};

export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
    throw error;
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings | null> => {
  try {
    const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    return settingsData ? JSON.parse(settingsData) : null;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

export const saveChallengeProgress = async (progress: ChallengeProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving challenge progress:', error);
    throw error;
  }
};

export const getChallengeProgress = async (): Promise<ChallengeProgress | null> => {
  try {
    const progressData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_PROGRESS);
    return progressData ? JSON.parse(progressData) : null;
  } catch (error) {
    console.error('Error getting challenge progress:', error);
    return null;
  }
};

export const startKIND30Challenge = async (userId: string): Promise<ChallengeProgress> => {
  try {
    const newChallenge: ChallengeProgress = {
      user_id: userId,
      challenge_name: 'KIND30',
      start_date: new Date().toISOString(),
      current_day: 0,
      completed_days: [],
      is_active: true,
      last_updated: new Date().toISOString(),
    };

    await saveChallengeProgress(newChallenge);
    return newChallenge;
  } catch (error) {
    console.error('Error starting KIND30 challenge:', error);
    throw error;
  }
};

export const markChallengeDay = async (day: number): Promise<void> => {
  try {
    const progress = await getChallengeProgress();
    if (!progress) {
      console.error('No active challenge found');
      return;
    }

    if (!progress.completed_days.includes(day)) {
      progress.completed_days.push(day);
      progress.completed_days.sort((a, b) => a - b);
    }

    let nextDay = progress.current_day;
    while (nextDay <= 30 && progress.completed_days.includes(nextDay)) {
      nextDay++;
    }
    progress.current_day = nextDay;

    if (progress.completed_days.length === 30) {
      progress.is_active = false;
      progress.completed_at = new Date().toISOString();
    }

    progress.last_updated = new Date().toISOString();
    await saveChallengeProgress(progress);
  } catch (error) {
    console.error('Error marking challenge day:', error);
    throw error;
  }
};

export const getDaysSinceStart = async (): Promise<number> => {
  try {
    const progress = await getChallengeProgress();
    if (!progress) return 0;

    const startDate = new Date(progress.start_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Error calculating days since start:', error);
    return 0;
  }
};

export const hasActiveChallenge = async (): Promise<boolean> => {
  try {
    const progress = await getChallengeProgress();
    return progress?.is_active || false;
  } catch (error) {
    console.error('Error checking active challenge:', error);
    return false;
  }
};

export const resetChallenge = async (userId: string): Promise<ChallengeProgress> => {
  try {
    return await startKIND30Challenge(userId);
  } catch (error) {
    console.error('Error resetting challenge:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export const isUserSetupComplete = async (): Promise<boolean> => {
  try {
    const user = await getUser();
    const profile = await getUserProfile();
    return !!(user && profile);
  } catch (error) {
    console.error('Error checking user setup:', error);
    return false;
  }
};