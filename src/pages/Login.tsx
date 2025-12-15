import { useState } from "react";
import { Eye, EyeOff, User, Lock, Zap, Database, Bell, Play, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Real-time Device Monitoring",
      description: "Monitor camera feeds and IoT sensors in real-time with low-latency streaming."
    },
    {
      icon: Database,
      title: "Centralized Playback",
      description: "Access recorded footage from distributed storage nodes in one unified timeline."
    },
    {
      icon: Bell,
      title: "Smart Health Alerts",
      description: "Receive instant notifications for device offline status, motion detection, and errors."
    },
    {
      icon: Play,
      title: "Centralized Playback",
      description: "Access recorded footage from distributed storage nodes in one unified timeline."
    },
    {
      icon: Settings,
      title: "Easy Onboarding",
      description: "Seamlessly discover and configure new cameras with our auto-provisioning tools."
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard after login
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient with Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col w-full p-8">
          {/* Logo */}
          <div className="text-2xl font-bold text-slate-800">CamPulse</div>
          
          {/* Features Card */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Whats New?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">{feature.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>© 2025 Transline Security Systems. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Connect securely to your VMS server instance.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="admin@company"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
            >
              Connect to server →
            </Button>
          </form>

          {/* Help Link */}
          <div className="text-center mt-6">
            <span className="text-slate-500 text-sm">Need help connecting? </span>
            <a href="#" className="text-blue-600 text-sm hover:underline">View connection guide</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
