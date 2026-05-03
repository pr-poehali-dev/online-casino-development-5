import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import GamesPage from "@/pages/GamesPage";
import TournamentsPage from "@/pages/TournamentsPage";
import BonusesPage from "@/pages/BonusesPage";
import SupportPage from "@/pages/SupportPage";
import AboutPage from "@/pages/AboutPage";
import ProfilePage from "@/pages/ProfilePage";
import KamikazePage from "@/pages/KamikazePage";
import AppleOfFortunePage from "@/pages/AppleOfFortunePage";
import AviamastersPage from "@/pages/AviamastersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/games" element={<Layout><GamesPage /></Layout>} />
          <Route path="/tournaments" element={<Layout><TournamentsPage /></Layout>} />
          <Route path="/bonuses" element={<Layout><BonusesPage /></Layout>} />
          <Route path="/support" element={<Layout><SupportPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/games/kamikaze" element={<KamikazePage />} />
          <Route path="/games/apple-of-fortune" element={<AppleOfFortunePage />} />
          <Route path="/games/aviamasters" element={<AviamastersPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;