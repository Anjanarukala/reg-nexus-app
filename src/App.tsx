import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Layout from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CourseTypes from "./pages/CourseTypes";
import Courses from "./pages/Courses";
import CourseOfferings from "./pages/CourseOfferings";
import StudentRegistration from "./pages/StudentRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course-types" element={<CourseTypes />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course-offerings" element={<CourseOfferings />} />
              <Route path="/registrations" element={<StudentRegistration />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
