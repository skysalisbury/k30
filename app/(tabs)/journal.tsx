import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { borderRadius, colors, spacing, typography } from '@/src/styles/globalStyles';
import { JournalEntry, KindnessAct, User } from '@/src/utils/dataModels';
import {
  deleteJournalEntry,
  getJournalEntries,
  getKindnessActs,
  getUser,
  saveJournalEntry
} from '@/src/utils/storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedKindnessAct, setSelectedKindnessAct] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState<'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral'>('neutral');
  const [moodAfter, setMoodAfter] = useState<'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral'>('happy');

  const moods = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'grateful', label: 'Grateful', icon: '🙏' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'sad', label: 'Sad', icon: '😢' },
    { value: 'angry', label: 'Angry', icon: '😠' },
  ] as const;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entries, acts, userData] = await Promise.all([
        getJournalEntries(),
        getKindnessActs(),
        getUser()
      ]);
      setJournalEntries(entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setKindnessActs(acts);
      setUser(userData);
    } catch (error) {
      console.error('Error loading journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewEntry = () => {
    setEditingEntry(null);
    setNewEntryTitle('');
    setNewEntryContent('');
    setSelectedKindnessAct(null);
    setMoodBefore('neutral');
    setMoodAfter('happy');
    setShowAddForm(true);
  };

  const startEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
    setSelectedKindnessAct(entry.kindness_act_id ?? null);
    setMoodBefore(entry.mood_before ?? 'neutral');
    setMoodAfter(entry.mood_after ?? 'happy');
    setShowAddForm(true);
  };

  const saveEntry = async () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim() || !user) {
      Alert.alert('Missing Information', 'Please fill in both title and content');
      return;
    }

    try {
      const entryData: JournalEntry = {
        id: editingEntry?.id || Date.now().toString(),
        user_id: user.id,
        title: newEntryTitle.trim(),
        content: newEntryContent.trim(),
        kindness_act_id: selectedKindnessAct,
        mood_before: moodBefore,
        mood_after: moodAfter,
        created_at: editingEntry?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await saveJournalEntry(entryData);
      await loadData();

      setNewEntryTitle('');
      setNewEntryContent('');
      setSelectedKindnessAct(null);
      setMoodBefore('neutral');
      setMoodAfter('happy');
      setShowAddForm(false);
      setEditingEntry(null);

      console.log(editingEntry ? 'Journal entry updated' : 'Journal entry saved');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const confirmDeleteEntry = (entry: JournalEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(entry.id) }
      ]
    );
  };

  const deleteEntry = async (entryId: string) => {
    try {
      await deleteJournalEntry(entryId);
      await loadData();
      console.log('Journal entry deleted');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      Alert.alert('Error', 'Failed to delete journal entry');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingEntry(null);
    setNewEntryTitle('');
    setNewEntryContent('');
    setSelectedKindnessAct(null);
    setMoodBefore('neutral');
    setMoodAfter('happy');
  };

  const getLinkedKindnessAct = (actId: string | null | undefined) => {
    if (!actId) return null;
    return kindnessActs.find(act => act.id === actId);
  };

  const getMoodIcon = (mood: string) => {
    return moods.find(m => m.value === mood)?.icon || '😐';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.centerContent}>
            <ThemedText>Loading journal...</ThemedText>
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

            {/* Header */}
            <View style={styles.headerWithLogos}>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
              <ThemedView style={styles.header}>
                <ThemedText type="title">My Journal</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Reflect on your kindness journey
                </ThemedText>
              </ThemedView>
              <Image
                source={require('@/assets/images/C91E96D5-6719-4F09-8523-2BAB1D53B09FKind_Sun.jpeg')}
                style={styles.sunLogo}
                resizeMode="contain"
              />
            </View>

            {/* Add Entry Button */}
            <TouchableOpacity style={styles.addButton} onPress={startNewEntry}>
              <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
                ✏️ Write New Entry
              </ThemedText>
            </TouchableOpacity>

            {/* Add/Edit Form */}
            {showAddForm && (
              <ThemedView style={styles.addForm}>
                <ThemedText type="subtitle" style={styles.formTitle}>
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Title *</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="What's on your mind today?"
                    placeholderTextColor={colors.text.light}
                    value={newEntryTitle}
                    onChangeText={setNewEntryTitle}
                    maxLength={100}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Content *</ThemedText>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share your thoughts, reflections, or experiences..."
                    placeholderTextColor={colors.text.light}
                    value={newEntryContent}
                    onChangeText={setNewEntryContent}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Link to Kindness Act (optional)</ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kindnessActsScroll}>
                    <TouchableOpacity
                      style={[
                        styles.kindnessActOption,
                        !selectedKindnessAct && styles.kindnessActSelected
                      ]}
                      onPress={() => setSelectedKindnessAct(null)}
                    >
                      <ThemedText style={styles.kindnessActText}>None</ThemedText>
                    </TouchableOpacity>
                    {kindnessActs
                      .filter(act => user && act.user_id === user.id)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 10)
                      .map((act) => (
                        <TouchableOpacity
                          key={act.id}
                          style={[
                            styles.kindnessActOption,
                            selectedKindnessAct === act.id && styles.kindnessActSelected
                          ]}
                          onPress={() => setSelectedKindnessAct(act.id)}
                        >
                          <ThemedText style={styles.kindnessActText} numberOfLines={2}>
                            {act.title}
                          </ThemedText>
                          <ThemedText style={styles.kindnessActDate}>
                            {moment(act.date).format('MMM D')}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>

                <View style={styles.moodsRow}>
                  <View style={styles.moodGroup}>
                    <ThemedText style={styles.label}>Mood Before</ThemedText>
                    <View style={styles.moodGrid}>
                      {moods.map((mood) => (
                        <TouchableOpacity
                          key={`before-${mood.value}`}
                          style={[
                            styles.moodOption,
                            moodBefore === mood.value && styles.moodSelected
                          ]}
                          onPress={() => setMoodBefore(mood.value)}
                        >
                          <ThemedText style={styles.moodIcon}>{mood.icon}</ThemedText>
                          <ThemedText style={styles.moodLabel}>{mood.label}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.moodGroup}>
                    <ThemedText style={styles.label}>Mood After</ThemedText>
                    <View style={styles.moodGrid}>
                      {moods.map((mood) => (
                        <TouchableOpacity
                          key={`after-${mood.value}`}
                          style={[
                            styles.moodOption,
                            moodAfter === mood.value && styles.moodSelected
                          ]}
                          onPress={() => setMoodAfter(mood.value)}
                        >
                          <ThemedText style={styles.moodIcon}>{mood.icon}</ThemedText>
                          <ThemedText style={styles.moodLabel}>{mood.label}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelForm}>
                    <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                    <ThemedText style={styles.saveButtonText}>
                      {editingEntry ? 'Update' : 'Save'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            )}

            {/* Journal Entries */}
            <ThemedView style={styles.entriesSection}>
              {journalEntries.length > 0 ? (
                journalEntries.map((entry) => {
                  const linkedAct = getLinkedKindnessAct(entry.kindness_act_id);
                  return (
                    <ThemedView key={entry.id} style={styles.entryCard}>
                      <View style={styles.entryHeader}>
                        <View style={styles.entryTitleRow}>
                          <ThemedText type="defaultSemiBold" style={styles.entryTitle}>
                            {entry.title}
                          </ThemedText>
                          <View style={styles.entryActions}>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => startEditEntry(entry)}
                            >
                              <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.deleteButton]}
                              onPress={() => confirmDeleteEntry(entry)}
                            >
                              <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ThemedText style={styles.entryDate}>
                          {moment(entry.created_at).format('MMMM Do, YYYY • h:mm A')}
                        </ThemedText>
                      </View>

                      <ThemedText style={styles.entryContent}>{entry.content}</ThemedText>

                      {linkedAct && (
                        <ThemedView style={styles.linkedActCard}>
                          <ThemedText style={styles.linkedActLabel}>
                            🔗 Linked to Kindness Act
                          </ThemedText>
                          <ThemedText style={styles.linkedActTitle}>
                            {linkedAct.title}
                          </ThemedText>
                        </ThemedView>
                      )}

                      <View style={styles.moodIndicators}>
                        <View style={styles.moodIndicator}>
                          <ThemedText style={styles.moodIndicatorIcon}>
                            {getMoodIcon(entry.mood_before || 'neutral')}
                          </ThemedText>
                          <ThemedText style={styles.moodIndicatorLabel}>Before</ThemedText>
                        </View>
                        <ThemedText style={styles.moodArrow}>→</ThemedText>
                        <View style={styles.moodIndicator}>
                          <ThemedText style={styles.moodIndicatorIcon}>
                            {getMoodIcon(entry.mood_after || 'happy')}
                          </ThemedText>
                          <ThemedText style={styles.moodIndicatorLabel}>After</ThemedText>
                        </View>
                      </View>
                    </ThemedView>
                  );
                })
              ) : (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={styles.emptyIcon}>📔</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.emptyText}>
                    No journal entries yet
                  </ThemedText>
                  <ThemedText style={styles.emptySubtext}>
                    Start writing to reflect on your kindness journey
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>

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

  headerWithLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: 15,
  },
  sunLogo: {
    width: 50,
    height: 50,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subtitle: {
    opacity: 0.9,
    marginTop: spacing.xs,
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
    marginBottom: spacing.md,
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
    height: 120,
    textAlignVertical: 'top',
  },

  kindnessActsScroll: {
    marginTop: spacing.xs,
  },
  kindnessActOption: {
    backgroundColor: '#f2f2f2',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#d4dcc4',
  },
  kindnessActSelected: {
    borderColor: '#40ae49',
    backgroundColor: '#88c78d',
  },
  kindnessActText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#000000',
  },
  kindnessActDate: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
    color: '#000000',
  },

  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  moodGroup: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '31%',
    backgroundColor: '#f2f2f2',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#d4dcc4',
    minHeight: 80,
    justifyContent: 'center',
  },
  moodSelected: {
    borderColor: '#40ae49',
    backgroundColor: '#88c78d',
  },
  moodIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '500',
  },

  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    color: '#000000',
    fontWeight: typography.weights.semibold,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#40ae49',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: typography.weights.semibold,
  },

  entriesSection: {
    marginTop: spacing.md,
    backgroundColor: 'transparent',
  },
  entryCard: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  entryHeader: {
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  entryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  entryTitle: {
    flex: 1,
    color: '#000000',
    fontSize: typography.sizes.lg,
  },
  entryActions: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  actionButton: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  actionButtonText: {
    color: '#40ae49',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: colors.ui.error,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  entryDate: {
    fontSize: typography.sizes.xs,
    opacity: 0.7,
    color: '#000000',
  },
  entryContent: {
    fontSize: typography.sizes.md,
    lineHeight: 24,
    color: '#000000',
    marginBottom: spacing.md,
  },

  linkedActCard: {
    backgroundColor: '#fcebb4',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  linkedActLabel: {
    fontSize: typography.sizes.xs,
    color: '#40ae49',
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  linkedActTitle: {
    fontSize: typography.sizes.sm,
    color: '#000000',
  },

  moodIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  moodIndicator: {
    alignItems: 'center',
  },
  moodIndicatorIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  moodIndicatorLabel: {
    fontSize: 10,
    opacity: 0.7,
    color: '#000000',
  },
  moodArrow: {
    marginHorizontal: spacing.md,
    fontSize: 16,
    opacity: 0.5,
    color: '#000000',
  },

  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'transparent',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    lineHeight: 56,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    color: '#ffffff',
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
    color: '#ffffff',
  },
});