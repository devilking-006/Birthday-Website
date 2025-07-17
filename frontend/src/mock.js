// Mock data for birthday website
export const mockRelationships = [
  { value: 'friend', label: 'Friend' },
  { value: 'best_friend', label: 'Best Friend' },
  { value: 'family_brother', label: 'Brother' },
  { value: 'family_sister', label: 'Sister' },
  { value: 'family_parent', label: 'Parent' },
  { value: 'family_grandparent', label: 'Grandparent' },
  { value: 'romantic_partner', label: 'Romantic Partner' },
  { value: 'spouse', label: 'Spouse' }
];

export const mockColorSchemes = {
  friend: {
    primary: '#3B82F6', // Blue
    secondary: '#10B981', // Green
    accent: '#F59E0B', // Yellow
    gradient: 'bg-gradient-to-br from-blue-500 to-green-500'
  },
  best_friend: {
    primary: '#F59E0B', // Warm Orange
    secondary: '#EF4444', // Red
    accent: '#8B5CF6', // Purple
    gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
  },
  family_brother: {
    primary: '#8B5CF6', // Purple
    secondary: '#06B6D4', // Cyan
    accent: '#10B981', // Green
    gradient: 'bg-gradient-to-br from-purple-500 to-cyan-500'
  },
  family_sister: {
    primary: '#EC4899', // Pink
    secondary: '#F59E0B', // Orange
    accent: '#8B5CF6', // Purple
    gradient: 'bg-gradient-to-br from-pink-500 to-orange-500'
  },
  family_parent: {
    primary: '#A3A3A3', // Warm Gray
    secondary: '#10B981', // Green
    accent: '#DC2626', // Red
    gradient: 'bg-gradient-to-br from-gray-500 to-green-500'
  },
  family_grandparent: {
    primary: '#A78BFA', // Light Purple
    secondary: '#FCA5A5', // Light Red
    accent: '#FDE68A', // Light Yellow
    gradient: 'bg-gradient-to-br from-purple-400 to-red-400'
  },
  romantic_partner: {
    primary: '#DC2626', // Deep Red
    secondary: '#EC4899', // Pink
    accent: '#8B5CF6', // Purple
    gradient: 'bg-gradient-to-br from-red-600 to-pink-600'
  },
  spouse: {
    primary: '#7C3AED', // Purple
    secondary: '#DC2626', // Red
    accent: '#EC4899', // Pink
    gradient: 'bg-gradient-to-br from-purple-600 to-red-600'
  }
};

export const mockNoButtonTexts = [
  "No way!",
  "Not interested",
  "Maybe later",
  "I'm busy",
  "Nope!",
  "Try again",
  "No thanks",
  "Not today",
  "I decline",
  "Absolutely not"
];

export const mockBirthdayMessage = {
  original: "Happy Birthday! 🎉 I hope your special day is filled with joy, laughter, and all your favorite things. You mean so much to me, and I'm grateful to have you in my life. May this new year bring you endless happiness and amazing adventures!",
  personName: "Sarah",
  relationship: "best_friend",
  photos: [
    { id: 1, url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/", type: "image" },
    { id: 2, url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/", type: "image" }
  ],
  createdAt: new Date().toISOString(),
  customNoTexts: ["No way!", "Not happening!", "Try harder!", "Nope!", "Maybe not!"]
};

export const mockWishData = {
  personName: "Sarah",
  relationship: "best_friend",
  photos: [],
  message: "",
  customNoTexts: ["No way!", "Not happening!", "Try harder!", "Nope!", "Maybe not!"],
  createdAt: new Date().toISOString(),
  wishId: "mock-wish-123"
};

// Mock AI message generation
export const generateMockMessage = (personName, relationship) => {
  const messages = {
    friend: `Happy Birthday ${personName}! 🎂 Another year of awesome memories and great times together! You're such an amazing friend, and I'm so grateful for all the laughs and adventures we've shared. Here's to another year of friendship and fun!`,
    best_friend: `Happy Birthday to my absolute best friend ${personName}! 🎉 You're not just a friend, you're family. Through thick and thin, you've been there, and I couldn't imagine life without you. Let's make this year even more epic than the last!`,
    family_brother: `Happy Birthday to the best brother ever, ${personName}! 🎈 Growing up with you has been quite the adventure, and I'm so proud of the person you've become. Here's to more sibling shenanigans and making Mom proud!`,
    family_sister: `Happy Birthday to my wonderful sister ${personName}! 💕 You're not just my sister, you're my built-in best friend. Thank you for all the shared secrets, inside jokes, and unconditional love. Hope your day is as special as you are!`,
    family_parent: `Happy Birthday to the most amazing parent, ${personName}! 🌟 Thank you for all the love, wisdom, and support you've given me throughout the years. You're my hero and my biggest inspiration. Hope your special day is filled with all the joy you deserve!`,
    family_grandparent: `Happy Birthday to the most wonderful grandparent, ${personName}! 🎊 Your stories, wisdom, and endless love have shaped who I am today. Thank you for being such a special part of my life. May your day be filled with all your favorite things!`,
    romantic_partner: `Happy Birthday to my incredible partner ${personName}! 💝 Every day with you feels like a celebration, but today is extra special. You make my world brighter and my heart fuller. Here's to another year of love, laughter, and beautiful memories together!`,
    spouse: `Happy Birthday to my amazing spouse ${personName}! 💖 You're not just my partner, you're my best friend, my confidant, and my greatest love. Thank you for making every day feel like a gift. Here's to growing old together and many more birthdays to celebrate!`
  };
  
  return messages[relationship] || messages.friend;
};