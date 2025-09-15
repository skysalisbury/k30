import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, KindnessAct, NotificationSettings, User, UserProfile, UserStreak } from './dataModels';

// Storage keys - constants to avoid typos
const STORAGE_KEYS = {
  USER: 'user',
  USER_PROFILE: 'user_profile',
  USER_STREAK: 'user_streak',
  KINDNESS_ACTS: 'kindness_acts',
  JOURNAL_ENTRIES: 'journal_entries',
  NOTIFICATION_SETTINGS: 'notification_settings',
};

// User functions
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

// User Profile functions
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

// Streak functions
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

// Kindness Acts functions
export const saveKindnessAct = async (act: KindnessAct): Promise<void> => {
  try {
    // Get existing acts
    const existingActs = await getKindnessActs();

    // Check if act already exists (for updates)
    const existingIndex = existingActs.findIndex(existingAct => existingAct.id === act.id);

    if (existingIndex >= 0) {
      // Update existing act
      existingActs[existingIndex] = act;
    } else {
      // Add new act
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

// Get today's kindness acts
export const getTodaysKindnessActs = async (): Promise<KindnessAct[]> => {
  try {
    const allActs = await getKindnessActs();
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    return allActs.filter(act => act.date === today);
  } catch (error) {
    console.error('Error getting today\'s acts:', error);
    return [];
  }
};

// Journal Entry functions
export const saveJournalEntry = async (entry: JournalEntry): Promise<void> => {
  try {
    // Get existing entries
    const existingEntries = await getJournalEntries();

    // Check if entry already exists (for updates)
    const existingIndex = existingEntries.findIndex(existingEntry => existingEntry.id === entry.id);

    if (existingIndex >= 0) {
      // Update existing entry
      existingEntries[existingIndex] = entry;
    } else {
      // Add new entry
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

// Get journal entries for a specific date
export const getJournalEntriesForDate = async (date: string): Promise<JournalEntry[]> => {
  try {
    const allEntries = await getJournalEntries();
    // Filter entries by date (comparing the date portion of created_at)
    return allEntries.filter(entry => entry.created_at.split('T')[0] === date);
  } catch (error) {
    console.error('Error getting journal entries for date:', error);
    return [];
  }
};

// Get journal entries linked to a specific kindness act
export const getJournalEntriesForKindnessAct = async (kindnessActId: string): Promise<JournalEntry[]> => {
  try {
    const allEntries = await getJournalEntries();
    return allEntries.filter(entry => entry.kindness_act_id === kindnessActId);
  } catch (error) {
    console.error('Error getting journal entries for kindness act:', error);
    return [];
  }
};

// Notification Settings functions
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

// Utility function to clear all data (useful for testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Check if user has completed setup
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