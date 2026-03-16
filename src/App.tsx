import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import { LoginPage } from "@/pages/Auth/LoginPage";
import SettingsOverview from "@/components/settings/SettingsOverview";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsLayout } from "@/components/layout/SettingsLayout";

import NotFound from "./pages/NotFound";
import LiveView from "@/pages/LiveView";
import PlayBack from "@/pages/PlayBack";
import { ProtectedRoute } from "@/components/Routes/ProtectedRoute";
import AlertPage from "./pages/alert";
import HealthPage from "./pages/health";
import { AddDevicesPage } from "@/components/settings/AddedDevices";
import { ManageUsersTabs  } from "@/components/settings/ManageUsersTabs/ManageUsersPages";
import ConfigureDevicesPage from "@/components/settings/configure-devices/ConfigureDevicesPage";
import { AddedDevicesPage } from "@/components/settings/Added-Devices/AddedDevicesPage";
import StorageIndex from "@/components/settings/StorageIndex";

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
            {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Index />} />
              {/* <Route path="/" element={<AddedDevicesPage />} /> */}
              <Route path="/live" element={<LiveView />} />
              <Route path="/alerts" element={<AlertPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/playback" element={<PlayBack />} />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route element={<SettingsOverview />}>
                  <Route index element={<Navigate to="users" replace />} />
                  <Route path="users" element={<ManageUsersTabs />} />
                  <Route path="devices/add" element={<AddDevicesPage />} />
                   <Route path="devices/adddevices" element={<AddedDevicesPage />} />
                  <Route path="devices/configure" element={<ConfigureDevicesPage />} />
                    <Route path="/settings/storage" element={<StorageIndex />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
            {/* </Route> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

