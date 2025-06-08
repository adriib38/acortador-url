import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login.page";
import Home from "./pages/Home.page";
import PrivateRoute from "./auth/privateRoute";
import PublicRoute from "./auth/publicRoute";
import Shortener from "./pages/Shortener.page";
import Profile from "./pages/UserLinks.page";
import Navbar from "./components/shared/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/new-link"
            element={
              <PrivateRoute>
                <Shortener />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <>
                  import { useAuth } from "./auth/useAuth";
                  const { logout } = useAuth();
                  logout();
                  <h1>Has cerrado sesión correctamente</h1>
                </>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NavbarWrapper() {
  const { isAuthenticated } = require('./auth/useAuth').useAuth();
  return isAuthenticated ? <Navbar /> : null;
}

export default App;
