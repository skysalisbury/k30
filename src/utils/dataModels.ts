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