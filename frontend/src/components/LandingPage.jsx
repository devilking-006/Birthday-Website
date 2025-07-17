import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { mockColorSchemes } from '../mock';
import { api } from '../services/api';
import { useToast } from '../hooks/use-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const { wishId } = useParams();
  const { toast } = useToast();
  
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonText, setNoButtonText] = useState('No');
  const [noClickCount, setNoClickCount] = useState(0);
  const [wishData, setWishData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const response = await api.getWish(wishId);
        setWishData(response.data);
        setNoButtonText(response.data.custom_no_texts?.[0] || 'No');
      } catch (error) {
        console.error('Error fetching wish:', error);
        toast({
          title: "Error loading wish",
          description: "The birthday wish could not be loaded",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (wishId) {
      fetchWish();
    }
  }, [wishId, toast]);

  const colorScheme = wishData ? mockColorSchemes[wishData.relationship] : mockColorSchemes.friend;

  const handleNoClick = () => {
    const customTexts = wishData?.custom_no_texts || ['No way!', 'Not happening!', 'Try harder!', 'Nope!', 'Maybe not!'];
    
    // Change button text
    const newText = customTexts[noClickCount % customTexts.length];
    setNoButtonText(newText);
    setNoClickCount(prev => prev + 1);

    // Move button to random position
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 100;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    navigate(`/wish/${wishId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl font-bold animate-pulse">Loading your special gift...</div>
      </div>
    );
  }

  if (!wishData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Wish not found
          </h2>
          <p className="text-gray-600">
            The birthday wish you're looking for doesn't exist or has expired.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${colorScheme.gradient} p-4 relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/15 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/25 rounded-full animate-pulse delay-500"></div>
      </div>

      <Card className="max-w-md w-full p-8 text-center bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10">
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Hey {wishData?.person_name || 'Friend'}!
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            I have prepared something very special for your birthday...
          </p>
          <div className="text-2xl font-semibold text-gray-800 mb-8">
            Will you accept my gift?
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleYesClick}
            className="w-full py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            style={{ backgroundColor: colorScheme.primary }}
          >
            ✨ Yes, I'd love to! ✨
          </Button>
          
          <Button
            onClick={handleNoClick}
            variant="outline"
            className="w-full py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2"
            style={{ 
              borderColor: colorScheme.primary,
              color: colorScheme.primary,
              position: noClickCount > 0 ? 'fixed' : 'static',
              left: noClickCount > 0 ? `${noButtonPosition.x}px` : 'auto',
              top: noClickCount > 0 ? `${noButtonPosition.y}px` : 'auto',
              zIndex: noClickCount > 0 ? 50 : 'auto',
              transform: noClickCount > 0 ? 'translate(-50%, -50%)' : 'none'
            }}
          >
            {noButtonText}
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          🎂 Someone special is thinking of you today! 🎂
        </div>
      </Card>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-red-300 text-2xl opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            💖
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;