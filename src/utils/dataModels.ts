export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  location_city?: string;
  avatar_uri?: string; // Local file URI for profile picture
  emotional_state: 'happy' | 'neutral' | 'sad' | 'anxious' | 'stressed' | 'excited' | 'peaceful';
  mental_wellbeing: 'excellent' | 'good' | 'fair' | 'struggling' | 'need_support';
  updated_at: string;
}

export interface UserStreak {
  user_id: string;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date: string;
  total_days_active: number;
}

export interface KindnessAct {
  id: string;
  user_id: string;
  date: string;
  title: string;
  description: string;
  category: 'personal' | 'community' | 'environmental' | 'random' | 'family' | 'work';
  impact_level: 'small' | 'medium' | 'large';
  mood_after: 'happy' | 'fulfilled' | 'proud' | 'peaceful' | 'energized';
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  kindness_act_id?: string | null;
  mood_before?: 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral';
  mood_after?: 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral';
  created_at: string;
  updated_at?: string;
}

export interface NotificationSettings {
  user_id: string;
  enabled: boolean;
  frequency_hours: number;
  preferred_time_1: string; // "09:00"
  preferred_time_2: string; // "21:00"
  quiet_hours_enabled: boolean;
  quiet_start: string;
  quiet_end: string;
}

export interface ChallengeProgress {
  user_id: string;
  challenge_name: 'KIND30';
  start_date: string; // ISO date when user started the challenge
  current_day: number; // 0-30 (0 = not started yet)
  completed_days: number[]; // array of completed day numbers
  is_active: boolean;
  completed_at?: string; // ISO date when they finished all 30 days
  last_updated: string;
}