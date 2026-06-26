import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/auth/AuthContext";
import AdminGuard from "@/auth/AdminGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Philosophy from "./pages/Philosophy";
import Biens from "./pages/Biens";
import BienDetail from "./pages/BienDetail";
import Destinations from "./pages/Destinations";
import Signature from "./pages/Signature";
import Services from "./pages/Services";
import Acheter from "./pages/Acheter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminBiensList from "./pages/admin/AdminBiensList";
import AdminBienEdit from "./pages/admin/AdminBienEdit";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import Confidentialite from "./pages/Confidentialite";
import useVisitTracker from "./hooks/useVisitTracker";

const queryClient = new QueryClient();

const VisitTracker = () => {
  useVisitTracker();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <VisitTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/biens" element={<Biens />} />
              <Route path="/biens/:slug" element={<BienDetail />} />
              <Route path="/collection" element={<Navigate to="/biens" replace />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/signature" element={<Signature />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confidentialite" element={<Confidentialite />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/biens" element={<AdminGuard><AdminBiensList /></AdminGuard>} />
              <Route path="/admin/biens/nouveau" element={<AdminGuard><AdminBienEdit /></AdminGuard>} />
              <Route path="/admin/biens/:id/edit" element={<AdminGuard><AdminBienEdit /></AdminGuard>} />
              <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
