import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  goToView: (view: "emailSent" | "contactAdmin") => void;
}

export const ForgotPasswordForm = ({ goToView }: Props) => {
  const [forgotUsername, setForgotUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!forgotUsername) return;
      if (forgotUsername.includes("operator")) {
        goToView("contactAdmin");
      } else {
        goToView("emailSent");
      }
  };

  return (
    <>
         <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-slate-800 mb-2">Forgot Password?</h2>
            <p className="text-slate-500">Enter your username to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
           <label className="text-sm font-semibold text-slate-700">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <select
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
              className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-blue-500 text-slate-700 bg-white"
            >
              <option value="" disabled>
                Select username
              </option>
              <option value="admin@company">admin@company</option>
              <option value="operator@company">operator@company</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg">
          Continue →
        </Button>

          <div className="text-center mt-6 border-t pt-5">
                  <span className="text-slate-500 text-sm">Need help connecting? </span>
                  <a href="#" className="text-blue-700 text-sm underline">View connection guide</a>
                </div>
                
      </form>
    </>
  );
};
