import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock,EyeOff,Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  goToView: (view: "forgotPassword") => void;
}

export const Login = ({ goToView }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/"); 
  };

  return (
    <>
       <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Connect securely to your VMS server instance.</p>
       </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Username</label>
          <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="admin@company"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

        {/* Remember & Forgot */}
           <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            className="
                              h-4 w-4
                              rounded-[4px]
                              border border-slate-300
                              data-[state=checked]:bg-blue-600
                              data-[state=checked]:border-blue-600
                            "
                          />
                              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                                Remember me
                              </label>
                            </div>
                              <button
                              type="button"
                              onClick={() => goToView("forgotPassword")}
                              className="text-sm text-blue-600 hover:underline font-medium"
                            >
                              Forgot password?
                            </button>
                          </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-700 hover:bg-blue-500 text-white font-medium rounded-lg"
        >
          Connect to server
        </Button>
      </form>
      <div className="text-center mt-6 border-t pt-5">
                  <span className="text-slate-500 text-sm">Need help connecting? </span>
                  <a href="#" className="text-blue-700 text-sm underline">View connection guide</a>
                </div>
    </>
  );
};
