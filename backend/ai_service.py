import os
import openai
from typing import Dict

class AIMessageGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
    def generate_birthday_message(self, person_name: str, relationship: str) -> str:
        """Generate a personalized birthday message using OpenAI"""
        
        relationship_prompts = {
            'friend': f"Write a warm, fun birthday message for my friend {person_name}. Make it cheerful and celebratory, focusing on friendship and good times together.",
            'best_friend': f"Write a heartfelt birthday message for my best friend {person_name}. Make it emotional and sincere, emphasizing our deep friendship and shared memories.",
            'family_brother': f"Write a loving birthday message for my brother {person_name}. Include sibling bond, shared childhood memories, and family love.",
            'family_sister': f"Write a sweet birthday message for my sister {person_name}. Include sisterly love, shared experiences, and family connection.",
            'family_parent': f"Write a respectful and loving birthday message for my parent {person_name}. Express gratitude, appreciation, and deep family love.",
            'family_grandparent': f"Write a tender birthday message for my grandparent {person_name}. Include wisdom, family legacy, and special generational love.",
            'romantic_partner': f"Write a romantic birthday message for my partner {person_name}. Make it loving, intimate, and celebratory of our relationship.",
            'spouse': f"Write a deeply loving birthday message for my spouse {person_name}. Include marriage commitment, shared life journey, and eternal love."
        }
        
        prompt = relationship_prompts.get(relationship, relationship_prompts['friend'])
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert at writing heartfelt, personalized birthday messages. Create messages that are warm, genuine, and appropriately tailored to the relationship. Keep messages between 100-200 words, include emojis, and make them feel personal and special."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating message: {e}")
            # Fallback to template messages
            return self._get_fallback_message(person_name, relationship)
    
    def _get_fallback_message(self, person_name: str, relationship: str) -> str:
        """Fallback messages if OpenAI fails"""
        fallback_messages = {
            'friend': f"Happy Birthday {person_name}! 🎂 Another year of awesome memories and great times together! You're such an amazing friend, and I'm so grateful for all the laughs and adventures we've shared. Here's to another year of friendship and fun! 🎉",
            'best_friend': f"Happy Birthday to my absolute best friend {person_name}! 🎉 You're not just a friend, you're family. Through thick and thin, you've been there, and I couldn't imagine life without you. Let's make this year even more epic than the last! 💫",
            'family_brother': f"Happy Birthday to the best brother ever, {person_name}! 🎈 Growing up with you has been quite the adventure, and I'm so proud of the person you've become. Here's to more sibling shenanigans and making the family proud! 🎊",
            'family_sister': f"Happy Birthday to my wonderful sister {person_name}! 💕 You're not just my sister, you're my built-in best friend. Thank you for all the shared secrets, inside jokes, and unconditional love. Hope your day is as special as you are! ✨",
            'family_parent': f"Happy Birthday to the most amazing parent, {person_name}! 🌟 Thank you for all the love, wisdom, and support you've given me throughout the years. You're my hero and my biggest inspiration. Hope your special day is filled with all the joy you deserve! 🎁",
            'family_grandparent': f"Happy Birthday to the most wonderful grandparent, {person_name}! 🎊 Your stories, wisdom, and endless love have shaped who I am today. Thank you for being such a special part of my life. May your day be filled with all your favorite things! 🌸",
            'romantic_partner': f"Happy Birthday to my incredible partner {person_name}! 💝 Every day with you feels like a celebration, but today is extra special. You make my world brighter and my heart fuller. Here's to another year of love, laughter, and beautiful memories together! 💖",
            'spouse': f"Happy Birthday to my amazing spouse {person_name}! 💖 You're not just my partner, you're my best friend, my confidant, and my greatest love. Thank you for making every day feel like a gift. Here's to growing old together and many more birthdays to celebrate! 🥰"
        }
        
        return fallback_messages.get(relationship, fallback_messages['friend'])