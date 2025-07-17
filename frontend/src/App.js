import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/toaster";
import LandingPage from "./components/LandingPage";
import CreateWish from "./components/CreateWish";
import BirthdayWish from "./components/BirthdayWish";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          🎂 Birthday Wishes 🎂
        </h1>
        <p className="text-2xl text-white/90 mb-8 drop-shadow-md">
          Create magical birthday surprises for your loved ones
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/create"
            className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
          >
            ✨ Create Birthday Wish
          </a>
          
          <a
            href="/gift/mock-wish-123"
            className="px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-full shadow-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            🎁 View Demo Wish
          </a>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-white/80 text-lg mb-4">
          Upload photos • Generate AI messages • Share the magic
        </div>
        <div className="flex justify-center space-x-8 text-white/70">
          <span>📸 Photos & Videos</span>
          <span>🤖 AI Messages</span>
          <span>💝 Interactive Experience</span>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {['🎈', '🎊', '🎉', '🎁', '🌟', '💖'][i % 6]}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateWish />} />
          <Route path="/gift/:wishId" element={<LandingPage />} />
          <Route path="/wish/:wishId" element={<BirthdayWish />} />
          <Route path="/preview/:wishId" element={<BirthdayWish />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;