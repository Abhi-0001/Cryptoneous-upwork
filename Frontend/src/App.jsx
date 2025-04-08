import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import AuthProvider from "./contexts/AuthProvider";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRouteUser from "./routes/ProtectedRouteUser";
import ProtectedRouteWorker  from "./routes/ProtectedRouteWorker";
import TasksPage from "./pages/TasksPage";
import User from "./pages/User";
import Worker from "./pages/Worker";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />

            <Route path="user" element={<ProtectedRouteUser> 
                <User /> 
              </ProtectedRouteUser>}
              >
              <Route index element={<User />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="worker" element={<ProtectedRouteWorker> <Worker /> </ProtectedRouteWorker>}>
              <Route  index element={<Worker />} />
              <Route path="tasks" element={<TasksPage />} />
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
