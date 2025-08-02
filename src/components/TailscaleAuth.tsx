import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Wifi, Lock } from 'lucide-react';

interface Message {
  text: string;
  icon: React.ReactNode;
  delay: number;
}

const TailscaleAuth: React.FC = () => {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);
  const [networkDenied, setNetworkDenied] = useState(false);
  const [showMessages, setShowMessages] = useState(true);

  const messages: Message[] = [
    {
      text: "Verifying secure network access...",
      icon: <Shield className="w-6 h-6" />,
      delay: 0
    },
    {
      text: "Scanning Tailscale network...",
      icon: <Wifi className="w-6 h-6" />,
      delay: 1500
    },
    {
      text: "Establishing encrypted connection...",
      icon: <Lock className="w-6 h-6" />,
      delay: 3000
    }
  ];

  // Cycle through messages
  useEffect(() => {
    if (!showMessages) return;

    const timer = setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, messages[currentMessageIndex]?.delay || 1500);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, showMessages]);

  // Verify Tailscale network connection
  useEffect(() => {
    const verifyTailscaleConnection = async () => {
      try {
        // Wait a moment for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Attempt to reach your private Tailscale API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('https://jacobs-macbook-pro.tailf531bd.ts.net/api/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // Show success message briefly
          setShowMessages(false);
          setCurrentMessageIndex(0);
          
          // Brief success animation
          setTimeout(() => {
            setIsVerifying(false);
            // Redirect to dashboard after success animation
            setTimeout(() => navigate('/dashboard'), 1000);
          }, 500);
        } else {
          // Network accessible but not authorized
          setIsVerifying(false);
          setNetworkDenied(true);
          setShowMessages(false);
        }
      } catch (error) {
        // Network not accessible or timeout
        console.log('Tailscale network verification failed:', error);
        setIsVerifying(false);
        setNetworkDenied(true);
        setShowMessages(false);
      }
    };

    verifyTailscaleConnection();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-4">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-800/50 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-2xl">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            {isVerifying && (
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-ping" />
            )}
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Arlo
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Secure Network Access
        </p>

        {/* Loading Messages */}
        {isVerifying && showMessages && (
          <div className="space-y-6 mb-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center justify-center space-x-3 transition-all duration-1000 ${
                  index <= currentMessageIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-blue-400 animate-spin">
                  {message.icon}
                </div>
                <span className="text-slate-300 text-lg font-medium">
                  {message.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Success State */}
        {!isVerifying && !networkDenied && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-emerald-300 text-xl font-semibold">
                Secure Tailscale network detected
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-emerald-300 text-lg">
                Encrypted link established
              </span>
            </div>
            <div className="text-slate-400">
              Redirecting to dashboard...
            </div>
          </div>
        )}

        {/* Access Denied State */}
        {networkDenied && (
          <div className="animate-fade-in">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-4">
                Network Access Denied
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                You must be connected to the private Tailscale network to continue.
              </p>
              <div className="mt-6 pt-6 border-t border-red-500/20">
                <p className="text-sm text-slate-500">
                  Contact your administrator if you believe this is an error.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {isVerifying && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailscaleAuth;
