import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KindnessAct, User } from '@/src/utils/dataModels';
import {
  getChallengeProgress,
  getKindnessActs,
  getTodaysKindnessActs,
  getUser,
  getUserStreak,
  markChallengeDay,
  saveKindnessAct,
  saveUserStreak
} from '@/src/utils/storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDateActs, setSelectedDateActs] = useState<KindnessAct[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Form state for adding kindness acts
  const [newActTitle, setNewActTitle] = useState('');
  const [newActDescription, setNewActDescription] = useState('');
  const [newActCategory, setNewActCategory] = useState<'personal' | 'community' | 'environmental' | 'random' | 'family' | 'work'>('random');

  const categories = [
    { value: 'personal', label: 'Personal', icon: '💝' },
    { value: 'community', label: 'Community', icon: '🤝' },
    { value: 'environmental', label: 'Environmental', icon: '🌱' },
    { value: 'random', label: 'Random Acts', icon: '✨' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Work', icon: '💼' },
  ] as const;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update selected date acts when date or acts change
    const actsForDate = kindnessActs.filter(act => act.date === selectedDate);
    setSelectedDateActs(actsForDate);
  }, [selectedDate, kindnessActs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const acts = await getKindnessActs();
      const userData = await getUser();
      console.log('Loaded user:', userData);
      console.log('Loaded acts:', acts);
      setKindnessActs(acts);
      setUser(userData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create marked dates for calendar
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    // Mark dates with kindness acts
    kindnessActs.forEach(act => {
      marked[act.date] = {
        marked: true,
        dotColor: '#58CC02',
        selectedColor: '#58CC02',
      };
    });

    // Mark selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#FF6B6B',
    };

    return marked;
  };

  const addKindnessAct = async () => {
    console.log('Save button clicked');
    console.log('Title:', newActTitle);
    console.log('User:', user);

    if (!newActTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your kindness act');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found. Please complete your profile first.');
      return;
    }

    try {
      const newAct: KindnessAct = {
        id: Date.now().toString(),
        user_id: user.id,
        date: selectedDate,
        title: newActTitle.trim(),
        description: newActDescription.trim(),
        category: newActCategory,
        impact_level: 'medium',
        mood_after: 'happy',
        created_at: new Date().toISOString(),
      };

      console.log('Saving act:', newAct);
      await saveKindnessAct(newAct);

      // Only update streak and challenge on the FIRST act of the day
      const todayActs = await getTodaysKindnessActs();
      const isFirstActToday = todayActs.length === 1; // Will be 1 because we just saved one

      if (selectedDate === moment().format('YYYY-MM-DD') && isFirstActToday) {
        // Update streak
        const streak = await getUserStreak();
        if (streak) {
          const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
          const wasActiveYesterday = streak.last_activity_date === yesterday;
          const isFirstEver = !streak.last_activity_date;

          // Calculate new streak: reset to 1 if there was a gap, otherwise increment
          const newStreakDays = (wasActiveYesterday || isFirstEver)
            ? streak.current_streak_days + 1
            : 1;

          const updatedStreak = {
            ...streak,
            current_streak_days: newStreakDays,
            longest_streak_days: Math.max(streak.longest_streak_days, newStreakDays),
            last_activity_date: selectedDate,
            total_days_active: streak.total_days_active + 1,
          };
          await saveUserStreak(updatedStreak);
          console.log('Streak updated:', updatedStreak);
        }

        // Update challenge progress - only once per day
        const challenge = await getChallengeProgress();
        if (challenge && challenge.is_active) {
          const startDate = moment(challenge.start_date);
          const today = moment();
          const daysSinceStart = today.diff(startDate, 'days') + 1;

          if (daysSinceStart <= 30 && !challenge.completed_days.includes(daysSinceStart)) {
            await markChallengeDay(daysSinceStart);
            console.log(`Challenge day ${daysSinceStart} marked complete`);
          }
        }
      }

      // Refresh data
      await loadData();

      // Reset form
      setNewActTitle('');
      setNewActDescription('');
      setNewActCategory('random');
      setShowAddModal(false);

      Alert.alert('Success!', 'Your kindness act has been saved.');
      console.log('Kindness act added successfully');
    } catch (error) {
      console.error('Error adding kindness act:', error);
      Alert.alert('Error', 'Failed to save kindness act. Please try again.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading calendar...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        {/* Calendar */}
        <ThemedView style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#FF6B6B',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#58CC02',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#58CC02',
              selectedDotColor: '#ffffff',
              arrowColor: '#58CC02',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: '#2d4150',
              indicatorColor: '#58CC02',
            }}
          />
        </ThemedView>

        {/* Selected Date Info */}
        <ThemedView style={styles.dateInfoContainer}>
          <ThemedText type="subtitle">
            {moment(selectedDate).format('MMMM Do, YYYY')}
          </ThemedText>
          <ThemedText style={styles.dateSubtext}>
            {selectedDateActs.length} act{selectedDateActs.length !== 1 ? 's' : ''} of kindness
          </ThemedText>
        </ThemedView>

        {/* Acts for Selected Date */}
        <ThemedView style={styles.actsSection}>
          {selectedDateActs.length > 0 ? (
            selectedDateActs.map((act) => (
              <ThemedView key={act.id} style={styles.actCard}>
                <View style={styles.actHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.darkText}>
                    {act.title}
                  </ThemedText>
                  <ThemedText style={styles.categoryBadge}>
                    {categories.find(cat => cat.value === act.category)?.icon} {act.category}
                  </ThemedText>
                </View>
                {act.description ? (
                  <ThemedText style={styles.darkText}>
                    {act.description}
                  </ThemedText>
                ) : null}
                <ThemedText style={styles.actMeta}>
                  {act.impact_level} impact • Feeling {act.mood_after}
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No kindness acts recorded for this day
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Add your first act of kindness below
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Add Kindness Act Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(!showAddModal)}
        >
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            {showAddModal ? 'Cancel' : `Add Kindness Act for ${moment(selectedDate).format('MMM Do')}`}
          </ThemedText>
        </TouchableOpacity>

        {/* Add Form (shown when showAddModal is true) */}
        {showAddModal && (
          <ThemedView style={styles.addForm}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              Record Your Kindness
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>What did you do? *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g., Helped elderly neighbor with groceries"
                placeholderTextColor="#999"
                value={newActTitle}
                onChangeText={setNewActTitle}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Details (optional)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us more about what happened..."
                placeholderTextColor="#999"
                value={newActDescription}
                onChangeText={setNewActDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryOption,
                      newActCategory === category.value && styles.categorySelected
                    ]}
                    onPress={() => setNewActCategory(category.value)}
                  >
                    <ThemedText style={styles.categoryIcon}>
                      {category.icon}
                    </ThemedText>
                    <ThemedText style={[
                      styles.categoryLabel,
                      newActCategory === category.value && styles.categoryLabelSelected
                    ]}>
                      {category.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={addKindnessAct}>
              <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
                Save Kindness Act
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

      </ThemedView>
    </ScrollView>
  );
}

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
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateSubtext: {
    opacity: 0.7,
    marginTop: 5,
  },
  actsSection: {
    marginBottom: 20,
  },
  actCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#58CC02',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 12,
    color: '#58CC02',
    backgroundColor: '#F0F8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkText: {
    color: '#000000',
  },
  actMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    opacity: 0.7,
  },
  addButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryOption: {
    width: '30%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categorySelected: {
    borderColor: '#58CC02',
    backgroundColor: '#F0F8E8',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
  },
  categoryLabelSelected: {
    color: '#58CC02',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});