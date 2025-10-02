
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MentorshipPage from "./pages/mentorship";
import MockInterviewsPage from "./pages/mock-interviews";
import HubsPage from "./pages/hubs";
import EventsPage from "./pages/events";
import ResourcesPage from "./pages/resources";
import AboutPage from "./pages/about";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog/[id]";
import ContactPage from "./pages/contact";
import ForumPage from "./pages/forum";
import ForumPostPage from "./pages/forum/post/[id]";
import ForumCategoryPage from "./pages/forum/category/[id]";
import Dashboard from "./pages/dashboard";
import ProfilePage from "./pages/profile";

// Import the campus and integrating pages
import CampusTourPage from "./pages/campus/tour";
import CampusFacilitiesPage from "./pages/campus/facilities";
import CampusHistoryPage from "./pages/campus/history";
import IntegratingOpportunitiesPage from "./pages/integrating/opportunities";
import MentoringPage from "./pages/integrating/mentoring";
import LocalNetworkingPage from "./pages/integrating/networking";
import OfficeBarriersPage from "./pages/office-barriers";
import ChatPage from "./pages/chat";
import AlumniPage from "./pages/alumni";
import AlumniPrivacySettingsPage from "./pages/alumni/privacy-settings";
import CallPage from "./pages/mock-interviews/call";
import RAGDemoPage from "./pages/rag-demo";
import { AuthProvider } from "./hooks/useAuth";

const AnimatedRoutes = () => {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
        <Route path="/mock-interviews" element={<MockInterviewsPage />} />
        <Route path="/mock-interviews/call" element={<CallPage />} />
        <Route path="/hubs" element={<HubsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/alumni/privacy-settings" element={<AlumniPrivacySettingsPage />} />
        
        {/* Campus Routes */}
        <Route path="/campus/tour" element={<CampusTourPage />} />
        <Route path="/campus/facilities" element={<CampusFacilitiesPage />} />
        <Route path="/campus/history" element={<CampusHistoryPage />} />
        
        {/* Integrating Routes */}
        <Route path="/integrating/opportunities" element={<IntegratingOpportunitiesPage />} />
        <Route path="/integrating/mentoring" element={<MentoringPage />} />
        <Route path="/integrating/networking" element={<LocalNetworkingPage />} />
        
        {/* Office Barriers Route */}
        <Route path="/office-barriers" element={<OfficeBarriersPage />} />
        
        {/* Chat Route */}
        <Route path="/chat" element={<ChatPage />} />
        
        {/* Forum Routes */}
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/post/:id" element={<ForumPostPage />} />
        <Route path="/forum/category/:id" element={<ForumCategoryPage />} />
        
        {/* RAG Demo Route */}
        <Route path="/rag-demo" element={<RAGDemoPage />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
