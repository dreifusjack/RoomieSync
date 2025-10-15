import React, { useState } from "react";
import { useLogin, useRegister } from "@/hooks/auth.hooks";

const LoginForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const activeMutation = isSignup ? registerMutation : loginMutation;
  const loading = activeMutation.isPending;
  const error = activeMutation.error?.message || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      registerMutation.mutate({ email, password, firstName, lastName });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Welcome section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-6">Welcome to RoomieSync!</h2>
            <div className="w-20 h-1 bg-white/30 rounded-full mb-6"></div>
          </div>

          <p className="text-xl leading-relaxed mb-8 text-white/90">
            RoomieSync is a roommate organization app that simplifies shared
            living through task management, and expense tracking.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/80">
                Organize household tasks efficiently
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/80">
                Track shared expenses seamlessly
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/80">
                Coordinate schedules with roommates
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600">
              {isSignup
                ? "Join your roommate community"
                : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="peer w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                    placeholder="First Name"
                  />
                  <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                    First Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="peer w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                    placeholder="Last Name"
                  />
                  <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                    Last Name
                  </label>
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                placeholder="Email Address"
              />
              <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                Email Address
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                placeholder="Password"
              />
              <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
