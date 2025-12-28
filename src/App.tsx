import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import { LoginPage } from "@/pages/Auth/LoginPage";
import SettingsOverview from "@/components/settings/SettingsOverview";
import ManageUsers from "@/components/settings/ManageUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFound />} />
                 <Route path="/settings" element={<SettingsLayout />}>
                    <Route index element={<SettingsOverview />} />
                    <Route path="users" element={<ManageUsers />} />
                </Route>
            </Routes>
            </AppLayout>
            
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
