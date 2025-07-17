import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockColorSchemes } from '../mock';
import { api } from '../services/api';
import { useToast } from '../hooks/use-toast';

const BirthdayWish = () => {
  const { wishId } = useParams();
  const { toast } = useToast();
  
  const [wishData, setWishData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const response = await api.getWish(wishId);
        setWishData(response.data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading your birthday surprise...
        </div>
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

  const colorScheme = mockColorSchemes[wishData.relationship] || mockColorSchemes.friend;

  const nextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === wishData.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? wishData.photos.length - 1 : prev - 1
    );
  };

  const getRelationshipLabel = (relationship) => {
    const labels = {
      friend: 'Friend',
      best_friend: 'Best Friend',
      family_brother: 'Brother',
      family_sister: 'Sister',
      family_parent: 'Parent',
      family_grandparent: 'Grandparent',
      romantic_partner: 'Romantic Partner',
      spouse: 'Spouse'
    };
    return labels[relationship] || 'Friend';
  };

  return (
    <div className={`min-h-screen ${colorScheme.gradient} p-4 relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/15 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/25 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Happy Birthday {wishData.person_name}!
            </h1>
            <Badge 
              className="text-sm px-4 py-2"
              style={{ backgroundColor: colorScheme.primary }}
            >
              From your {getRelationshipLabel(wishData.relationship)}
            </Badge>
          </div>

          {/* Photo Gallery */}
          {wishData.photos && wishData.photos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Our Beautiful Memories 📸
              </h2>
              
              <div className="relative">
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  {wishData.photos[currentPhotoIndex].type === 'image' ? (
                    <img
                      src={`data:image/jpeg;base64,${wishData.photos[currentPhotoIndex].data}`}
                      alt={`Memory ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={`data:video/mp4;base64,${wishData.photos[currentPhotoIndex].data}`}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                    />
                  )}
                </div>
                
                {wishData.photos.length > 1 && (
                  <>
                    <Button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white text-gray-800"
                      size="sm"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white text-gray-800"
                      size="sm"
                    >
                      →
                    </Button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {wishData.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Birthday Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              A Special Message for You 💌
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {wishData.message}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">
              Created with 💖 on {new Date(wishData.created_at).toLocaleDateString()}
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ backgroundColor: colorScheme.primary }}
              >
                🎁 View Again
              </Button>
              
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="px-6 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg border-2"
                style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}
              >
                📄 Print
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating celebrations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            {['🎂', '🎈', '🎊', '🎉', '🎁', '🌟'][i % 6]}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BirthdayWish;