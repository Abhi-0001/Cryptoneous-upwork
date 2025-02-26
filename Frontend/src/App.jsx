import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AuthProvider from "./contexts/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

// const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="" index element={<HomePage />} />

            <Route path="user" element={<ProtectedRoute />}>
              <Route path="task" element={<TasksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="worker" element={<ProtectedRoute />}>
              <Route path="task" element={<TasksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
