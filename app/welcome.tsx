import ProfileSetupScreen from '@/src/screens/ProfileSetupScreen';
import WelcomeScreen from '@/src/screens/WelcomeScreen';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Welcome() {
  const [showSetup, setShowSetup] = useState(false);

  const handleGetStarted = () => {
    setShowSetup(true);
  };

  const handleSetupComplete = () => {
    router.replace('/(tabs)');
  };

  if (showSetup) {
    return <ProfileSetupScreen onComplete={handleSetupComplete} />;
  }

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}