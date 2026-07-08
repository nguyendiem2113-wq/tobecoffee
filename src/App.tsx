import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Story from "./pages/Story";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/NotFound";
import SiteMeta from "./components/SiteMeta";
import { setupAutoRefresh, setupKeepAlive } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Tự động làm mới cache khi kết nối trở lại để dữ liệu không bị cũ.
    const stopRefresh = setupAutoRefresh();
    // Giữ Supabase luôn "thức" để không bị pause khi thiếu tương tác.
    const stopKeepAlive = setupKeepAlive();
    return () => {
      stopRefresh();
      stopKeepAlive();
    };
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteMeta />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/story" element={<Story />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:category" element={<Product />} />
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
