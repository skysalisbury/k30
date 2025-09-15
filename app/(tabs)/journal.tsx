import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function JournalScreen() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Form state
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedKindnessAct, setSelectedKindnessAct] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState<'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral'>('neutral');
  const [moodAfter, setMoodAfter] = useState<'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'grateful' | 'neutral'>('happy');

  const moods = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'grateful', label: 'Grateful', icon: '🙏' },
    { value: 'calm', label: 'Calm', icon: '😌' },
    { value: 'excited', label: 'Excited', icon: '🤗' },
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
    // Handle the optional kindness_act_id properly
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

      // Reset form
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
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading journal...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>

        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">My Journal</ThemedText>
          <ThemedText style={styles.subtitle}>
            Reflect on your kindness journey
          </ThemedText>
        </ThemedView>

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
                {kindnessActs.slice(0, 10).map((act) => (
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
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}

        {/* Journal Entries List */}
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

                  <ThemedText style={styles.entryContent} numberOfLines={3}>
                    {entry.content}
                  </ThemedText>

                  {linkedAct && (
                    <ThemedView style={styles.linkedActCard}>
                      <ThemedText style={styles.linkedActLabel}>💝 Linked to:</ThemedText>
                      <ThemedText style={styles.linkedActTitle}>{linkedAct.title}</ThemedText>
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
              <ThemedText style={styles.emptyText}>No journal entries yet</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Start writing to track your kindness journey and reflect on your experiences
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

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
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
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
    marginBottom: 20,
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
    height: 120,
    textAlignVertical: 'top',
  },
  kindnessActsScroll: {
    marginTop: 5,
  },
  kindnessActOption: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  kindnessActSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF0F0',
  },
  kindnessActText: {
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  moodGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '23%',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  moodSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF0F0',
  },
  moodIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  entriesSection: {
    marginTop: 20,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    marginBottom: 15,
  },
  entryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  entryTitle: {
    flex: 1,
    color: '#000000',
    fontSize: 18,
  },
  entryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
  },
  entryDate: {
    fontSize: 12,
    opacity: 0.7,
    color: '#000000',
  },
  entryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 15,
  },
  linkedActCard: {
    backgroundColor: '#F0F8E8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  linkedActLabel: {
    fontSize: 12,
    color: '#58CC02',
    fontWeight: '600',
    marginBottom: 4,
  },
  linkedActTitle: {
    fontSize: 14,
    color: '#000000',
  },
  moodIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodIndicator: {
    alignItems: 'center',
  },
  moodIndicatorIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodIndicatorLabel: {
    fontSize: 10,
    opacity: 0.7,
    color: '#000000',
  },
  moodArrow: {
    marginHorizontal: 20,
    fontSize: 16,
    opacity: 0.5,
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});