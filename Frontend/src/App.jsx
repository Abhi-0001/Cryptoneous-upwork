import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="" index element={<HomePage />} />
            <Route path="task" element={<TasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
