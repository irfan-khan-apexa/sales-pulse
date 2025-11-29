import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DSRPage from "@/pages/DSRPage";
import ProductsPage from "@/pages/ProductsPage";
import UploadPage from "@/pages/UploadPage";
import SettingsPage from "@/pages/Settings Page";
import AnalyticsPage from "@/pages/AnalyticsPage";
import HierarchyPage from "@/pages/HierarchyPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dsr" element={<DSRPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/profile" element={<SettingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="hierarchy" element={<HierarchyPage />} />
              <Route path="hierarchy/regions" element={<HierarchyPage />} />
              <Route path="hierarchy/areas" element={<HierarchyPage />} />
              <Route path="hierarchy/territories" element={<HierarchyPage />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
