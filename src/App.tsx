
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Pipeline from "@/pages/Pipeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prospects" element={<Prospects />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/marketing" element={<div className="p-6"><h1 className="text-3xl font-bold">Campagnes Marketing</h1><p className="text-gray-600 mt-2">Automation marketing seniors - En développement</p></div>} />
              <Route path="/reporting" element={<div className="p-6"><h1 className="text-3xl font-bold">Rapports & Analyses</h1><p className="text-gray-600 mt-2">Analytics avancés - En développement</p></div>} />
              <Route path="/comparateur" element={<div className="p-6"><h1 className="text-3xl font-bold">Comparateur d'offres</h1><p className="text-gray-600 mt-2">Intégration Oggo Data - En développement</p></div>} />
              <Route path="/admin/users" element={<div className="p-6"><h1 className="text-3xl font-bold">Gestion des utilisateurs</h1><p className="text-gray-600 mt-2">Administration des comptes - En développement</p></div>} />
              <Route path="/admin/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Paramètres généraux</h1><p className="text-gray-600 mt-2">Configuration système - En développement</p></div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
