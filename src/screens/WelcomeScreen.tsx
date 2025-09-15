import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>

        {/* App Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <ThemedText style={styles.logoText}>💝</ThemedText>
          </View>
        </View>

        {/* Welcome Content */}
        <View style={styles.textContent}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Kindness Reminder
          </ThemedText>

          <ThemedText type="subtitle" style={styles.subtitle}>
            Spread kindness, one act at a time
          </ThemedText>

          <ThemedText style={styles.description}>
            Track your daily acts of kindness, build meaningful streaks, and make a positive impact in your community.
          </ThemedText>
        </View>

        {/* Features List */}
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

        {/* Get Started Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Get Started
          </ThemedText>
        </TouchableOpacity>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 50,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
  },
  getStartedButton: {
    backgroundColor: '#58CC02',
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
    color: 'white',
    fontSize: 18,
  },
});