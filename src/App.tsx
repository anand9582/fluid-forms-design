import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route ,Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import { LoginPage } from "@/pages/Auth/LoginPage";
import SettingsOverview from "@/components/settings/SettingsOverview";
// import ManageUsers from "@/components/settings/ManageUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
// import { AddedDevicesPage } from "@/components/settings/Added-Devices/AddedDevicesPage";
import NotFound from "./pages/NotFound";
import LiveView from "@/pages/LiveView";
import PlayBack from "@/pages/PlayBack";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            className:
              "rounded-xl shadow-2xl border text-sm font-medium",
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Index />} />
                  {/* <Route path="/" element={<AddedDevicesPage />} /> */}
                  <Route path="/live" element={<LiveView />} />
                   <Route path="/playback" element={<PlayBack />} />
                  <Route path="/settings" element={<SettingsLayout />}>
                    <Route index element={<SettingsOverview />} />
                  </Route>
                   <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

