import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { borderRadius, colors, spacing, typography } from '@/src/styles/globalStyles';
import { KindnessAct, User } from '@/src/utils/dataModels';
import {
  getChallengeProgress,
  getKindnessActs,
  getTodaysKindnessActs,
  getUser,
  getUserStreak,
  markChallengeDay,
  saveChallengeProgress,
  saveKindnessAct,
  saveUserStreak
} from '@/src/utils/storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDateActs, setSelectedDateActs] = useState<KindnessAct[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    kindnessActs.forEach(act => {
      marked[act.date] = {
        marked: true,
        dotColor: '#40ae49',
        selectedColor: '#40ae49',
      };
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#febe10',
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

      const todayActs = await getTodaysKindnessActs();
      const isFirstActToday = todayActs.length === 1;

      if (selectedDate === moment().format('YYYY-MM-DD') && isFirstActToday) {
        const streak = await getUserStreak();
        if (streak) {
          const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
          const wasActiveYesterday = streak.last_activity_date === yesterday;
          const isFirstEver = !streak.last_activity_date;

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

        const challenge = await getChallengeProgress();
        if (challenge && challenge.is_active) {
          const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
          const lastCompletedDay = challenge.completed_days.length > 0
            ? Math.max(...challenge.completed_days)
            : 0;

          const allActs = await getKindnessActs();
          const yesterdayActs = allActs.filter(act => act.date === yesterday);
          const hasYesterdayAct = yesterdayActs.length > 0;

          const isConsecutive = lastCompletedDay === 0 || hasYesterdayAct;

          if (isConsecutive) {
            const nextDay = lastCompletedDay + 1;
            if (nextDay <= 30 && !challenge.completed_days.includes(nextDay)) {
              await markChallengeDay(nextDay);
              console.log(`Challenge day ${nextDay} marked complete (consecutive)`);
            }
          } else {
            console.log('Missed a day - resetting challenge');
            challenge.completed_days = [1];
            challenge.current_day = 1;
            challenge.last_updated = new Date().toISOString();
            await saveChallengeProgress(challenge);
            console.log('Challenge reset to day 1 due to gap');
          }
        }
      }

      await loadData();

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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.centerContent}>
            <ThemedText>Loading calendar...</ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>

            {/* Month Header with Sun Logos */}
            <View style={styles.monthHeaderWithLogos}>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
              <ThemedText type="title" style={styles.monthTitle}>
                {moment(selectedDate).format('MMMM YYYY')}
              </ThemedText>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
            </View>

            {/* Calendar */}
            <ThemedView style={styles.calendarContainer}>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={getMarkedDates()}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#666666',
                  selectedDayBackgroundColor: '#febe10',
                  selectedDayTextColor: '#000000',
                  todayTextColor: '#40ae49',
                  dayTextColor: '#000000',
                  textDisabledColor: '#d4dcc4',
                  dotColor: '#40ae49',
                  selectedDotColor: '#000000',
                  arrowColor: '#40ae49',
                  disabledArrowColor: '#d4dcc4',
                  monthTextColor: '#000000',
                  indicatorColor: '#40ae49',
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
                    Tap the button below to add one!
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
                    placeholderTextColor={colors.text.light}
                    value={newActTitle}
                    onChangeText={setNewActTitle}
                    multiline
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Details (optional)</ThemedText>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell us more about what happened..."
                    placeholderTextColor={colors.text.light}
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
      </KeyboardAvoidingView>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  monthHeaderWithLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: 15,
  },
  sunLogo: {
    width: 40,
    height: 40,
  },
  monthTitle: {
    color: '#ffffff',
  },

  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  dateInfoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  dateSubtext: {
    opacity: 0.9,
    marginTop: spacing.xs,
    color: '#ffffff',
  },

  actsSection: {
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  actCard: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#febe10',
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
    marginBottom: spacing.sm,
    backgroundColor: 'transparent',
  },
  categoryBadge: {
    fontSize: typography.sizes.xs,
    color: '#40ae49',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  darkText: {
    color: '#000000',
  },
  actMeta: {
    fontSize: typography.sizes.xs,
    opacity: 0.7,
    marginTop: spacing.sm,
    color: '#000000',
  },

  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: typography.sizes.md,
    marginBottom: spacing.sm,
    color: '#ffffff',
  },
  emptySubtext: {
    opacity: 0.9,
    color: '#ffffff',
  },

  addButton: {
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
  addButtonText: {
    color: '#000000',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },

  addForm: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#40ae49',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    color: '#000000',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: '#d4dcc4',
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
    backgroundColor: '#f2f2f2',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#d4dcc4',
  },
  categorySelected: {
    borderColor: '#40ae49',
    backgroundColor: '#88c78d',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    color: '#000000',
  },
  categoryLabelSelected: {
    color: '#ffffff',
    fontWeight: typography.weights.semibold,
  },

  saveButton: {
    backgroundColor: '#40ae49',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});