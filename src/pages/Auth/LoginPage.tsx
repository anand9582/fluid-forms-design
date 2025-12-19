import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Login } from "./Login";
import { ForgotPasswordForm } from "./ForgotPassword";
import { EmailSent } from "./EmailSent";
import { ContactAdmin } from "./ContactAdmin";
import {
  RealtimeIcon,
  PlaybackIcon,
  SmartAlertIcon,
  CallIcon  
} from "@/components/ui/icons";

type View = "login" | "forgotPassword" | "emailSent" | "contactAdmin";

export const LoginPage = () => {
  const [view, setView] = useState<View>("login");
  const [viewHistory, setViewHistory] = useState<View[]>([]);

  const goToView = (nextView: View) => {
    setViewHistory((prev) => [...prev, view]);
    setView(nextView);
  };

  const goBack = () => {
    setViewHistory((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setView(last);
      return prev.slice(0, -1);
    });
  };

  const features = [
    {
      icon: RealtimeIcon,
      title: "Real-time Device Monitoring",
      description:
        "Monitor camera feeds and IoT sensors in real-time with low-latency streaming.",
    },
    {
      icon: PlaybackIcon,
      title: "Centralized Playback",
      description:
        "Access recorded footage from distributed storage nodes in one unified timeline.",
    },
    {
      icon: SmartAlertIcon,
      title: "Smart Health Alerts",
      description:
        "Receive instant notifications for device offline status, motion detection, and errors.",
    },
    {
      icon: RealtimeIcon,
      title: "Centralized Playback",
      description:
        "Access recorded footage from distributed storage nodes in one unified timeline.",
    },
     {
      icon: RealtimeIcon,
      title: "Easy Onboarding",
      description:
        "Seamlessly discover and configure new cameras with our auto-provisioning tools.",
    },
  ];

  return (
    <div className="min-h-screen flex">
   {/* Left Side - Gradient with Features */}
      <div className="hidden lg:flex max-w-[641px] relative">
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#9DC6E8] via-[#FC9591] to-[#F86582]"
        />
        <div className="relative z-10 flex flex-col w-full p-8 lg:w-[600px]">
          <div className="text-xl font-bold text-slate-800 mb-6">CamPulse</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-[370px] shadow-xl">
              <h3 className="text-md font-roboto font-semibold text-slate-800 mb-5">What's New?</h3>
               <div className="space-y-4">
              {features.map((feature, index) => {
                   const isLast = index === features.length - 1;
                      return (
                        <div key={index} className="flex gap-4 items-start mb-6">
                          <div className="flex-shrink-0 w-7 h-7 rounded bg-blue-100 flex items-center justify-center">
                            <feature.icon className="w-4 h-4 text-blue-600" />
                          </div>

                          <div>
                            <h4 className="text-slate-800 text-md font-medium mb-1">
                               {feature.title}
                            </h4>

                            <p
                              className={`text-slate-500 text-xs ${
                                isLast ? "mb-6" : "mb-2"
                              }`}
                            >
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-6 text-white">
            <span className="text-[12px]">© 2025 Transline Security Systems. All rights reserved.</span>
            <div className="flex gap-3">
              <a href="#" className="text-white/70 hover:underline text-[12px]">Privacy Policy</a>
              <a href="#" className="text-white/70 hover:underline text-[12px]">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Views */}
        <div className="w-full  flex items-center justify-center p-8 bg-white relative">
        {view !== "login" && (
          <button onClick={goBack} className="absolute top-4 left-4 p-2 rounded-full bg-[#F5F5F5] hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        )}

        <div className="w-full max-w-[454px]">
          {view === "login" && <Login goToView={goToView} />}
          {view === "forgotPassword" && <ForgotPasswordForm goToView={goToView} />}
          {view === "emailSent" && <EmailSent goToView={goToView} />}
          {view === "contactAdmin" && <ContactAdmin />}
        </div>
      </div>
    </div>
  );
};
