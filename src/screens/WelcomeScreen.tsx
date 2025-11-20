import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/Kind_30_Logo_Horizontal.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContent}>
            <ThemedText type="title" style={styles.title}>
              Welcome to Kind30
            </ThemedText>

            <ThemedText type="subtitle" style={styles.subtitle}>
              Spread kindness, one act at a time
            </ThemedText>

            <ThemedText style={styles.description}>
              Track your daily acts of kindness, build meaningful streaks, and make a positive impact in your community.
            </ThemedText>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <ThemedText style={styles.featureIcon}>📅</ThemedText>
              <ThemedText style={styles.featureText}>Track daily kindness acts</ThemedText>
            </View>

            <View style={styles.feature}>
              <ThemedText style={styles.featureIcon}>🔥</ThemedText>
              <ThemedText style={styles.featureText}>Build meaningful streaks</ThemedText>
            </View>

            <View style={styles.feature}>
              <ThemedText style={styles.featureIcon}>📝</ThemedText>
              <ThemedText style={styles.featureText}>Journal your experiences</ThemedText>
            </View>

            <View style={styles.feature}>
              <ThemedText style={styles.featureIcon}>🔔</ThemedText>
              <ThemedText style={styles.featureText}>Gentle daily reminders</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Get Started
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
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
    justifyContent: 'center',
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  logo: {
    width: '80%',
    height: 100,
    marginBottom: 20,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#ffffff',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
    color: '#ffffff',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
    color: '#ffffff',
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: 40,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  getStartedButton: {
    backgroundColor: '#febe10',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});