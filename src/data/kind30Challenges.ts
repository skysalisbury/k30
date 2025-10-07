export interface DailyChallenge {
  day: number;
  week: number;
  title: string;
  type: 'launch' | 'inspiration' | 'challenge' | 'reflection' | 'story' | 'info';
  description: string;
  actionPrompt: string;
  hashtag?: string;
}

export const KIND30_CHALLENGES: DailyChallenge[] = [
  // Week 1: Kickoff & Foundations
  {
    day: 1,
    week: 1,
    title: "Let's Begin KIND30",
    type: 'launch',
    description: "Today we start developing a life of kindness together. One small act, every day, for 30 days.",
    actionPrompt: "Are you in? Start with any small act of kindness today.",
    hashtag: "KIND30"
  },
  {
    day: 2,
    week: 1,
    title: "Why Kindness Matters",
    type: 'info',
    description: "Kindness boosts mood, reduces stress, and improves mental health. The science is clear—kindness heals.",
    actionPrompt: "Learn about the benefits of kindness and commit to your journey.",
    hashtag: "KindnessMatters"
  },
  {
    day: 3,
    week: 1,
    title: "Small Acts Add Up",
    type: 'inspiration',
    description: "Grand gestures aren't required. It's the small, consistent acts that develop kindness as a lifestyle.",
    actionPrompt: "Choose one: Smile at someone, Give a compliment, Say thank you, or Help someone.",
    hashtag: "SmallActsBigImpact"
  },
  {
    day: 4,
    week: 1,
    title: "Everyone Can Be Kind",
    type: 'inspiration',
    description: "Kindness belongs to everyone—every age, every stage.",
    actionPrompt: "Where will your kindness show up today?",
    hashtag: "InclusiveKindness"
  },
  {
    day: 5,
    week: 1,
    title: "Pause & Reflect",
    type: 'reflection',
    description: "Reflection deepens the habit.",
    actionPrompt: "Write in your journal: How did your first act of kindness make you feel?",
    hashtag: "KindReflection"
  },
  {
    day: 6,
    week: 1,
    title: "Hold the Door",
    type: 'challenge',
    description: "Today's challenge: Open the door (literally) for kindness.",
    actionPrompt: "Hold the door open for someone today.",
    hashtag: "KindnessChallenge"
  },
  {
    day: 7,
    week: 1,
    title: "Gratitude Check-In",
    type: 'reflection',
    description: "Gratitude fuels kindness.",
    actionPrompt: "Share one thing you're grateful for this week in your journal.",
    hashtag: "GratefulKindness"
  },

  // Week 2: Growing the Habit
  {
    day: 8,
    week: 2,
    title: "Kindness in Busy Moments",
    type: 'inspiration',
    description: "Even on our busiest days, kindness fits.",
    actionPrompt: "Try smiling at a stranger today. Simple. Powerful.",
    hashtag: "KindInChaos"
  },
  {
    day: 9,
    week: 2,
    title: "At Work or School",
    type: 'challenge',
    description: "Kindness belongs at work and school too.",
    actionPrompt: "Compliment a colleague or help a classmate today.",
    hashtag: "KindAtWork"
  },
  {
    day: 10,
    week: 2,
    title: "Family Kindness",
    type: 'challenge',
    description: "Families who practice kindness together build stronger bonds.",
    actionPrompt: "Do something kind for a family member today.",
    hashtag: "KindFamily"
  },
  {
    day: 11,
    week: 2,
    title: "Midpoint Inspiration",
    type: 'inspiration',
    description: "Kindness is more than an act—it's a lifestyle. We're building habits that last a lifetime.",
    actionPrompt: "Keep going—your kindness matters!",
    hashtag: "KindnessLifestyle"
  },
  {
    day: 12,
    week: 2,
    title: "Your Story Matters",
    type: 'story',
    description: "Reflect on your journey so far.",
    actionPrompt: "Journal about your favorite kindness act so far and why it meant something to you.",
    hashtag: "YourKind30"
  },
  {
    day: 13,
    week: 2,
    title: "Giving Back",
    type: 'challenge',
    description: "Kindness grows when we give.",
    actionPrompt: "Donate, volunteer, or lend a helping hand to someone in need today.",
    hashtag: "KindBack"
  },
  {
    day: 14,
    week: 2,
    title: "Choose Your Act",
    type: 'challenge',
    description: "Which kindness act speaks to you today?",
    actionPrompt: "Pick one: Give a smile, offer a compliment, or say thank you to someone.",
    hashtag: "LetsChooseKind"
  },

  // Week 3: Deepening the Practice
  {
    day: 15,
    week: 3,
    title: "Kindness in Hard Times",
    type: 'inspiration',
    description: "Even in tough moments, kindness is possible—and needed most.",
    actionPrompt: "Choose kindness today, especially when it's difficult.",
    hashtag: "KindnessAlways"
  },
  {
    day: 16,
    week: 3,
    title: "Mental Health Focus",
    type: 'info',
    description: "Kindness is medicine for the mind. Acts of kindness reduce anxiety, boost mood, and fight loneliness.",
    actionPrompt: "Do something kind for yourself and someone else today.",
    hashtag: "KindnessAndWellBeing"
  },
  {
    day: 17,
    week: 3,
    title: "Why We're Kind",
    type: 'reflection',
    description: "Take a moment to think about why kindness matters to you.",
    actionPrompt: "Journal about why you believe kindness is important.",
    hashtag: "WhyWeKind"
  },
  {
    day: 18,
    week: 3,
    title: "Write a Thank You",
    type: 'challenge',
    description: "Today's challenge: Express gratitude in writing.",
    actionPrompt: "Write a thank-you note to someone who matters to you.",
    hashtag: "KindnessChallenge"
  },
  {
    day: 19,
    week: 3,
    title: "Your Impact",
    type: 'inspiration',
    description: "Look at how far you've come! Your kindness is creating a ripple effect.",
    actionPrompt: "Keep building the habit—you're making a difference.",
    hashtag: "KIND30Impact"
  },
  {
    day: 20,
    week: 3,
    title: "Kind Together",
    type: 'challenge',
    description: "Kindness multiplies when shared.",
    actionPrompt: "Invite a friend or family member to join you in an act of kindness today.",
    hashtag: "KindTogether"
  },
  {
    day: 21,
    week: 3,
    title: "Reflect and Grow",
    type: 'reflection',
    description: "Reflect on your kindness journey so far.",
    actionPrompt: "Journal: What's challenged you most? What surprised you most?",
    hashtag: "ReflectAndGrow"
  },

  // Week 4: Celebration & Habit Building
  {
    day: 22,
    week: 4,
    title: "Surprise Kindness",
    type: 'challenge',
    description: "Do something unexpected today.",
    actionPrompt: "Surprise someone with an unexpected act of kindness.",
    hashtag: "KindSurprise"
  },
  {
    day: 23,
    week: 4,
    title: "Share Your Story",
    type: 'story',
    description: "Your kindness inspires others!",
    actionPrompt: "Journal about your KIND30 journey and what it has meant to you.",
    hashtag: "KIND30Story"
  },
  {
    day: 24,
    week: 4,
    title: "Beyond 30",
    type: 'inspiration',
    description: "Kindness doesn't end at Day 30. We're building habits for life.",
    actionPrompt: "Commit to continuing your kindness practice beyond this challenge.",
    hashtag: "Beyond30"
  },
  {
    day: 25,
    week: 4,
    title: "Gratitude",
    type: 'reflection',
    description: "Take a moment to appreciate your journey.",
    actionPrompt: "Journal about what you're grateful for in this experience.",
    hashtag: "ThankYouAll"
  },
  {
    day: 26,
    week: 4,
    title: "Invite Someone",
    type: 'challenge',
    description: "Kindness grows when it's shared.",
    actionPrompt: "Invite a friend to start their own kindness journey.",
    hashtag: "KIND30FinalDays"
  },
  {
    day: 27,
    week: 4,
    title: "Kind to Yourself",
    type: 'challenge',
    description: "Don't forget: being kind to yourself matters, too.",
    actionPrompt: "Do something kind for yourself today. Rest. Reflect. Recharge.",
    hashtag: "KindToYou"
  },
  {
    day: 28,
    week: 4,
    title: "Big Wins",
    type: 'inspiration',
    description: "Look what you've accomplished! From workplaces to families, kindness is spreading.",
    actionPrompt: "Celebrate your progress and keep going!",
    hashtag: "KindWins"
  },
  {
    day: 29,
    week: 4,
    title: "Pass It On",
    type: 'challenge',
    description: "The ripple continues.",
    actionPrompt: "Help someone else start their own kindness journey. Share what you've learned.",
    hashtag: "StartNow"
  },
  {
    day: 30,
    week: 4,
    title: "We Did It!",
    type: 'launch',
    description: "30 days of kindness, countless lives touched. But the journey doesn't stop here—let's keep living KIND30 every day.",
    actionPrompt: "Celebrate your accomplishment and commit to making kindness a lifelong habit!",
    hashtag: "KIND30Complete"
  }
];

// Helper function to get challenge for a specific day
export const getChallengeForDay = (day: number): DailyChallenge | null => {
  if (day < 1 || day > 30) return null;
  return KIND30_CHALLENGES.find(challenge => challenge.day === day) || null;
};

// Helper function to get current week
export const getWeekForDay = (day: number): number => {
  return Math.ceil(day / 7);
};