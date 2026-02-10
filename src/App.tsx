import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PointsProvider } from "@/contexts/PointsContext";
import BreakReminder from "@/components/BreakReminder";
import Home from "./pages/Home";
import Index from "./pages/Index";
import FocusMode from "./pages/FocusMode";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <PointsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BreakReminder />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app" element={<Index />} />
                <Route path="/focus" element={<FocusMode />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PointsProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
