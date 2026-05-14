import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import deviceFarmLogo from '../../assets/device-farm-logo.png';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0); // 0: Login, 1: Dashboard, 2: Details
  const [showClickEffect, setShowClickEffect] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  useEffect(() => {
    const screenCount = 3; // Total number of screens
    const intervalTime = 3000; // Time each screen is visible (in ms)
    let clickTimeoutId: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      setActiveScreen((prevScreen) => {
        const nextScreen = (prevScreen + 1) % screenCount;

        // Schedule click effect for Screen 1 (Login)
        if (nextScreen === 0) {
          if (clickTimeoutId) clearTimeout(clickTimeoutId); // Clear previous timeouts
          clickTimeoutId = setTimeout(() => {
            setShowClickEffect(true);
            // Automatically remove the effect after a short duration
            clickTimeoutId = setTimeout(() => {
              setShowClickEffect(false);
            }, 300); // Duration of the click effect
          }, 1000); // Delay before showing click effect after screen appears
        } else {
          // Ensure effect is off for other screens
          if (clickTimeoutId) clearTimeout(clickTimeoutId);
          setShowClickEffect(false);
        }

        return nextScreen;
      });
    }, intervalTime);

    // Initial trigger check in case component mounts on screen 0
    if (activeScreen === 0) {
      clickTimeoutId = setTimeout(() => {
        setShowClickEffect(true);
        clickTimeoutId = setTimeout(() => {
          setShowClickEffect(false);
        }, 300);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      if (clickTimeoutId) clearTimeout(clickTimeoutId); // Cleanup timeouts on unmount
    };
  }, []); // Rerun effect only on mount/unmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      navigate('/device-farm/#/');
    } catch (err) {
      // Error is handled by the login function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0F1C]">
      {/* Left Panel - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#02040A] to-[#0A0F1C]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Base grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5"></div>

          {/* Modern gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/3 via-transparent to-purple-700/3 opacity-10"></div>

          {/* Large gradient circles with modern positioning */}
          <div className="absolute top-0 left-0 w-[1200px] h-[1200px] bg-blue-700/3 rounded-full filter blur-[150px] transform -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-30"></div>
          <div
            className="absolute bottom-0 right-0 w-[1200px] h-[1200px] bg-purple-700/3 rounded-full filter blur-[150px] transform translate-x-1/2 translate-y-1/2 animate-pulse opacity-30"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-cyan-700/3 rounded-full filter blur-[150px] transform -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-30"
            style={{ animationDelay: '1s' }}
          ></div>

          {/* Modern geometric elements */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl border border-blue-400/10 backdrop-blur-sm transform rotate-12"></div>
          <div className="absolute top-40 right-40 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-3xl border border-purple-400/10 backdrop-blur-sm transform -rotate-12"></div>
          <div className="absolute bottom-40 left-40 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-3xl border border-cyan-400/10 backdrop-blur-sm transform rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-400/10 backdrop-blur-sm transform -rotate-45"></div>

          {/* Animated floating elements */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-400/20 backdrop-blur-sm animate-float transform rotate-12"></div>
          <div
            className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-400/20 backdrop-blur-sm animate-float transform -rotate-12"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-2xl border border-cyan-400/20 backdrop-blur-sm animate-float transform rotate-45"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-1/2 right-1/2 w-28 h-28 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl border border-green-400/20 backdrop-blur-sm animate-float transform -rotate-45"
            style={{ animationDelay: '1.5s' }}
          ></div>

          {/* Subtle accent lines */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0A0F1C]/30 to-[#02040A]/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
          <div className="w-full max-w-md text-center flex flex-col items-center">
            {/* Logo and Title */}
            <div className="mb-40 transform hover:scale-105 transition-transform duration-500">
              <img src={deviceFarmLogo} alt="Device Farm Logo" className="w-24 h-24 mx-auto" />
            </div>
            {/* Combined Container for Phone and Orbit */}
            <div className="relative w-[320px] h-[320px] mb-8">
              {/* Floating Icons Container */}
              <div className="absolute inset-0">
                {/* Outer Circle Icons */}
                <div className="absolute inset-0 animate-spin-slow">
                  {/* iOS Icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[30px]">
                    <div
                      className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-full border border-blue-500/20 
                                  flex items-center justify-center transform hover:scale-110 transition-all duration-300
                                  hover:border-blue-500/40 hover:bg-[#1a1f2c] group shadow-lg"
                    >
                      <svg
                        className="w-7 h-7 text-blue-400/70 group-hover:text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.57-.84 1.51.07 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.31 2.46-2.01 4.42-3.74 4.25z" />
                      </svg>
                    </div>
                  </div>

                  {/* Android Icon */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30px]">
                    <div
                      className="w-14 h-14 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-full border border-green-500/20 
                                  flex items-center justify-center transform hover:scale-110 transition-all duration-300
                                  hover:border-green-500/40 hover:bg-[#1a1f2c] group shadow-lg"
                    >
                      <svg
                        className="w-7 h-7 text-green-400/70 group-hover:text-green-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.88a.637.637 0 0 0-.88.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.62a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 20h22a10.81 10.81 0 0 0-5.4-10.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Inner Circle Icons */}
                <div className="absolute inset-0 animate-spin-slow-reverse">
                  {/* JavaScript Icon */}
                  <div className="absolute left-0 top-1/2 -translate-x-[150px] -translate-y-1/2">
                    <div
                      className="w-14 h-14 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm rounded-full border border-yellow-500/20 
                                  flex items-center justify-center transform hover:scale-110 transition-all duration-300
                                  hover:border-yellow-500/40 hover:bg-[#1a1f2c] group shadow-lg"
                    >
                      <svg
                        className="w-7 h-7 text-yellow-400/70 group-hover:text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.003-.056z" />
                      </svg>
                    </div>
                  </div>

                  {/* Java Icon */}
                  <div className="absolute right-0 top-1/2 translate-x-[150px] -translate-y-1/2">
                    <div
                      className="w-14 h-14 bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-full border border-red-500/20 
                                  flex items-center justify-center transform hover:scale-110 transition-all duration-300
                                  hover:border-red-500/40 hover:bg-[#1a1f2c] group shadow-lg"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-6 h-6 text-red-400/70 group-hover:text-red-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321-.646-4.258-2.013-7.024-1.426-6.943.163M8.276 15.933s-1.028.761.542.924c2.032.169 3.636.227 5.941-.412 0 0 .384.389.987-.693-5.679-1.813-7.502-1.142-7.47.201M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.846-.293.75-.89 1.254-.825.586.195.188.358.188.358-.96.671-6.955.44-5.304-1.10 1.052-.978 17.493-4.4 17.278-3.307M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.145 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.872 3.776-.872M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 4.086 2.981-.928 4.562 0-.001.07.062.676-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.853-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.664 5.19-7.644M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572.611-2.724-.145-3.276-.202-4.938.168-1.989.443-.945.828.368.907.401.02.75.025 1.217.02.467-.005 1.191-.088 1.191-.088s-1.205.171-3.113.171c-1.908 0-4.777-.205-4.777-.205s1.364.495 3.514.654" />
                        </svg>
                        <span className="text-red-400/70 group-hover:text-red-400 text-xs font-bold mt-1">
                          JAVA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbit Paths */}
                <div className="absolute inset-0">
                  <div className="absolute inset-[-126px] rounded-full border border-gray-700/20"></div>
                  <div className="absolute inset-[-12px] rounded-full border border-gray-700/20"></div>
                </div>
              </div>

              {/* Phone Frame - Positioned over the orbit */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] shadow-2xl border border-gray-700/50">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-full"></div>

                  {/* Power Button */}
                  <div className="absolute -right-1 top-16 w-1 h-8 bg-gray-800 rounded-l-lg"></div>

                  {/* Volume Buttons */}
                  <div className="absolute -left-1 top-16 w-1 h-6 bg-gray-800 rounded-r-lg"></div>
                  <div className="absolute -left-1 top-24 w-1 h-6 bg-gray-800 rounded-r-lg"></div>

                  {/* Screen */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 rounded-[1.85rem] bg-black/40 backdrop-blur-xl border border-gray-700/50 overflow-hidden">
                    {/* Subtle Glare Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[1.85rem]"></div>

                    {/* Mobile App Interface */}
                    <div className="absolute inset-0 p-2 text-[8px] font-mono text-gray-300/80">
                      {/* Status Bar */}
                      <div className="flex items-center justify-between mb-1 px-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span>Home</span>
                        </div>
                        <div className="text-gray-500">12:30</div>
                      </div>

                      {/* App Content */}
                      <div className="relative w-full h-full overflow-hidden bg-gray-900">
                        {/* App Screens Container */}
                        <div className="absolute inset-0">
                          {/* Screen 1: Ghost Layout */}
                          <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col p-4 ${activeScreen === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          >
                            {/* App Bar */}
                            <div className="flex justify-between items-center mb-3">
                              <div className="w-8 h-2 bg-gray-700 rounded-md"></div>
                              <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                            </div>

                            {/* Header */}
                            <div className="space-y-2 mb-4">
                              <div className="w-24 h-2.5 bg-gray-700 rounded-md"></div>
                              <div className="w-32 h-2 bg-gray-800 rounded-md"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              <div className="h-8 bg-gray-800/70 rounded-md"></div>
                              <div className="h-8 bg-gray-800/70 rounded-md"></div>
                              <div className="h-8 bg-blue-700/40 rounded-md relative overflow-hidden">
                                {showClickEffect && (
                                  <span className="absolute inset-0 bg-white/30 rounded-full animate-buttonRipple pointer-events-none"></span>
                                )}
                              </div>
                              <div className="py-4"></div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="h-12 bg-gray-800/50 rounded-md"></div>
                                <div className="h-12 bg-gray-800/50 rounded-md"></div>
                              </div>
                              <div className="h-12 bg-gray-800/50 rounded-md"></div>
                            </div>

                            {/* Bottom */}
                            <div className="mt-4 flex justify-center">
                              <div className="w-20 h-1.5 bg-gray-800 rounded-md"></div>
                            </div>
                          </div>

                          {/* Screen 2: Ghost Layout */}
                          <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col p-4 ${activeScreen === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          >
                            {/* App Bar */}
                            <div className="flex justify-between items-center mb-3">
                              <div className="w-20 h-2.5 bg-gray-700 rounded-md"></div>
                              <div className="flex space-x-2">
                                <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                                <div className="w-4 h-4 bg-blue-700/60 rounded-full"></div>
                              </div>
                            </div>

                            {/* List Items */}
                            <div className="flex-1 space-y-2">
                              <div className="h-16 bg-gray-800/50 rounded-md p-2 flex">
                                <div className="w-10 h-10 bg-gray-700 rounded-md mr-2"></div>
                                <div className="flex-1 flex flex-col justify-center space-y-1.5">
                                  <div className="w-24 h-2 bg-gray-700 rounded-md"></div>
                                  <div className="w-16 h-1.5 bg-gray-800 rounded-md"></div>
                                </div>
                              </div>

                              <div className="h-16 bg-gray-800/50 rounded-md p-2 flex">
                                <div className="w-10 h-10 bg-gray-700 rounded-md mr-2"></div>
                                <div className="flex-1 flex flex-col justify-center space-y-1.5">
                                  <div className="w-24 h-2 bg-gray-700 rounded-md"></div>
                                  <div className="w-16 h-1.5 bg-gray-800 rounded-md"></div>
                                </div>
                              </div>

                              <div className="h-16 bg-gray-800/50 rounded-md p-2 flex">
                                <div className="w-10 h-10 bg-gray-700 rounded-md mr-2"></div>
                                <div className="flex-1 flex flex-col justify-center space-y-1.5">
                                  <div className="w-24 h-2 bg-gray-700 rounded-md"></div>
                                  <div className="w-16 h-1.5 bg-gray-800 rounded-md"></div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Nav */}
                            <div className="h-12 mt-4 border-t border-gray-800 pt-2 flex justify-around">
                              <div className="w-6 h-6 bg-blue-700/60 rounded-md"></div>
                              <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                              <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                            </div>
                          </div>

                          {/* Screen 3: Ghost Layout */}
                          <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col p-4 ${activeScreen === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          >
                            {/* App Bar */}
                            <div className="flex items-center mb-3">
                              <div className="w-5 h-5 bg-gray-700 rounded-md mr-2"></div>
                              <div className="w-24 h-2.5 bg-gray-700 rounded-md"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              <div className="h-28 bg-gray-800/50 rounded-md flex items-center justify-center">
                                <div className="w-16 h-16 bg-gray-700/60 rounded-full"></div>
                              </div>

                              <div className="h-16 bg-gray-800/50 rounded-md p-2">
                                <div className="w-full space-y-1.5">
                                  <div className="flex justify-between">
                                    <div className="w-16 h-2 bg-gray-700 rounded-md"></div>
                                    <div className="w-8 h-2 bg-green-700/60 rounded-md"></div>
                                  </div>
                                  <div className="w-32 h-1.5 bg-gray-800 rounded-md"></div>
                                  <div className="w-24 h-1.5 bg-gray-800 rounded-md"></div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="h-10 bg-blue-700/40 rounded-md"></div>
                                <div className="h-10 bg-gray-800/70 rounded-md"></div>
                                <div className="h-10 bg-gray-800/70 rounded-md"></div>
                                <div className="h-10 bg-red-700/40 rounded-md"></div>
                              </div>
                            </div>

                            {/* Bottom Nav */}
                            <div className="h-12 mt-4 border-t border-gray-800 pt-2 flex justify-around">
                              <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                              <div className="w-6 h-6 bg-blue-700/60 rounded-md"></div>
                              <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-700/5 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-purple-700/5 rounded-full filter blur-3xl opacity-50"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 px-4 pt-6 pb-2 bg-[#1C2333]/50 border border-gray-700/50 rounded-lg text-gray-100 
                           outline-none transition-all duration-300
                           focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20
                           peer placeholder-transparent"
                  placeholder="Username"
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200
                           peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400
                           peer-[:not(:placeholder-shown)]:-translate-y-3 
                           peer-[:not(:placeholder-shown)]:scale-90 
                           peer-[:not(:placeholder-shown)]:text-blue-400"
                >
                  Username
                </label>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 pt-6 pb-2 bg-[#1C2333]/50 border border-gray-700/50 rounded-lg text-gray-100 
                           outline-none transition-all duration-300
                           focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20
                           peer placeholder-transparent"
                  placeholder="Password"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200
                           peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400
                           peer-[:not(:placeholder-shown)]:-translate-y-3 
                           peer-[:not(:placeholder-shown)]:scale-90 
                           peer-[:not(:placeholder-shown)]:text-blue-400"
                >
                  Password
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50
                       transition-all duration-300 rounded-lg text-white font-medium
                       focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
